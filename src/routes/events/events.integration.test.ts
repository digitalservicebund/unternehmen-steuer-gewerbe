import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@digitalservicebund/unternehmen-steuer-gewerbe-privat", () => ({
  validateFsE: vi.fn().mockReturnValue({ valid: true }),
  createElsterFsEEUnXml: vi.fn().mockReturnValue("<xml/>"),
  sendFsE: vi.fn().mockReturnValue({ success: true }),
  getFinanzamtId: vi.fn().mockReturnValue(["mock-finanzamt-id"]),
  getFinanzamtDetailsById: vi.fn().mockReturnValue({
    name: "Finanzamt Mock",
    hausanschrift: {
      strasse: "Mockstraße",
      hausnummer: "1",
      postleitzahl: "00000",
      ort: "Mockstadt",
    },
    telefonnummer: "0000 000-0",
  }),
}));

const { mockGetSubmissionEvents, mockGetTransportReport } = vi.hoisted(() => ({
  mockGetSubmissionEvents: vi.fn(),
  mockGetTransportReport: vi.fn(),
}));

vi.mock("../../clients/fitConnectClient/fitConnectClient", () => ({
  getFitConnectClient: () => ({ getSubmissionEvents: mockGetSubmissionEvents }),
}));

vi.mock("../../clients/osciClient/osciClient", () => ({
  getOsciClient: () => ({ getTransportReport: mockGetTransportReport }),
}));

import app from "../../app";

function getEvents(query: Record<string, string>) {
  const params = new URLSearchParams(query);
  return app.request(`/api/v1/register-gewerbe/gewerbemeldung/events?${params}`);
}

function fitConnectEvent(eventName: string, iat: number) {
  return {
    iat,
    sub: "submission:02bf1d9f-282d-4abf-810a-c4104baf0afe",
    events: { [`https://schema.fitko.de/fit-connect/events/${eventName}`]: {} },
  };
}

describe("Route GET /api/v1/register-gewerbe/gewerbemeldung/events", () => {
  afterEach(() => vi.restoreAllMocks());

  const ars = "146120000000"; // ARS Dresden -> AGS 14612000

  describe("with a fitConnectDestinationId (FIT-Connect)", () => {
    const submissionId = "dbc4efa5-58e7-4527-8898-00d58450c68e";
    const fitConnectDestinationId = "83a5a303-24a2-4e0a-8b4b-8f4c6c4b1f2b";
    const iat = 1622796500;
    const timestamp = "2021-06-04T08:48:20.000Z";

    it.each([
      { eventName: "create-submission", status: "created" },
      { eventName: "submit-submission", status: "submitted" },
      { eventName: "notify-submission", status: "notify" },
      { eventName: "accept-submission", status: "accepted" },
      { eventName: "reject-submission", status: "rejected" },
    ])("maps FIT-Connect $eventName to $status", async ({ eventName, status }) => {
      mockGetSubmissionEvents.mockResolvedValueOnce({
        eventLog: [fitConnectEvent(eventName, iat)],
      });

      const response = await getEvents({ submissionId, ars, fitConnectDestinationId });
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json).toEqual({ events: [{ timestamp, status }] });
    });

    it.each([
      { label: "the payload is null", entry: null },
      { label: "the event has no name", entry: { iat } },
      {
        label: "the event has no iat",
        entry: { events: { "https://schema.fitko.de/fit-connect/events/accept-submission": {} } },
      },
      { label: "the event name is unknown", entry: fitConnectEvent("unknown-status", iat) },
    ])("drops the FIT-Connect entry when $label", async ({ entry }) => {
      mockGetSubmissionEvents.mockResolvedValueOnce({ eventLog: [entry] });

      const response = await getEvents({ submissionId, ars, fitConnectDestinationId });
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json).toEqual({ events: [] });
    });

    it("forwards submissionId and fitConnectDestinationId to the FIT-Connect client", async () => {
      mockGetSubmissionEvents.mockResolvedValueOnce({ eventLog: [] });

      await getEvents({ submissionId, ars, fitConnectDestinationId });

      const [calledSubmissionId, calledDestinationId] = mockGetSubmissionEvents.mock.calls[0]!;
      expect(calledSubmissionId).toBe(submissionId);
      expect(calledDestinationId).toBe(fitConnectDestinationId);
    });

    it("returns 404 when no FIT-Connect submission is found", async () => {
      mockGetSubmissionEvents.mockResolvedValueOnce(undefined);

      const response = await getEvents({ submissionId, ars, fitConnectDestinationId });

      expect(response.status).toBe(404);
    });
  });

  describe("without a fitConnectDestinationId (OSCI)", () => {
    const messageId = "vps_by_178357726143931b13e14-2c78-4aa6-ba2c-0d911ec02d82";

    function osciTransportReport(events: { type: string; timestamp: string }[]) {
      return {
        identifiers: {
          messageID: messageId,
          serviceID: "service",
          authorityKey: "MELDID:14612000",
        },
        tracks: [
          {
            id: messageId,
            subject: "subject",
            recentModification: "2026-01-03T00:00:00Z",
            events,
            verifications: [],
            rawData: "<xml/>",
          },
        ],
      };
    }

    it.each([
      { type: "creation", status: "submitted" },
      { type: "forwarding", status: "notify" },
      { type: "reception", status: "accepted" },
    ])("maps OSCI $type to $status", async ({ type, status }) => {
      const timestamp = "2026-01-01T00:00:00Z";
      mockGetTransportReport.mockResolvedValueOnce(osciTransportReport([{ type, timestamp }]));

      const response = await getEvents({ submissionId: messageId, ars });
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json).toEqual({ events: [{ timestamp, status }] });
    });

    it("drops unknown OSCI event types", async () => {
      mockGetTransportReport.mockResolvedValueOnce(
        osciTransportReport([{ type: "somethingElse", timestamp: "2026-01-04T00:00:00Z" }]),
      );

      const response = await getEvents({ submissionId: messageId, ars });
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json).toEqual({ events: [] });
    });

    it("queries the transport report with the messageId and MELDID authorityKey derived from the ars", async () => {
      mockGetTransportReport.mockResolvedValueOnce(osciTransportReport([]));

      await getEvents({ submissionId: messageId, ars });

      const [reportOptions] = mockGetTransportReport.mock.calls[0]!;
      expect(reportOptions.messageId).toBe(messageId);
      expect(reportOptions.authorityKey).toBe("MELDID:14612000");
    });

    it("returns 404 when no track matches the messageId", async () => {
      mockGetTransportReport.mockResolvedValueOnce({
        identifiers: {
          messageID: messageId,
          serviceID: "service",
          authorityKey: "MELDID:14612000",
        },
        tracks: [],
      });

      const response = await getEvents({ submissionId: messageId, ars });

      expect(response.status).toBe(404);
    });
  });
});
