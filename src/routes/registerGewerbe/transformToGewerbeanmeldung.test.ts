import { describe, it, expect } from "vitest";
import { transformToGewerbeanmeldung } from "./transformToGewerbeanmeldung";
import { RegisterGewerbeRequest } from "./registerGewerbeInterfaces";

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
    telefon: "+49 30 123456",
    email: "e.mustermann@example.org",
  },
  unternehmensDaten: {
    tätigkeitsbeschreibung: "Was mit Computern",
    tätigkeitsbereich: "sonstiges",
    tätigkeitsbeginn: "2026-04-17",
    gewerbeart: "hauptgewerbe",
    istReisegewerbe: false,
  },
};

describe("transformToGewerbeanmeldung", () => {
  it("splits strasseUndHausnummer into strasse and hausnummerVon", () => {
    const result = transformToGewerbeanmeldung(baseRequest);

    expect(result.referenzierteSubjekte!.natuerlichePerson![0]!.anschrift).toMatchObject({
      strasse: "Musterstraße",
      hausnummerVon: "1",
    });
  });

  it("maps default flags and applies the geschlecht fallback if the geschlecht is not given", () => {
    const result = transformToGewerbeanmeldung(baseRequest);
    const person = result.referenzierteSubjekte!.natuerlichePerson![0]!;

    expect(result.gewerbebetrieb!.istReisegewerbe).toBe(false);
    expect(result.gewerbebetrieb!.istNebenerwerb).toBe(false);
    expect(result.gewerbebetrieb!.betriebArt).toEqual({
      industrie: false,
      handwerk: false,
      handel: false,
      sonstiges: true,
    });
    expect(person.geschlecht).toBe("x");
    expect(person.name!.geburtsname).toBeUndefined();
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

    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Betriebsweg",
      hausnummerVon: "42a",
      postleitzahl: "67890",
      ort: "Gewerbestadt",
    });
  });

  it("falls back to persönliche Adresse for the betriebsstaette when adresseAbweichend is missing", () => {
    const result = transformToGewerbeanmeldung(baseRequest);

    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Musterstraße",
      hausnummerVon: "1",
      postleitzahl: "12345",
      ort: "Musterstadt",
    });
  });

  it("maps optional persönliche Daten and gewerbe flags, dropping undefined geburt fields", () => {
    const result = transformToGewerbeanmeldung({
      ...baseRequest,
      persönlicheDaten: {
        ...baseRequest.persönlicheDaten,
        geschlecht: "d",
        geburtsname: "Muster",
        geburtsort: undefined,
        geburtsland: undefined,
      },
      unternehmensDaten: {
        ...baseRequest.unternehmensDaten,
        gewerbeart: "nebengewerbe",
        tätigkeitsbereich: "industrie",
        istReisegewerbe: true,
      },
    });
    const person = result.referenzierteSubjekte!.natuerlichePerson![0]!;

    expect(result.gewerbebetrieb!.istReisegewerbe).toBe(true);
    expect(result.gewerbebetrieb!.istNebenerwerb).toBe(true);
    expect(result.gewerbebetrieb!.betriebArt).toEqual({
      industrie: true,
      handwerk: false,
      handel: false,
      sonstiges: false,
    });
    expect(person.geschlecht).toBe("d");
    expect(person.name!.geburtsname).toBe("Muster");
    expect(person.geburt!.ort).toBeUndefined();
    expect(person.geburt!.staat).toBeUndefined();
  });
});
