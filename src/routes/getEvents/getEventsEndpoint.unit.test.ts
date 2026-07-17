import { afterEach, describe, expect, it, vi } from "vitest";

const { mockGetSubmissionEvents } = vi.hoisted(() => ({
  mockGetSubmissionEvents: vi.fn(),
}));

vi.mock("../../clients/fitConnectClient/fitConnectClient", () => ({
  getFitConnectClient: () => ({ getSubmissionEvents: mockGetSubmissionEvents }),
}));

import app from "../../app";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";

const SUBMISSION_ID = "dbc4efa5-58e7-4527-8898-00d58450c68e";

function getEvents(submissionId = SUBMISSION_ID) {
  return app.request(`/api/v1/register-gewerbe/${submissionId}/events`);
}

// Mocked counterpart of registerGewerbeEvents.contract.test.ts's "Returns 200 OK on GET
// with /:submissionId/events" - same route, against a mocked FIT-Connect client instead of a
// full real submission + live call. getSubmissionEvents itself is covered against a mocked
// FIT-Connect API in fitConnectClient.integration.test.ts.
describe("Route /api/v1/register-gewerbe/:submissionId/events", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Returns 200 OK with the submission's events", async () => {
    mockGetSubmissionEvents.mockResolvedValue({
      count: 1,
      offset: 0,
      totalCount: 1,
      eventLog: [{ eventType: "SubmissionReceived" }],
    });

    const response = await getEvents();

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(mockGetSubmissionEvents).toHaveBeenCalledWith(SUBMISSION_ID, expect.any(String));
  });

  it("Returns 404 NOT FOUND when the FIT-Connect client resolves no events", async () => {
    mockGetSubmissionEvents.mockResolvedValue(undefined);

    const response = await getEvents();

    expect(response.status).toEqual(HttpStatusCode.NotFound);
  });

  it("Returns 500 INTERNAL SERVER ERROR when the FIT-Connect client throws", async () => {
    mockGetSubmissionEvents.mockRejectedValue(new Error("FIT-Connect unavailable"));
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await getEvents();

    expect(response.status).toEqual(HttpStatusCode.InternalServerError);
    consoleErrorSpy.mockRestore();
  });
});
