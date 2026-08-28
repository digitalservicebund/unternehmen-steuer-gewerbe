import { describe, expect, it } from "vitest";
import { createGewerbeanmeldungXml } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { getGewerbeRoutingInfo } from "../../routes/registerGewerbe/getGewerbeRoutingInfo";
import { type RegisterGewerbeRequest } from "../../routes/registerGewerbe/registerGewerbeInterfaces";
import {
  PDF_RECEIPT_NACHWEISDOKUMENT,
  transformToGewerbeanmeldung,
} from "../../routes/registerGewerbe/requestDataTransformer/transformToGewerbeanmeldung";
import { generatePdfReceipt } from "../../routes/registerGewerbe/registerGewerbePdfGenerator";
import { getOsciClient } from "./osciClient";

// TEMPORARY manual test: sends a Gewerbeanmeldung to the real Gewerbeamt Dresden through
// the AKDB production API. It runs the same chain as the endpoint (routing -> transform ->
// XML builder incl. XSD/Schematron validation), so what arrives in Dresden is what production sends.
// Delete this file, vitest.manual.config.ts and the test:manual script once the test send is done.
//
// Run with:
// AKDB_BASE_URL, AKDB_USERNAME, AKDB_PASSWORD, AKDB_CERTIFICATE_BASE64 and
// AKDB_CERTIFICATE_PASSPHRASE must point at production (https://apk.akdb.de/okkommozg).

// Augsburger Straße 3, 01309 Dresden => ARS 146120000000
const DRESDEN_ARS = "146120000000";
const DRESDEN_AGS = "14612000";

const dresdenAdresse = {
  strasse: "Augsburger Straße",
  hausnummer: "3",
  postleitzahl: "01309",
  ort: "Dresden",
};

export const dresdenRequest: RegisterGewerbeRequest = {
  persönlicheDaten: {
    vorname: "Fridolin",
    nachname: "Mustermann",
    geburtsname: "DigitalService",
    geburtsdatum: "1988-09-10",
    geburtsort: "Musterstadt",
    geburtsland: "Deutschland",
    geschlecht: "keineAngabe",
    staatsangehörigkeitIcao: "D",
    staatsangehörigkeit: "deutsch",
    adresse: {
      strasseUndHausnummer: "Augsburger Straße 3",
      postleitzahl: "01309",
      ort: "Dresden",
    },
    telefon: "+49234121314",
    email: "e.mustermann@example.org",
    steuerId: "06646829576",
    religion: "nichtKirchensteuerpflichtig",
    vertrauensniveau: "substantiell",
  },
  unternehmensDaten: {
    geschäftsbezeichnung: "Testbetrieb Schneller Gründen",
    tätigkeitsbeschreibung: "Testeintrag Schneller Gründen",
    tätigkeitsbereich: "handwerk",
    anmeldedatumFinanzamt: "2026-08-28",
    anmeldedatumGewerbeamt: "2026-08-28",
    gewerbeart: "hauptgewerbe",
    istReisegewerbe: false,
    rechtsform: "nichtEingetragenesEinzelunternehmen",
    gründungsart: "neugründung",
    artBetriebsstaette: "hauptniederlassung",
    beteiligungOeffentlicheHand: "nein",
    anzahlVollzeitBeschaeftigte: 0,
    anzahlTeilzeitBeschaeftigte: 0,
    gewinnErmittlung: "einnahmenüberschussrechnung",
    kleinunternehmerRegelung: false,
    umsatzGruendungsjahr: 1,
    umsatzFolgejahr: 1,
    gewinnGründungsjahr: 1,
    gewinnFolgejahr: 1,
    sollIstVersteuerung: "sollVersteuerung",
    zahllastUeberschussAuswahl: "zahllast",
    zahllastUeberschussBetrag: 0,
    umsatzsteuerIdMitbeantragen: true,
    adresse: dresdenAdresse,
  },
};

async function createDresdenGewerbeanmeldung(logging = false) {
  const routingInfo = await getGewerbeRoutingInfo(dresdenRequest);
  if (routingInfo === undefined) {
    throw new Error("No Gewerbeamt found for the Dresden test address");
  }

  const gewerbeanmeldung = transformToGewerbeanmeldung(dresdenRequest, routingInfo);

  if (logging) {
    console.log("*** Routing Info:");
    console.log(JSON.stringify(routingInfo, null, 2));
    console.log("************************");
    console.log("*** Gewerbemeldung Data:");
    console.log(JSON.stringify(gewerbeanmeldung, null, 2));
    console.log("************************");
  }

  const message = await createGewerbeanmeldungXml(gewerbeanmeldung, "osci");

  return { routingInfo, gewerbeanmeldung, message };
}

describe("Gewerbemeldung to Dresden via OSCI", () => {
  it("routes the Dresden address to the Stadt Dresden and builds a valid XML for it", async () => {
    const { routingInfo, message } = await createDresdenGewerbeanmeldung();

    expect(routingInfo.ars).toBe(DRESDEN_ARS);
    expect(routingInfo.ags).toBe(DRESDEN_AGS);
    expect(message).toContain(`<bn-beh:kennung>MELDID:${DRESDEN_AGS}</bn-beh:kennung>`);
    expect(message).toContain(`<bn-beh:name>${routingInfo.gewerbeamt.name}</bn-beh:name>`);
  });

  it("resolves Dresden to the OSCI path, without a FIT-Connect destination", async () => {
    const { routingInfo } = await createDresdenGewerbeanmeldung();

    expect(routingInfo.fitConnectDestinationInformation).toBeNull();
  });

  it.skip(`successfully sends Gewerbemeldung to Dresden (MELDID:${DRESDEN_AGS})`, async () => {
    expect(process.env["AKDB_BASE_URL"]).toContain("apk.akdb.de");

    const { routingInfo, gewerbeanmeldung, message } = await createDresdenGewerbeanmeldung(true);
    const targetId = `MELDID:${routingInfo.ags}`;

    const pdfReceiptBase64 = await generatePdfReceipt(gewerbeanmeldung, routingInfo);

    const sendResult = await getOsciClient().sendMessage({
      targetId,
      message,
      // the XML declares this file as bk:nachweisdokument.onlinedienst
      attachments: [
        {
          fileName: PDF_RECEIPT_NACHWEISDOKUMENT.dateiname,
          mimeType: PDF_RECEIPT_NACHWEISDOKUMENT.mimetype,
          content: Buffer.from(pdfReceiptBase64, "base64"),
        },
      ],
    });

    console.log("*** Send result:");
    console.log(JSON.stringify(sendResult.metadata, undefined, 2));
    console.log("****************");

    expect(sendResult.metadata.reply.replyType).toBe("OK");

    console.log("*** SubmissionID:", sendResult.metadata.source.sourceMessageId);
    console.log("*** ARS:         ", routingInfo.ars);
  });
});
