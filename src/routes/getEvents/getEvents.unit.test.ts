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

function getEvents(submissionId: string) {
  return app.request(`/api/v1/register-gewerbe/${submissionId}/events`);
}

describe("Route GET /api/v1/register-gewerbe/{submissionId}/events", () => {
  afterEach(() => vi.restoreAllMocks());

  describe("when submissionId is a UUID", () => {
    const submissionId = "dbc4efa5-58e7-4527-8898-00d58450c68e";

    it("returns the FIT-Connect submission events", async () => {
      mockGetSubmissionEvents.mockResolvedValueOnce({
        count: 1,
        offset: 0,
        totalCount: 1,
        eventLog: [{ eventType: "accept-submission" }],
      });

      const response = await getEvents(submissionId);
      const json = await response.json();

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

      const response = await getEvents(submissionId);

      expect(response.status).toBe(404);
    });
  });

  describe("when submissionId is not a UUID", () => {
    const messageId = "vps_by_178357726143931b13e14-2c78-4aa6-ba2c-0d911ec02d82";

    it("maps the matching OSCI transport report track's events to eventType/timestamp", async () => {
      mockGetTransportReport.mockResolvedValueOnce({
        identifiers: {
          messageID: messageId,
          serviceID: "service",
          authorityKey: "MELDID:09000099",
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

      const response = await getEvents(messageId);
      const json = await response.json();

      const [reportOptions] = mockGetTransportReport.mock.calls[0]!;
      expect(reportOptions.messageId).toBe(messageId);
      expect(typeof reportOptions.authorityKey).toBe("string");
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
          authorityKey: "MELDID:09000099",
        },
        tracks: [],
      });

      const response = await getEvents(messageId);

      expect(response.status).toBe(404);
    });
  });
});
