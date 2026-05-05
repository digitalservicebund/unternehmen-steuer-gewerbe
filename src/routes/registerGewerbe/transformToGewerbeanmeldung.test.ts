import { describe, it, expect } from "vitest";
import { transformToGewerbeanmeldung } from "./transformToGewerbeanmeldung";
import { RegisterGewerbeRequest } from "./registerGewerbeInterfaces";

const baseRequest: RegisterGewerbeRequest = {
  persönlicheDaten: {
    vorname: "Erika",
    nachname: "Mustermann",
    geburtsname: "Muster",
    geburtsdatum: "1988-09-10",
    geschlecht: "d",
    geburtsort: "Musterstadt",
    geburtsland: "Deutschland",
    staatsangehörigkeitDeutsch: true,
    adresse: {
      strasseUndHausnummer: "Musterstraße 1",
      postleitzahl: "12345",
      ort: "Musterstadt",
    },
    telefon: "+49 234 121314",
    email: "e.mustermann@example.org",
  },
  unternehmensDaten: {
    adresseAbweichend: {
      strasseUndHausnummer: "Musterstraße 2",
      postleitzahl: "67890",
      ort: "Musterstadt",
    },
    tätigkeitsbeschreibung: "Vertrieb von Vertriebsmustern",
    tätigkeitsbereich: "handwerk",
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

  it("maps default values, applies the geschlecht fallback if the geschlecht is not given and drops optional fields", () => {
    const request: RegisterGewerbeRequest = {
      ...baseRequest,
      persönlicheDaten: {
        ...baseRequest.persönlicheDaten,
        geburtsname: undefined,
        geschlecht: undefined,
        geburtsort: undefined,
        geburtsland: undefined,
      },
      unternehmensDaten: {
        ...baseRequest.unternehmensDaten,
        adresseAbweichend: undefined,
        istReisegewerbe: undefined,
      },
    };
    const result = transformToGewerbeanmeldung(request);
    const person = result.referenzierteSubjekte!.natuerlichePerson![0]!;

    expect(result.gewerbebetrieb!.istNebenerwerb).toBe(false);
    expect(result.gewerbebetrieb!.betriebArt).toEqual({
      industrie: false,
      handwerk: true,
      handel: false,
      sonstiges: false,
    });
    expect(result.gewerbebetrieb!.istReisegewerbe).toBe(false);
    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Musterstraße",
      hausnummerVon: "1",
      postleitzahl: "12345",
      ort: "Musterstadt",
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
});
