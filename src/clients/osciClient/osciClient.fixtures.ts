// Raw AKDB OKKOMM REST API response bodies for the scenarios covered by osciClient.contract.test.ts.
// Not literal recordings of a live API response, since capturing those requires network/1Password
// access this environment doesn't have. Replace with an actual recorded response next time a
// contract test is run against the real API.
import { expect } from "vitest";

export const tokenResponseBody = JSON.stringify({
  access_token: "token",
  token_type: "Bearer",
  expires_in: 300,
});

// Static fields (schema, process/action type, reply application) match a real recording from
// AKDB's OKKOMM test API (2026-07-17); source/transport identifiers and timestamps are inherently
// generated per-request, so they're arbitrary-but-plausible here (only the shape matters for the
// mocked test, which exercises osciClient's parsing rather than these exact values).
export const sendAlg0300OkResponseBody = JSON.stringify({
  $schema: "https://www.akdb.net/ok.komm/zkocjson-1.0.0.schema.json",
  metadata: {
    target: {
      targetProcessType: "XGA",
      targetActionType: "http://www.xgewerbeordnung.de/spezifikation/xga/1.6",
      targetOperation:
        "alg.gewerbemeldung.0300##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-alg-Aufsichtsbehoerden.wsdl##xga",
      targetId: "MELDID:09000099",
    },
    source: {
      sourceProcessType: "XGA",
      sourceId: "xga:090010030000",
      sourceTimestamp: "2026-07-17T09:00:00Z",
      sourceMessageId: "vps_by_178357726143931b13e14-2c78-4aa6-ba2c-0d911ec02d82",
    },
    transport: { transportRequestId: "vws-10-komproxy_000000" },
    reply: {
      replyType: "OK",
      replyApplication: "OK.KOMM 7.3.3-SNAPSHOT",
      replyTimestamp: "2026-07-17T09:00:01Z",
    },
  },
});

export const sendExt0400OkResponseBody = JSON.stringify({
  $schema: "https://www.akdb.net/ok.komm/zkocjson-1.0.0.schema.json",
  metadata: {
    target: {
      targetProcessType: "XGA",
      targetActionType: "http://www.xgewerbeordnung.de/spezifikation/xga/1.6",
      targetOperation:
        "ext.gewerbemeldung.0400##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-ext.wsdl##xga",
      targetId: "MELDID:09000099",
    },
    source: {
      sourceProcessType: "XGA",
      sourceId: "xga:090010030000",
      sourceTimestamp: "2026-07-17T09:05:00Z",
      sourceMessageId: "vps_by_178357726143931b13e14-2c78-4aa6-ba2c-0d911ec02d83",
    },
    transport: { transportRequestId: "vws-10-komproxy_000001" },
    reply: {
      replyType: "OK",
      replyApplication: "OK.KOMM 7.3.3-SNAPSHOT",
      replyTimestamp: "2026-07-17T09:05:01Z",
    },
  },
});

// Expected getOsciClient().sendMessage() output for the contract test's full-input/full-output
// comparisons. Static/echoed fields are literal (recorded 2026-07-17); genuinely dynamic fields
// (timestamps, message/transport IDs, generated fresh by AKDB every call) use expect.any(String).
export const sendAlg0300ExpectedResult = {
  $schema: "https://www.akdb.net/ok.komm/zkocjson-1.0.0.schema.json",
  metadata: {
    target: {
      targetProcessType: "XGA",
      targetActionType: "http://www.xgewerbeordnung.de/spezifikation/xga/1.6",
      targetOperation:
        "alg.gewerbemeldung.0300##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-alg-Aufsichtsbehoerden.wsdl##xga",
      targetId: "MELDID:09000099",
    },
    source: {
      sourceProcessType: "XGA",
      sourceId: "xga:090010030000",
      sourceTimestamp: expect.any(String),
      sourceMessageId: expect.any(String),
    },
    transport: { transportRequestId: expect.any(String) },
    reply: {
      replyType: "OK",
      replyApplication: "OK.KOMM 7.3.3-SNAPSHOT",
      replyTimestamp: expect.any(String),
    },
  },
};

export const sendExt0400ExpectedResult = {
  $schema: "https://www.akdb.net/ok.komm/zkocjson-1.0.0.schema.json",
  metadata: {
    target: {
      targetProcessType: "XGA",
      targetActionType: "http://www.xgewerbeordnung.de/spezifikation/xga/1.6",
      targetOperation:
        "ext.gewerbemeldung.0400##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-ext.wsdl##xga",
      targetId: "MELDID:09000099",
    },
    source: {
      sourceProcessType: "XGA",
      sourceId: "xga:090010030000",
      sourceTimestamp: expect.any(String),
      sourceMessageId: expect.any(String),
    },
    transport: { transportRequestId: expect.any(String) },
    reply: {
      replyType: "OK",
      replyApplication: "OK.KOMM 7.3.3-SNAPSHOT",
      replyTimestamp: expect.any(String),
    },
  },
};

// AKDB rejects the alg.0300 payload with contentReference "payload.nok..." (fails XML validation
// server-side) with a non-2xx response, which osciClient turns into a thrown error.
export const sendInvalidPayloadErrorResponse = {
  status: 422,
  statusText: "Unprocessable Entity",
  body: "XGewO validation failed for the submitted Gewerbemeldung",
};

export const transportReportResponseBody = JSON.stringify({
  identifiers: {
    messageID: "vps_by_178357726143931b13e14-2c78-4aa6-ba2c-0d911ec02d83",
    serviceID: "http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-ext.wsdl",
    authorityKey: "MELDID:09000099",
  },
  tracks: [
    {
      id: "track-1",
      subject: "Gewerbemeldung",
      recentModification: "2026-07-17T09:05:02Z",
      events: [{ type: "RECEIVED", timestamp: "2026-07-17T09:05:02Z" }],
      verifications: [],
      rawData: "<ProcessCardBundle/>",
    },
  ],
});
