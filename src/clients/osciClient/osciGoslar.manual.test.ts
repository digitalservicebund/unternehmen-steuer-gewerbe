import { describe, expect, it } from "vitest";
import { createGewerbeanmeldungXml } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { getGewerbeRoutingInfo } from "../../routes/registerGewerbe/getGewerbeRoutingInfo";
import { type RegisterGewerbeRequest } from "../../routes/registerGewerbe/registerGewerbeInterfaces";
import { transformToGewerbeanmeldung } from "../../routes/registerGewerbe/requestDataTransformer/transformToGewerbeanmeldung";
import { getOsciClient } from "./osciClient";

// TEMPORARY manual test: sends a Gewerbeanmeldung to the real Gewerbeamt Goslar through
// the AKDB production API. It runs the same chain as the endpoint (routing -> transform ->
// XML builder incl. XSD/Schematron validation), so what arrives in Goslar is what production sends.
// Delete this file, vitest.manual.config.ts and the test:manual script once the test send is done.
//
// Run with:
// AKDB_BASE_URL, AKDB_USERNAME, AKDB_PASSWORD, AKDB_CERTIFICATE_BASE64 and
// AKDB_CERTIFICATE_PASSPHRASE must point at production (https://apk.akdb.de/okkommozg).

// Charley-Jacob-Str. 2, 38640 Goslar => ARS 031530017017
const GOSLAR_ARS = "031530017017";
const GOSLAR_AGS = "03153017";

// Test data: the shared sample request for Goslar
export const goslarRequest: RegisterGewerbeRequest = {
  persönlicheDaten: {
    vorname: "Erika",
    nachname: "Mustermann",
    geburtsname: "DigitalService",
    geburtsdatum: "1988-09-10",
    geburtsort: "Musterstadt",
    geburtsland: "Deutschland",
    staatsangehörigkeit: "deutsch",
    adresse: {
      strasseUndHausnummer: "Charley-Jacob-Straße 2",
      postleitzahl: "38640",
      ort: "Goslar",
    },
    telefon: "+49 234 121314",
    email: "e.mustermann@example.org",
    religion: "nichtKirchensteuerpflichtig",
    vertrauensniveau: "substantiell",
  },
  unternehmensDaten: {
    tätigkeitsbeschreibung: "Testeintrag Schneller Gründen",
    tätigkeitsbereich: "handwerk",
    tätigkeitsbeginn: "2026-07-28",
    gründungsdatum: "2026-07-28",
    gewerbeart: "hauptgewerbe",
    gewinnErmittlung: "einnahmenüberschussrechnung",
    kleinunternehmerRegelung: false,
    umsatzGruendungsjahr: 1,
    umsatzFolgejahr: 1,
    gewinnGründungsjahr: 1,
    gewinnFolgejahr: 1,
    sollIstVersteuerung: "sollVersteuerung",
    zahllastUeberschussBetrag: 0,
    zahllastUeberschussAuswahl: "zahllast",
    umsatzsteuerImErstenJahr: 0,
    adresseAbweichend: {
      strasseUndHausnummer: "Charley-Jacob-Straße 2",
      postleitzahl: "38640",
      ort: "Goslar",
    },
    umsatzsteuerIdMitbeantragen: true,
  },
};

// the receiving Gewerbeamt should not see the same ids twice; the transform generates fresh
// UUIDs and timestamps on every call
async function createGoslarGewerbeanmeldung(logging = false) {
  const routingInfo = await getGewerbeRoutingInfo(goslarRequest);
  if (routingInfo === undefined) {
    throw new Error("No Gewerbeamt found for the Goslar test address");
  }

  const gewerbeanmeldung = transformToGewerbeanmeldung(goslarRequest, routingInfo);

  if (logging) {
    console.log("*** Gewerbemeldung Data:");
    console.log(JSON.stringify(gewerbeanmeldung, null, 2));
    console.log("************************");
  }

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

  it(`successfully sends Gewerbemeldung to Goslar (MELDID:${GOSLAR_AGS})`, async () => {
    expect(process.env["AKDB_BASE_URL"]).toContain("apk.akdb.de");

    const { routingInfo, message } = await createGoslarGewerbeanmeldung(true);
    const targetId = `MELDID:${routingInfo.ags}`;

    const sendResult = await getOsciClient().sendMessage({ targetId, message });

    console.log("*** Send result:");
    console.log(JSON.stringify(sendResult.metadata, undefined, 2));
    console.log("****************");

    expect(sendResult.metadata.reply.replyType).toBe("OK");

    console.log("*** SubmissionID:", sendResult.metadata.source.sourceMessageId);
    console.log("*** ARS:         ", routingInfo.ars);
  });
});
