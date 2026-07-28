import { describe, expect, it } from "vitest";
import { createGewerbeanmeldungXml } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { getGewerbeRoutingInfo } from "../../routes/registerGewerbe/getGewerbeRoutingInfo";
import { type RegisterGewerbeRequest } from "../../routes/registerGewerbe/registerGewerbeInterfaces";
import { transformToGewerbeanmeldung } from "../../routes/registerGewerbe/requestDataTransformer/transformToGewerbeanmeldung";
import { registerGewerbeSampleRequestAllFieldsFilled } from "../../routes/registerGewerbe/testHelpers";
import { getOsciClient } from "./osciClient";

// TEMPORARY manual test: sends a Gewerbeanmeldung to the real Gewerbeamt Goslar through
// the AKDB production API. It runs the same chain as the endpoint (routing -> transform ->
// XML builder incl. XSD/Schematron validation), so what arrives in Goslar is what production sends.
// Delete this file, vitest.manual.config.ts and the test:manual script once the test send is done.
//
// Run with:
// AKDB_BASE_URL, AKDB_USERNAME, AKDB_PASSWORD, AKDB_CERTIFICATE_BASE64 and
// AKDB_CERTIFICATE_PASSPHRASE must point at production (https://apk.akdb.de/okkommozg).

// Charley-Jacob-Str. 2, 38640 Goslar => ARS 031530017017 (confirmed via PVOG v3 locations)
const GOSLAR_ARS = "031530017017";
const GOSLAR_AGS = "03153017";

// Test data: the shared sample request with the Betriebsstätte moved to Goslar, since the
// business address is what routes the Gewerbeanmeldung to the Gewerbeamt.
const goslarRequest: RegisterGewerbeRequest = {
  ...registerGewerbeSampleRequestAllFieldsFilled,
  unternehmensDaten: {
    ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
    tätigkeitsbeschreibung: "Testeintrag Schneller Gründen - Vertrieb von Vertriebsmustern",
    adresseAbweichend: {
      strasseUndHausnummer: "Charley-Jacob-Straße 2",
      postleitzahl: "38640",
      ort: "Goslar",
    },
  },
};

// the receiving Gewerbeamt should not see the same ids twice; the transform generates fresh
// UUIDs and timestamps on every call
async function createGoslarGewerbeanmeldung() {
  const routingInfo = await getGewerbeRoutingInfo(goslarRequest);
  if (routingInfo === undefined) {
    throw new Error("No Gewerbeamt found for the Goslar test address");
  }

  const gewerbeanmeldung = transformToGewerbeanmeldung(goslarRequest, routingInfo);
  const message = await createGewerbeanmeldungXml(gewerbeanmeldung);

  return { routingInfo, message };
}

describe("Gewerbemeldung to Goslar via OSCI", () => {
  it("routes the Goslar address to the Stadt Goslar and builds a valid XML for it", async () => {
    const { routingInfo, message } = await createGoslarGewerbeanmeldung();

    expect(routingInfo.ars).toBe(GOSLAR_ARS);
    expect(routingInfo.ags).toBe(GOSLAR_AGS);
    expect(message).toContain(`<bn-beh:kennung>MELDID:${GOSLAR_AGS}</bn-beh:kennung>`);
    expect(message).toContain(`<bn-beh:name>${routingInfo.gewerbeamt.name}</bn-beh:name>`);
  });

  it(`sends to MELDID:${GOSLAR_AGS} and reports the message as accepted`, async () => {
    expect(process.env["AKDB_BASE_URL"]).toContain("apk.akdb.de");

    const { routingInfo, message } = await createGoslarGewerbeanmeldung();
    const targetId = `MELDID:${routingInfo.ags}`;

    const sendResult = await getOsciClient().sendMessage({ targetId, message });

    console.log("send result:", JSON.stringify(sendResult.metadata, undefined, 2));
    expect(sendResult.metadata.reply.replyType).toBe("OK");

    const report = await getOsciClient().getTransportReport({
      messageId: sendResult.metadata.source.sourceMessageId,
      authorityKey: targetId,
    });

    console.log("transport report:", JSON.stringify(report, undefined, 2));
  });
});
