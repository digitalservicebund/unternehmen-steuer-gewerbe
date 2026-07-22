import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { exportJWK, generateKeyPair, SignJWT } from "jose";

const { mockFetchJson } = vi.hoisted(() => ({
  mockFetchJson: vi.fn(),
}));

vi.mock("../../helpers/fetchJson", () => ({
  fetchJson: mockFetchJson,
}));

import { getFitConnectClient } from "./fitConnectClient";

const OAUTH_TOKEN_RESPONSE = {
  access_token: "test-token",
  scope: "",
  token_type: "Bearer",
  expires_in: 3600,
};

async function signEvent(kid: string, privateKey: CryptoKey, payload: Record<string, unknown>) {
  return new SignJWT(payload).setProtectedHeader({ alg: "RS256", kid }).sign(privateKey);
}

function mockEventsFlow(options: {
  eventLog: string[];
  wellKnownJwks?: object[];
  destinationJwks?: object[];
}) {
  mockFetchJson
    .mockResolvedValueOnce(OAUTH_TOKEN_RESPONSE) // authenticate
    .mockResolvedValueOnce({
      count: options.eventLog.length,
      offset: 0,
      totalCount: options.eventLog.length,
      eventLog: options.eventLog,
    }) // GET .../events
    .mockResolvedValueOnce({ keys: options.wellKnownJwks ?? [] }) // GET .well-known/jwks.json
    .mockResolvedValueOnce({
      count: options.destinationJwks?.length ?? 0,
      offset: 0,
      totalCount: options.destinationJwks?.length ?? 0,
      keys: options.destinationJwks ?? [],
    }); // GET .../destinations/:id/keys
}

// Mocked counterpart of fitConnectClient.contract.test.ts's raw fetchSubmissionEvents call -
// exercises getSubmissionEvents' JWT-verification and key-matching logic, which the contract
// test doesn't touch since it only asserts on the raw (unverified) event log.
describe("FitConnectClient with mocked FIT-Connect responses", () => {
  beforeEach(() => {
    // this suite never calls encryptData, so the JWK doesn't need to be valid
    vi.stubEnv("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK", "");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getSubmissionEvents", () => {
    it("verifies an event token signed by a well-known key and decodes its payload", async () => {
      const { privateKey, publicKey } = await generateKeyPair("RS256");
      const jwk = { ...(await exportJWK(publicKey)), kid: "well-known-key", alg: "RS256" };
      const token = await signEvent("well-known-key", privateKey, { type: "SUBMITTED" });

      mockEventsFlow({ eventLog: [token], wellKnownJwks: [jwk] });

      const client = getFitConnectClient();
      const result = await client.getSubmissionEvents("submission-id", "destination-id");

      expect(result.eventLog).toEqual([expect.objectContaining({ type: "SUBMITTED" })]);
    });

    it("matches an event token's key against destinationKeys as well as wellKnownJWKs", async () => {
      const { privateKey, publicKey } = await generateKeyPair("RS256");
      const jwk = { ...(await exportJWK(publicKey)), kid: "destination-key", alg: "RS256" };
      const token = await signEvent("destination-key", privateKey, { type: "FORWARDED" });

      mockEventsFlow({ eventLog: [token], destinationJwks: [jwk] });

      const client = getFitConnectClient();
      const result = await client.getSubmissionEvents("submission-id", "destination-id");

      expect(result.eventLog).toEqual([expect.objectContaining({ type: "FORWARDED" })]);
    });

    it("returns null for an event token whose kid matches no known key", async () => {
      const { privateKey } = await generateKeyPair("RS256");
      const token = await signEvent("unknown-key", privateKey, { type: "SUBMITTED" });

      mockEventsFlow({ eventLog: [token] });

      const client = getFitConnectClient();
      const result = await client.getSubmissionEvents("submission-id", "destination-id");

      expect(result.eventLog).toEqual([null]);
    });
  });
});
