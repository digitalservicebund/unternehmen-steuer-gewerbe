import { describe, it, expect } from "vitest";
import { buildReceipt } from "./receiptFields";
import { transformToGewerbeanmeldung } from "./requestDataTransformer";
import {
  gewerbeanmeldungFixture,
  gewerbeRoutingInfoFixture,
  registerGewerbeSampleRequestAllFieldsFilled,
} from "./testHelpers";

// Every transmitted value is either printed as a row or listed below with the reason why not.
const FIELD_ROWS: Record<string, string> = {
  datumMeldung: "Datum der Anmeldung",
  grundAnmeldungSchluessel: "Grund der Neuerrichtung / Übernahme",
  "gewerbebetrieb.betriebsstaette.artBetriebsstaette": "Die Anmeldung wird erstattet für",
  "referenzierteSubjekte.natuerlichePerson.name.familienname": "Name",
  "referenzierteSubjekte.natuerlichePerson.name.vornamen": "Vornamen",
  "referenzierteSubjekte.natuerlichePerson.geschlecht": "Geschlecht",
  "referenzierteSubjekte.natuerlichePerson.name.geburtsname": "Geburtsname (bei Abweichung)",
  "referenzierteSubjekte.natuerlichePerson.geburt.geburtsdatum": "Geburtsdatum",
  "referenzierteSubjekte.natuerlichePerson.geburt.ort": "Geburtsort und -land",
  "referenzierteSubjekte.natuerlichePerson.geburt.staat": "Geburtsort und -land",
  "referenzierteSubjekte.natuerlichePerson.staatsangehoerigkeit": "Staatsangehörigkeit",
  "referenzierteSubjekte.natuerlichePerson.anschrift.strasse": "Anschrift der Wohnung",
  "referenzierteSubjekte.natuerlichePerson.anschrift.hausnummerVon": "Anschrift der Wohnung",
  "referenzierteSubjekte.natuerlichePerson.anschrift.hausnummerBis": "Anschrift der Wohnung",
  "referenzierteSubjekte.natuerlichePerson.anschrift.postleitzahl": "Anschrift der Wohnung",
  "referenzierteSubjekte.natuerlichePerson.anschrift.ort": "Anschrift der Wohnung",
  "referenzierteSubjekte.natuerlichePerson.kommunikation.telefon": "Telefonnummer",
  "referenzierteSubjekte.natuerlichePerson.kommunikation.email": "E-Mail-Adresse",
  "gewerbebetrieb.geschaeftsbezeichnung": "Geschäftsbezeichnung",
  "gewerbebetrieb.betriebsstaette.anschrift.strasse": "Anschrift der Betriebsstätte",
  "gewerbebetrieb.betriebsstaette.anschrift.hausnummerVon": "Anschrift der Betriebsstätte",
  "gewerbebetrieb.betriebsstaette.anschrift.hausnummerBis": "Anschrift der Betriebsstätte",
  "gewerbebetrieb.betriebsstaette.anschrift.postleitzahl": "Anschrift der Betriebsstätte",
  "gewerbebetrieb.betriebsstaette.anschrift.ort": "Anschrift der Betriebsstätte",
  "gewerbebetrieb.taetigkeitenGesamt.schwerpunkt.taetigkeitSchwerpunkt": "Angemeldete Tätigkeit",
  "gewerbebetrieb.istNebenerwerb": "Tätigkeit im Nebenerwerb?",
  gueltigAb: "Datum des Beginns der Tätigkeit",
  "gewerbebetrieb.betriebArt.industrie": "Art des angemeldeten Betriebes",
  "gewerbebetrieb.betriebArt.handwerk": "Art des angemeldeten Betriebes",
  "gewerbebetrieb.betriebArt.handel": "Art des angemeldeten Betriebes",
  "gewerbebetrieb.betriebArt.sonstiges": "Art des angemeldeten Betriebes",
  "gewerbebetrieb.anzahlVollzeitBeschaeftigte": "Zahl der tätigen Personen (Vollzeit / Teilzeit)",
  "gewerbebetrieb.anzahlTeilzeitBeschaeftigte": "Zahl der tätigen Personen (Vollzeit / Teilzeit)",
  "gewerbebetrieb.istReisegewerbe": "Reisegewerbe",
  "gewerbebetrieb.beteiligungOeffentlicheHand": "Beteiligung der öffentlichen Hand",
};

const NOT_SHOWN_AS_ROW: Record<string, string> = {
  "nachrichtenkopf.nachrichtenUUID": "transport envelope",
  "nachrichtenkopf.erstellungszeitpunkt": "transport envelope",
  "nachrichtenkopf.leser.kennung": "transport envelope",
  "nachrichtenkopf.leser.name": "transport envelope",
  "nachrichtenkopf.autor.kennung": "transport envelope",
  "nachrichtenkopf.autor.name": "transport envelope",
  "autor.kennung": "receiving Gewerbeamt, shown as Behördenname in the header",
  "autor.name": "receiving Gewerbeamt, shown as Behördenname in the header",
  anzeigerenderId: "internal cross-reference id",
  handelndePersonId: "internal cross-reference id",
  "referenzierteSubjekte.natuerlichePerson.id": "internal cross-reference id",
  handelndePersonVertrauensniveauCode: "technical identity assurance level",
  satzErstellung: "technical timestamp",
  ereigniszeitpunkt: "technical timestamp",
  istStorno: "always false for an Anmeldung",
  gemeindeSchluessel: "shown as Gemeindekennzahl in the header",
  gemeindeschluesselErgaenzung: "Stadtbezirk, part of the Gemeindekennzahl",
  uuid: "shown as ID in the footer",
  "gewerbebetrieb.gewerbebetriebID": "internal cross-reference id",
  "gewerbebetrieb.rechtsformcode": "GewA 1 has no field for it; design.pdf shows none",
};

// "x" (ohne Angabe) is transmitted but rendered as an empty value.
const EMPTY_BY_DESIGN = ["referenzierteSubjekte.natuerlichePerson.geschlecht"];

// Only present for address ranges ("Musterstraße 1-3"), which the sample request does not use.
const OPTIONAL = [
  "referenzierteSubjekte.natuerlichePerson.anschrift.hausnummerBis",
  "gewerbebetrieb.betriebsstaette.anschrift.hausnummerBis",
];

function leafPaths(value: unknown, prefix = ""): string[] {
  if (value === undefined) return [];
  if (Array.isArray(value)) return value.flatMap((entry) => leafPaths(entry, prefix));
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, inner]) =>
      leafPaths(inner, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

const transmitted = transformToGewerbeanmeldung(
  registerGewerbeSampleRequestAllFieldsFilled,
  gewerbeRoutingInfoFixture(),
);
const receipt = buildReceipt(transmitted, gewerbeRoutingInfoFixture());
const transmittedPaths = leafPaths(transmitted);

describe("Eingangsbestätigung covers the transmitted data", () => {
  it("accounts for every transmitted value", () => {
    const unaccounted = transmittedPaths.filter(
      (path) => FIELD_ROWS[path] === undefined && NOT_SHOWN_AS_ROW[path] === undefined,
    );

    expect(unaccounted).toEqual([]);
  });

  it("still receives every field it prints a row for", () => {
    const noLongerTransmitted = Object.keys(FIELD_ROWS).filter(
      (path) => !OPTIONAL.includes(path) && !transmittedPaths.includes(path),
    );

    expect(noLongerTransmitted).toEqual([]);
  });

  it("prints a filled row for every field mapped to one", () => {
    const rows = receipt.sections.flatMap((section) => section.rows);

    transmittedPaths
      .filter((path) => FIELD_ROWS[path] !== undefined)
      .forEach((path) => {
        const row = rows.find((candidate) => candidate.label === FIELD_ROWS[path]);
        expect(row, `no row rendered for ${path}`).toBeDefined();
        if (EMPTY_BY_DESIGN.includes(path)) return;
        expect(row?.value, `no value rendered for ${path}`).toBeDefined();
      });
  });

  it("keeps the PDF fixture in sync with what the transformer produces", () => {
    const fixturePaths = leafPaths(gewerbeanmeldungFixture());
    const missing = transmittedPaths.filter(
      (path) => FIELD_ROWS[path] !== undefined && !fixturePaths.includes(path),
    );

    expect(missing).toEqual([]);
  });
});
