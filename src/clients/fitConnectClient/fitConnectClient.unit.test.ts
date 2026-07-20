import { afterEach, describe, expect, it, vi } from "vitest";

const { mockFetchJson, mockEncryptData, mockVerifyEventToken } = vi.hoisted(() => ({
  mockFetchJson: vi.fn(),
  mockEncryptData: vi.fn(),
  mockVerifyEventToken: vi.fn(),
}));

vi.mock("../../helpers/fetchJson", () => ({
  fetchJson: mockFetchJson,
}));

vi.mock("./crypto", () => ({
  encryptData: mockEncryptData,
  verifyEventToken: mockVerifyEventToken,
}));

import { getFitConnectClient } from "./fitConnectClient";

function stubConfigEnv() {
  vi.stubEnv("FIT_CONNECT_OAUTH_TOKEN_URL", "https://fitconnect.example/oauth/token");
  vi.stubEnv("FIT_CONNECT_SUBMISSION_API_URL", "https://fitconnect.example/submission");
  vi.stubEnv("FIT_CONNECT_DESTINATION_API_URL", "https://fitconnect.example/destination");
  vi.stubEnv("FIT_CONNECT_ROUTING_API_URL", "https://fitconnect.example/routing");
  vi.stubEnv("FIT_CONNECT_CLIENT_ID", "client-id");
  vi.stubEnv("FIT_CONNECT_CLIENT_SECRET", "client-secret");
  vi.stubEnv("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK", JSON.stringify({ kid: "private-key" }));
}

function base64url(value: object) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function fakeJwt(header: object) {
  return `${base64url(header)}.${base64url({})}.signature`;
}

describe("FitConnectClient", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("submitData", () => {
    it("authenticates, creates a submission and PUTs the encrypted data", async () => {
      stubConfigEnv();
      mockFetchJson
        .mockResolvedValueOnce({ access_token: "token-1" }) // authenticate
        .mockResolvedValueOnce({ destinationId: "dest-1", encryptionKid: "kid-1" }) // destination
        .mockResolvedValueOnce({ kid: "kid-1" }) // public jwk
        .mockResolvedValueOnce({ caseId: "case-1", destinationId: "dest-1", submissionId: "sub-1" }) // create submission
        .mockResolvedValueOnce({
          caseId: "case-1",
          destinationId: "dest-1",
          submissionId: "sub-1",
          publicService: { description: null, identifier: "leika:1", name: "Gewerbe" },
        }); // final PUT
      mockEncryptData.mockResolvedValue("encrypted");

      const client = getFitConnectClient();
      const result = await client.submitData({
        destinationId: "dest-1",
        publicService: { identifier: "leika:1", name: "Gewerbe" },
        data: "<test>hello</test>",
        dataSchema: { schemaUri: "urn:test:schema", mimeType: "application/xml" },
      });

      expect(result.submissionId).toBe("sub-1");
      expect(mockFetchJson).toHaveBeenNthCalledWith(
        1,
        "https://fitconnect.example/oauth/token",
        expect.objectContaining({ method: "POST" }),
      );
      expect(mockFetchJson).toHaveBeenNthCalledWith(
        4,
        "https://fitconnect.example/submission/v2/submissions",
        expect.objectContaining({
          method: "POST",
          headers: { Authorization: "Bearer token-1" },
        }),
      );
      expect(mockFetchJson).toHaveBeenNthCalledWith(
        5,
        "https://fitconnect.example/submission/v2/submissions/sub-1",
        expect.objectContaining({
          method: "PUT",
          body: { encryptedData: "encrypted", encryptedMetadata: "encrypted" },
        }),
      );
    });
  });

  describe("getSubmissionEvents", () => {
    it("verifies each event log entry against the matching well-known or destination key", async () => {
      stubConfigEnv();
      const knownToken = fakeJwt({ kid: "known-kid" });
      const unknownToken = fakeJwt({ kid: "missing-kid" });
      mockFetchJson
        .mockResolvedValueOnce({ access_token: "token-1" }) // authenticate
        .mockResolvedValueOnce({
          count: 2,
          offset: 0,
          totalCount: 2,
          eventLog: [knownToken, unknownToken],
        }) // events
        .mockResolvedValueOnce({ keys: [{ kid: "known-kid" }] }) // well-known jwks
        .mockResolvedValueOnce({ count: 1, offset: 0, totalCount: 1, keys: [] }); // destination keys
      mockVerifyEventToken.mockResolvedValue({ eventType: "SUBMISSION_RECEIVED" });

      const client = getFitConnectClient();
      const result = await client.getSubmissionEvents("sub-1", "dest-1");

      expect(mockVerifyEventToken).toHaveBeenCalledTimes(1);
      expect(mockVerifyEventToken).toHaveBeenCalledWith(knownToken, { kid: "known-kid" });
      expect(result.eventLog).toEqual([{ eventType: "SUBMISSION_RECEIVED" }, null]);
    });
  });

  describe("getRoutes", () => {
    it("requests routes filtered by leikaKey and ags", async () => {
      stubConfigEnv();
      mockFetchJson.mockResolvedValueOnce({ count: 1, offset: 0, totalCount: 1, routes: [] });

      const client = getFitConnectClient();
      const result = await client.getRoutes("99050012104000", "14612000");

      expect(mockFetchJson).toHaveBeenCalledWith(
        "https://fitconnect.example/routing/v1/routes?leikaKey=99050012104000&ags=14612000",
        { headers: { Accept: "application/json" } },
      );
      expect(result.routes).toEqual([]);
    });
  });
});
