import { describe, expect, it } from "vitest";
import { createGewerbeanmeldungXml } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { getGewerbeRoutingInfo } from "../../routes/registerGewerbe/getGewerbeRoutingInfo";
import { type RegisterGewerbeRequest } from "../../routes/registerGewerbe/registerGewerbeInterfaces";
import { transformToGewerbeanmeldung } from "../../routes/registerGewerbe/requestDataTransformer/transformToGewerbeanmeldung";
import { getOsciClient } from "./osciClient";

// TEMPORARY manual test: sends a Gewerbeanmeldung to the real Gewerbeamt Hamburg through
// the AKDB production API. It runs the same chain as the endpoint (routing -> transform ->
// XML builder incl. XSD/Schematron validation), so what arrives in Hamburg is what production sends.
// Delete this file, vitest.manual.config.ts and the test:manual script once the test send is done.
//
// Run with:
// AKDB_BASE_URL, AKDB_USERNAME, AKDB_PASSWORD, AKDB_CERTIFICATE_BASE64 and
// AKDB_CERTIFICATE_PASSPHRASE must point at production (https://apk.akdb.de/okkommozg).

// Harburger Rathausforum 2, 21073 Hamburg => ARS 020000000000
const HAMBURG_ARS = "020000000000";
const HAMBURG_AGS = "02000000";

// Test data: the shared sample request for Hamburg
export const hamburgRequest: RegisterGewerbeRequest = {
  persönlicheDaten: {
    vorname: "Erika",
    nachname: "Mustermann",
    geburtsname: "DigitalService",
    geburtsdatum: "1988-09-10",
    geburtsort: "Musterstadt",
    geburtsland: "Deutschland",
    staatsangehörigkeit: "deutsch",
    adresse: {
      strasseUndHausnummer: "Harburger Rathausforum 2",
      postleitzahl: "21073",
      ort: "Hamburg",
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
      strasseUndHausnummer: "Harburger Rathausforum 2",
      postleitzahl: "21073",
      ort: "Hamburg",
    },
    umsatzsteuerIdMitbeantragen: true,
  },
};

// the receiving Gewerbeamt should not see the same ids twice; the transform generates fresh
// UUIDs and timestamps on every call
async function createHamburgGewerbeanmeldung(logging = false) {
  const routingInfo = await getGewerbeRoutingInfo(hamburgRequest);
  if (routingInfo === undefined) {
    throw new Error("No Gewerbeamt found for the Hamburg test address");
  }

  const gewerbeanmeldung = transformToGewerbeanmeldung(hamburgRequest, routingInfo);
  // gewerbeanmeldung.nachrichtenkopf!.autor!.kennung = "xga:090010030000";

  if (logging) {
    console.log("*** Gewerbemeldung Data:");
    console.log(JSON.stringify(gewerbeanmeldung, null, 2));
    console.log("************************");
  }

  const message = await createGewerbeanmeldungXml(gewerbeanmeldung);

  return { routingInfo, message };
}

describe("Gewerbemeldung to Hamburg via OSCI", () => {
  it("routes the Hamburg address to the Stadt Hamburg and builds a valid XML for it", async () => {
    const { routingInfo, message } = await createHamburgGewerbeanmeldung();

    expect(routingInfo.ars).toBe(HAMBURG_ARS);
    expect(routingInfo.ags).toBe(HAMBURG_AGS);
    expect(message).toContain(`<bn-beh:kennung>MELDID:${HAMBURG_AGS}</bn-beh:kennung>`);
    expect(message).toContain(`<bn-beh:name>${routingInfo.gewerbeamt.name}</bn-beh:name>`);
  });

  it.skip(`successfully sends Gewerbemeldung to Hamburg (MELDID:${HAMBURG_AGS})`, async () => {
    expect(process.env["AKDB_BASE_URL"]).toContain("apk.akdb.de");

    const { routingInfo, message } = await createHamburgGewerbeanmeldung(true);
    const targetId = `MELDID:${routingInfo.ags}`;

    const sendResult = await getOsciClient().sendMessage({ targetId, message });

    console.log("*** Send result:");
    console.log(JSON.stringify(sendResult.metadata, undefined, 2));
    console.log("****************");

    expect(sendResult.metadata.reply.replyType).toBe("OK");

    console.log("*** SubmissionID:", sendResult.metadata.source.sourceMessageId);
    console.log("*** ARS:         ", routingInfo.ars);
  });

  it.skip(`successfully sends Gewerbemeldung to Hamburg (MELDID:${HAMBURG_AGS}) with sendXoevMessage`, async () => {
    expect(process.env["AKDB_BASE_URL"]).toContain("apk.akdb.de");

    let { message } = await createHamburgGewerbeanmeldung(true);

    await expect(getOsciClient().sendXoevMessage(message)).resolves.toBeUndefined();
  });
});
