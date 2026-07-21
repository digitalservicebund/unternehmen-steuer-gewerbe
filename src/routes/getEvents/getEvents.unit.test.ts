import { describe, it, expect, vi, afterEach } from "vitest";

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

describe("Route GET /api/v1/register-gewerbe/gewerbemeldung/events", () => {
  afterEach(() => vi.restoreAllMocks());

  const ars = "146120000000"; // ARS Dresden -> AGS 14612000

  describe("with a fitConnectDestinationId (FIT-Connect)", () => {
    const submissionId = "dbc4efa5-58e7-4527-8898-00d58450c68e";
    const fitConnectDestinationId = "83a5a303-24a2-4e0a-8b4b-8f4c6c4b1f2b";

    it("fetches the FIT-Connect submission events for the given submissionId and destinationId", async () => {
      mockGetSubmissionEvents.mockResolvedValueOnce({
        count: 1,
        offset: 0,
        totalCount: 1,
        eventLog: [{ eventType: "accept-submission" }],
      });

      const response = await getEvents({ submissionId, ars, fitConnectDestinationId });
      const json = await response.json();

      const [calledSubmissionId, calledDestinationId] = mockGetSubmissionEvents.mock.calls[0]!;
      expect(calledSubmissionId).toBe(submissionId);
      expect(calledDestinationId).toBe(fitConnectDestinationId);
      expect(response.status).toBe(200);
      expect(json).toEqual({
        count: 1,
        offset: 0,
        totalCount: 1,
        eventLog: [{ eventType: "accept-submission" }],
      });
    });

    it("returns 404 when no submission events are found", async () => {
      mockGetSubmissionEvents.mockResolvedValueOnce(undefined);

      const response = await getEvents({ submissionId, ars, fitConnectDestinationId });

      expect(response.status).toBe(404);
    });
  });

  describe("without a fitConnectDestinationId (OSCI)", () => {
    const messageId = "vps_by_178357726143931b13e14-2c78-4aa6-ba2c-0d911ec02d82";

    it("derives the OSCI authorityKey MELDID:14612000 from the ars and maps the matching track's events", async () => {
      mockGetTransportReport.mockResolvedValueOnce({
        identifiers: {
          messageID: messageId,
          serviceID: "service",
          authorityKey: "MELDID:14612000",
        },
        tracks: [
          {
            id: messageId,
            subject: "subject",
            recentModification: "2026-01-01T00:00:00Z",
            events: [{ type: "accept-submission", timestamp: "2026-01-01T00:00:00Z" }],
            verifications: [],
            rawData: "<xml/>",
          },
        ],
      });

      const response = await getEvents({ submissionId: messageId, ars });
      const json = await response.json();

      const [reportOptions] = mockGetTransportReport.mock.calls[0]!;
      expect(reportOptions.messageId).toBe(messageId);
      expect(reportOptions.authorityKey).toBe("MELDID:14612000");
      expect(response.status).toBe(200);
      expect(json).toEqual({
        events: [{ eventType: "accept-submission", timestamp: "2026-01-01T00:00:00Z" }],
      });
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
