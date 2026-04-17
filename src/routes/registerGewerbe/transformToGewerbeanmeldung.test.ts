import { describe, it, expect } from "vitest";
import { transformToGewerbeanmeldung } from "./transformToGewerbeanmeldung";
import type { RegisterGewerbeRequest } from "./registerGewerbeRoute";

const baseRequest: RegisterGewerbeRequest = {
  persönlicheDaten: {
    vorname: "Erika",
    nachname: "Muster",
    geburtsdatum: "1988-09-10",
    geburtsort: "Berlin",
    geburtsland: "Deutschland",
    staatsangehörigkeitDeutsch: true,
    adresse: {
      strasseUndHausnummer: "Musterstraße 1",
      postleitzahl: "12345",
      ort: "Musterstadt",
    },
    telefon: "030 123456",
    email: "e.mustermann@example.org",
  },
  unternehmensDaten: {
    tätigkeitsbeschreibung: "Was mit Computern",
    tätigkeitsbereich: "IT",
    tätigkeitsbeginn: "2026-04-17",
    gewerbeart: "hauptgewerbe",
  },
};

describe("transformToGewerbeanmeldung", () => {
  it("splits strasseUndHausnummer into strasse and hausnummerVon", () => {
    const result = transformToGewerbeanmeldung(baseRequest);

    expect(result.referenzierteSubjekte.natuerlichePerson[0]!.anschrift).toMatchObject({
      strasse: "Musterstraße",
      hausnummerVon: "1",
    });
  });

  it("uses adresseAbweichend as betriebsstaette anschrift when provided", () => {
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
