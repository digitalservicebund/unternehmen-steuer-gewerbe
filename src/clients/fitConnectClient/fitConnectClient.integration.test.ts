import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockFetchJson } = vi.hoisted(() => ({
  mockFetchJson: vi.fn(),
}));

vi.mock("../../helpers/fetchJson", () => ({
  fetchJson: mockFetchJson,
}));

import { getFitConnectClient } from "./fitConnectClient";
import {
  buildSubmissionEventsFixtures,
  buildSubmitDataFixtures,
} from "./fitConnectClient.fixtures";

const DESTINATION_ID = "test-destination-id";

function submitDataOptions() {
  return {
    destinationId: DESTINATION_ID,
    publicService: {
      identifier: "urn:de:fim:leika:leistung:99050012104000",
      name: "Gewerbe Anmeldung",
    },
    data: "<test>hello</test>",
    dataSchema: {
      schemaUri: "urn:xoev-de:kosit:standard:xgewerbeordnung",
      mimeType: "application/xml",
    },
  };
}

// Mocked counterpart of fitConnectClient.contract.test.ts - same scenarios and assertions,
// against FIT-Connect response fixtures instead of a live call. getRoutes stays untested here too
// (it.skip in the contract test, SG-1096: API has changed).
describe("FitConnectClient with mocked FIT-Connect responses", () => {
  beforeEach(() => {
    // Local .env holds an unresolved "op://..." 1Password reference for this secret;
    // getFitConnectClient JSON.parses it unconditionally, so it must be stubbed even though
    // this suite never uses it.
    vi.stubEnv("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK", "");
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });

  describe("submitData", () => {
    it("authenticates, creates submission, encrypts, and sends", async () => {
      const fixtures = await buildSubmitDataFixtures(DESTINATION_ID);
      mockFetchJson
        .mockResolvedValueOnce(fixtures.tokenResponse)
        .mockResolvedValueOnce(fixtures.destinationResponse)
        .mockResolvedValueOnce(fixtures.publicJwk)
        .mockResolvedValueOnce(fixtures.createSubmissionResponse)
        .mockResolvedValueOnce(fixtures.submitResultResponse);

      const client = getFitConnectClient();
      const result = await client.submitData(submitDataOptions());

      expect(result.submissionId).toBeDefined();
      expect(result.destinationId).toBe(DESTINATION_ID);
    });
  });

  describe("getSubmissionEvents", () => {
    it("returns events for a submission", async () => {
      const submitFixtures = await buildSubmitDataFixtures(DESTINATION_ID);
      mockFetchJson
        .mockResolvedValueOnce(submitFixtures.tokenResponse)
        .mockResolvedValueOnce(submitFixtures.destinationResponse)
        .mockResolvedValueOnce(submitFixtures.publicJwk)
        .mockResolvedValueOnce(submitFixtures.createSubmissionResponse)
        .mockResolvedValueOnce(submitFixtures.submitResultResponse);

      const client = getFitConnectClient();
      const submission = await client.submitData(submitDataOptions());

      const eventsFixtures = await buildSubmissionEventsFixtures();
      mockFetchJson
        .mockResolvedValueOnce(eventsFixtures.tokenResponse)
        .mockResolvedValueOnce(eventsFixtures.eventsResponse)
        .mockResolvedValueOnce(eventsFixtures.wellKnownJwksResponse)
        .mockResolvedValueOnce(eventsFixtures.destinationKeysResponse);

      const result = await client.getSubmissionEvents(submission.submissionId, DESTINATION_ID);

      expect(result.eventLog).toBeDefined();
    });
  });
});
