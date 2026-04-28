import "dotenv/config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateKeyPair, exportJWK, SignJWT } from "jose";
import FitConnectClient from "./fitConnectClient";

const DESTINATION_ID = "ec0a9e69-dc34-427d-ab82-a5c90e4687c0";
const ENCRYPTION_KID = "f0d4c8a1-ddb9-4f5c-9f70-350ffe14d83c";
const CASE_ID = "471aff14-16c3-4e15-b799-b843cb8fc78d";
const SUBMISSION_ID = "29899b73-a92d-4284-93be-8a32eeabdda5";

const publicKeyEncryption = process.env.FIT_CONNECT_PUBLIC_KEY_ENCRYPTION_JWK
  ? JSON.parse(process.env.FIT_CONNECT_PUBLIC_KEY_ENCRYPTION_JWK)
  : undefined;
const privateKeyDecryption = process.env.FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK
  ? JSON.parse(process.env.FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK)
  : undefined;

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function generateTestKeyPair() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { key_ops: _keyOpsPublic, ...publicJwk } = publicKeyEncryption;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { key_ops: _keyOpsPrivate, ...privateKey } = privateKeyDecryption;

  return { privateKey, publicJwk };
}

const defaultConfig = {
  environment: "test",
  clientId: "test-client-id",
  clientSecret: "test-client-secret",
};

const tokenResponse = {
  access_token: "test-token",
  scope: "not-everything-but-something",
  token_type: "Bearer",
  expires_in: 3600,
};

const destinationResponse = {
  destinationId: DESTINATION_ID,
  encryptionKid: ENCRYPTION_KID,
  publicServices: [{ submissionSchemas: [{ schemaUri: "urn:test" }] }],
};

const createSubmissionResponse = {
  caseId: CASE_ID,
  destinationId: DESTINATION_ID,
  submissionId: SUBMISSION_ID,
};

const sendSubmissionResponse = {
  caseId: CASE_ID,
  destinationId: DESTINATION_ID,
  submissionId: SUBMISSION_ID,
  publicService: { description: null, identifier: "urn:test", name: "Test" },
};

describe("FitConnectClient", () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let client: FitConnectClient;

  beforeEach(() => {
    mockFetch = vi.fn();
    // @ts-expect-error: allow the fetch mock to be any
    client = new FitConnectClient({ ...defaultConfig, fetch: mockFetch });
  });

  describe("submitData", () => {
    it("authenticates, creates submission, encrypts, and sends", async () => {
      const { publicJwk } = generateTestKeyPair();

      mockFetch.mockResolvedValueOnce(jsonResponse(tokenResponse));
      mockFetch.mockResolvedValueOnce(jsonResponse(createSubmissionResponse));
      mockFetch.mockResolvedValueOnce(jsonResponse(destinationResponse));
      mockFetch.mockResolvedValueOnce(jsonResponse(publicJwk));
      mockFetch.mockResolvedValueOnce(jsonResponse(sendSubmissionResponse));

      const result = await client.submitData({
        destinationId: DESTINATION_ID,
        publicService: { identifier: "urn:test", name: "Test" },
        data: '{"hello":"world"}',
        dataSchema: { schemaUri: "urn:schema", mimeType: "application/json" },
      });

      expect(result).toEqual(sendSubmissionResponse);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://auth-testing.fit-connect.fitko.dev/token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `grant_type=client_credentials&client_id=${defaultConfig.clientId}&client_secret=${defaultConfig.clientSecret}`,
        }),
      );

      expect(mockFetch).toHaveBeenCalledWith(
        "https://test.fit-connect.fitko.dev/submission-api/v2/submissions",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer test-token",
          }),
          body: JSON.stringify({
            announcedAttachments: [],
            destinationId: DESTINATION_ID,
            publicService: { identifier: "urn:test", name: "Test" },
          }),
        }),
      );

      expect(mockFetch).toHaveBeenCalledWith(
        `https://test.fit-connect.fitko.dev/submission-api/v2/destinations/${DESTINATION_ID}`,
        undefined,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        `https://test.fit-connect.fitko.dev/submission-api/v2/destinations/${DESTINATION_ID}/keys/${ENCRYPTION_KID}`,
        undefined,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        `https://test.fit-connect.fitko.dev/submission-api/v2/submissions/${SUBMISSION_ID}`,
        expect.objectContaining({
          method: "PUT",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer test-token",
          }),
          body: expect.stringMatching(/"encryptedData":"ey.+","encryptedMetadata":"ey.+"/),
        }),
      );
    });

    it("throws when authentication fails", async () => {
      mockFetch.mockResolvedValueOnce(new Response("Unauthorized", { status: 401 }));

      await expect(
        client.submitData({
          destinationId: DESTINATION_ID,
          publicService: { identifier: "urn:test", name: "Test" },
          data: "data",
          dataSchema: { schemaUri: "urn:schema", mimeType: "application/json" },
        }),
      ).rejects.toThrow("POST https://auth-testing.fit-connect.fitko.dev/token: Unauthorized");
    });
  });

  describe("getSubmissionEvents", () => {
    async function signedToken(kid: string) {
      const { privateKey, publicKey } = await generateKeyPair("PS512");
      const publicJwk = { ...(await exportJWK(publicKey)), alg: "PS512", kid };
      const token = await new SignJWT({
        events: { "https://schema.fitko.de/fit-connect/events/create-submission": {} },
      })
        .setProtectedHeader({ alg: "PS512", kid })
        .setIssuedAt()
        .sign(privateKey);
      return { token, publicJwk };
    }

    function mockEventsSequence(
      eventLog: string[],
      wellKnownKeys: object[],
      destinationKeys: object[],
    ) {
      mockFetch.mockResolvedValueOnce(jsonResponse(tokenResponse));
      mockFetch.mockResolvedValueOnce(
        jsonResponse({ count: eventLog.length, offset: 0, totalCount: eventLog.length, eventLog }),
      );
      mockFetch.mockResolvedValueOnce(jsonResponse({ keys: wellKnownKeys }));
      mockFetch.mockResolvedValueOnce(
        jsonResponse({
          count: destinationKeys.length,
          offset: 0,
          totalCount: destinationKeys.length,
          keys: destinationKeys,
        }),
      );
    }

    it("decodes events signed by FIT-Connect using wellKnownJWKs", async () => {
      const { token, publicJwk } = await signedToken("fit-connect-key-1");
      mockEventsSequence([token], [publicJwk], []);

      const result = await client.getSubmissionEvents(SUBMISSION_ID, DESTINATION_ID);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://test.fit-connect.fitko.dev/submission-api/v2/submissions/${SUBMISSION_ID}/events`,
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: "Bearer test-token" }),
        }),
      );
      expect(result.eventLog[0]).toMatchObject({
        events: { "https://schema.fitko.de/fit-connect/events/create-submission": {} },
      });
    });

    it("decodes events signed by the Fachverfahren using destinationKeys", async () => {
      const { token, publicJwk } = await signedToken("destination-key-1");
      mockEventsSequence([token], [], [publicJwk]);

      const result = await client.getSubmissionEvents(SUBMISSION_ID, DESTINATION_ID);

      expect(result.eventLog[0]).toMatchObject({
        events: { "https://schema.fitko.de/fit-connect/events/create-submission": {} },
      });
    });

    it("returns null for events whose kid is not found in any key set", async () => {
      const { token } = await signedToken("unknown-kid");
      mockEventsSequence([token], [], []);

      const result = await client.getSubmissionEvents(SUBMISSION_ID, DESTINATION_ID);

      expect(result.eventLog[0]).toBeNull();
    });
  });
});
