// Raw FIT-Connect response fixtures for the scenarios covered by fitConnectClient.contract.test.ts.
// Not literal recordings of a live API response, since capturing those requires network/1Password
// access this environment doesn't have. Replace with an actual recorded response next time a
// contract test is run against the real API.
//
// Unlike the other clients' fixtures, encryption/signature keys can't be arbitrary JSON: submitData
// really encrypts with the returned publicJwk (see crypto.ts), and getSubmissionEvents really
// verifies the event JWT's signature. So these are built with real, locally generated key pairs
// (same technique as crypto.unit.test.ts), just like a live FIT-Connect environment would provide.
import { exportJWK, generateKeyPair, SignJWT } from "jose";
import { expect } from "vitest";

const OAUTH_TOKEN_RESPONSE = {
  access_token: "token",
  scope: "submit",
  token_type: "Bearer",
  expires_in: 300,
};

export async function buildSubmitDataFixtures(destinationId: string) {
  const { publicKey } = await generateKeyPair("RSA-OAEP-256");
  const publicJwk = {
    ...(await exportJWK(publicKey)),
    kid: "encryption-key-1",
    alg: "RSA-OAEP-256",
  };

  return {
    tokenResponse: OAUTH_TOKEN_RESPONSE,
    destinationResponse: {
      destinationId,
      encryptionKid: "encryption-key-1",
      publicServices: [
        { submissionSchemas: [{ schemaUri: "urn:xoev-de:kosit:standard:xgewerbeordnung" }] },
      ],
    },
    publicJwk,
    createSubmissionResponse: { caseId: "case-1", destinationId, submissionId: "submission-1" },
    submitResultResponse: {
      caseId: "case-1",
      destinationId,
      submissionId: "submission-1",
      attachments: [],
      publicService: {
        description: null,
        identifier: "urn:de:fim:leika:leistung:99050012104000",
        name: "Gewerbe Anmeldung",
      },
    },
  };
}

export async function buildSubmissionEventsFixtures() {
  const { privateKey, publicKey } = await generateKeyPair("PS512");
  const publicJwk = { ...(await exportJWK(publicKey)), kid: "event-signing-key-1", alg: "PS512" };

  const token = await new SignJWT({ eventType: "SubmissionReceived" })
    .setProtectedHeader({ alg: "PS512", kid: "event-signing-key-1" })
    .setIssuedAt()
    .sign(privateKey);

  return {
    tokenResponse: OAUTH_TOKEN_RESPONSE,
    eventsResponse: { count: 1, offset: 0, totalCount: 1, eventLog: [token] },
    wellKnownJwksResponse: { keys: [publicJwk] },
    destinationKeysResponse: { count: 0, offset: 0, totalCount: 0, keys: [] },
  };
}

// Expected getFitConnectClient() output for the contract test's full-input/full-output
// comparisons. Static/echoed fields are literal (recorded 2026-07-17); genuinely dynamic fields
// (submissionId/caseId, generated fresh by FIT-Connect every call) use expect.any(String). The
// real response also carries an "attachments" field the SubmitDataResponse type doesn't declare -
// fetchJson<T> only casts, it doesn't strip - so it's included here to match runtime behavior.
export function submitDataExpectedResult(destinationId: string) {
  return {
    destinationId,
    submissionId: expect.any(String),
    caseId: expect.any(String),
    attachments: [],
    publicService: {
      name: "Gewerbe Anmeldung",
      description: null,
      identifier: "urn:de:fim:leika:leistung:99050012104000",
    },
  };
}

// getSubmissionEvents's count/eventLog depend on how many lifecycle events this specific
// submission has accumulated by the time it's called, and the eventLog entries themselves are
// per-submission JWTs (sub/txn/jti/iat) - so only the shape is pinned down here.
export const getSubmissionEventsExpectedShape = {
  count: expect.any(Number),
  offset: expect.any(Number),
  totalCount: expect.any(Number),
  eventLog: expect.any(Array),
};
