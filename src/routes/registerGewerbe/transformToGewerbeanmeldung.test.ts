import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { transformToGewerbeanmeldung } from "./transformToGewerbeanmeldung";
import type { RegisterGewerbeRequest } from "./registerGewerbeRoute";

vi.mock("node:crypto", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:crypto")>();
  return { ...actual, randomUUID: () => "00000000-0000-0000-0000-000000000000" };
});

const baseRequest: RegisterGewerbeRequest = {
  persönlicheDaten: {
    vorname: "Erika",
    nachname: "Mustermann",
    geburtsdatum: "1988-09-10",
    geburtsort: "Berlin",
    geburtsland: "Deutschland",
    staatsangehoerigkeitDeutsch: true,
    adresse: {
      strasseUndHausnummer: "Musterstraße 1",
      postleitzahl: "12345",
      ort: "Musterstadt",
    },
    telefon: "007",
    email: "e.mustermann@example.org",
  },
  unternehmensDaten: {
    tätigkeitsbeschreibung: "Was mit Computern",
    artDesUnternehmens: "Softwarebude",
  },
};

describe("transformToGewerbeanmeldung", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-17T10:00:00.000Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("maps a complete RegisterGewerbeRequest into the expected Gewerbeanmeldung", () => {
    const result = transformToGewerbeanmeldung(baseRequest);

    expect(result).toEqual({
      nachrichtenkopf: {
        nachrichtenUUID: "00000000-0000-0000-0000-000000000000",
        erstellungszeitpunkt: "2026-04-17T10:00:00.000Z",
        leser: { kennung: "xga:000000000001", name: "Gewerbeamt Muster" },
        autor: { kennung: "MELDID:00000000", name: "Schneller Gruenden OSS" },
      },
      autor: { kennung: "MELDID:00000000", name: "Schneller Gruenden OSS" },
      satzErstellung: "2026-04-17T10:00:00.000Z",
      ereigniszeitpunkt: "2026-04-17T10:00:00.000Z",
      istStorno: false,
      gemeindeSchluessel: "00000000",
      uuid: "00000000-0000-0000-0000-000000000000",
      gueltigAb: "2026-04-17",
      datumMeldung: "2026-04-17T10:00:00.000Z",
      grundAnmeldungSchluessel: "01",
      gewerbebetrieb: {
        gewerbebetriebID: "00000000-0000-0000-0000-000000000000",
        gemeindeMeldungNr: "2024 0001",
        rechtsformcode: "411000",
        eingetragenerName: "Muster GmbH",
        betriebsstaette: {
          artBetriebsstaette: "01",
          anschrift: {
            strasse: "Musterstraße",
            hausnummerVon: "1",
            postleitzahl: "12345",
            ort: "Musterstadt",
          },
        },
        taetigkeitenGesamt: {
          schwerpunkt: {
            taetigkeitSchwerpunkt: "Was mit Computern",
            wirtschaftszweigschluessel: "47990",
            stichwort: "Softwarebude",
          },
        },
        istNebenerwerb: false,
        anzahlVollzeitBeschaeftigte: 0,
        anzahlTeilzeitBeschaeftigte: 0,
        istReisegewerbe: false,
        betriebArt: {
          industrie: false,
          handwerk: false,
          handel: false,
          sonstiges: true,
        },
      },
      referenzierteSubjekte: {
        natuerlichePerson: [
          {
            id: "00000000-0000-0000-0000-000000000000",
            name: { familienname: "Mustermann", vornamen: "Erika" },
            geburt: { geburtsdatum: "1988-09-10", ort: "Berlin", staat: "Deutschland" },
            geschlecht: "",
            staatsangehoerigkeit: "000",
            anschrift: {
              strasse: "Musterstraße",
              hausnummerVon: "1",
              postleitzahl: "12345",
              ort: "Musterstadt",
            },
            kommunikation: { telefon: "007" },
          },
        ],
      },
    });
  });

  it("uses adresseAbweichend as betriebsstaette anschrift when provided, split into strasse and hausnummer", () => {
    const result = transformToGewerbeanmeldung({
      ...baseRequest,
      unternehmensDaten: {
        ...baseRequest.unternehmensDaten,
        adresseAbweichend: {
          strasseUndHausnummer: "Betriebsweg 42a",
          postleitzahl: "67890",
          ort: "Gewerbestadt",
        },
      },
    });

    expect(result.gewerbebetrieb.betriebsstaette.anschrift).toEqual({
      strasse: "Betriebsweg",
      hausnummerVon: "42a",
      postleitzahl: "67890",
      ort: "Gewerbestadt",
    });
  });

  it("falls back to persönliche Adresse for the betriebsstaette when adresseAbweichend is missing", () => {
    const result = transformToGewerbeanmeldung(baseRequest);

    expect(result.gewerbebetrieb.betriebsstaette.anschrift).toEqual({
      strasse: "Musterstraße",
      hausnummerVon: "1",
      postleitzahl: "12345",
      ort: "Musterstadt",
    });
  });
});
