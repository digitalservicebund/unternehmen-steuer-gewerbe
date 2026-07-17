// Raw AKDB OKKOMM REST API response bodies for the scenarios covered by osciClient.contract.test.ts.
// Not literal recordings of a live API response, since capturing those requires network/1Password
// access this environment doesn't have. Replace with an actual recorded response next time a
// contract test is run against the real API.

export const tokenResponseBody = JSON.stringify({
  access_token: "token",
  token_type: "Bearer",
  expires_in: 300,
});

export const sendAlg0300OkResponseBody = JSON.stringify({
  $schema: "https://www.xrepository.de/schema/urn_de_xzufi_message-metadata.json",
  metadata: {
    target: {
      targetProcessType: "GEWERBEMELDUNG",
      targetActionType: "SUBMIT",
      targetOperation:
        "alg.gewerbemeldung.0300##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-alg-Aufsichtsbehoerden.wsdl##xga",
      targetId: "MELDID:09000099",
    },
    source: {
      sourceProcessType: "GEWERBEMELDUNG",
      sourceId: "xga:090010030000",
      sourceTimestamp: "2026-07-17T09:00:00Z",
      sourceMessageId: "vps_by_178357726143931b13e14-2c78-4aa6-ba2c-0d911ec02d82",
    },
    transport: { transportRequestId: "trans-alg-0300" },
    reply: { replyType: "OK", replyApplication: "OKKOMM", replyTimestamp: "2026-07-17T09:00:01Z" },
  },
});

export const sendExt0400OkResponseBody = JSON.stringify({
  $schema: "https://www.xrepository.de/schema/urn_de_xzufi_message-metadata.json",
  metadata: {
    target: {
      targetProcessType: "GEWERBEMELDUNG",
      targetActionType: "SUBMIT",
      targetOperation:
        "ext.gewerbemeldung.0400##http://www.xgewerbeordnung.de/spezifikation/xga/1.6/xgewo16gewerbemeldung-ext.wsdl##xga",
      targetId: "MELDID:09000099",
    },
    source: {
      sourceProcessType: "GEWERBEMELDUNG",
      sourceId: "xga:090010030000",
      sourceTimestamp: "2026-07-17T09:05:00Z",
      sourceMessageId: "vps_by_178357726143931b13e14-2c78-4aa6-ba2c-0d911ec02d83",
    },
    transport: { transportRequestId: "trans-ext-0400" },
    reply: { replyType: "OK", replyApplication: "OKKOMM", replyTimestamp: "2026-07-17T09:05:01Z" },
  },
});

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
