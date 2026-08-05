import { describe, it, expect } from "vitest";
import { transformToGewerbeanmeldung } from "./transformToGewerbeanmeldung";
import { type RegisterGewerbeRequest } from "../registerGewerbeInterfaces";
import { registerGewerbeSampleRequestAllFieldsFilled } from "../testHelpers";

const testRoutingInfo = {
  ags: "03046001",
  ars: "030460014004",
  gewerbeamt: { name: "Stadt Fulda", onlineServices: [] },
  fitConnectDestinationInformation: { destinationId: "00000000-0000-0000-0000-000000000002" },
};
const testRoutingInfoHamburg = { ...testRoutingInfo, ags: "02000000" };

describe("transformToGewerbeanmeldung", () => {
  it("maps default values, applies the geschlecht, geburtsort and geburtsland fallbacks if not given and drops optional fields", () => {
    const request: RegisterGewerbeRequest = {
      ...registerGewerbeSampleRequestAllFieldsFilled,
      persönlicheDaten: {
        ...registerGewerbeSampleRequestAllFieldsFilled.persönlicheDaten,
        geburtsname: undefined,
        geburtsort: undefined,
        geburtsland: undefined,
      },
      unternehmensDaten: {
        ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
        adresseAbweichend: undefined,
      },
    };
    const result = transformToGewerbeanmeldung(request, testRoutingInfo);
    const person = result.referenzierteSubjekte!.natuerlichePerson![0]!;

    expect(result.gewerbebetrieb!.istNebenerwerb).toBe(false);
    expect(result.gewerbebetrieb!.betriebArt).toEqual({
      industrie: false,
      handwerk: true,
      handel: false,
      sonstiges: false,
    });
    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Musterstraße",
      hausnummerVon: "1 a",
      postleitzahl: "03046",
      ort: "Cottbus",
    });
    expect(person.geschlecht).toBe("x");
    expect(person.name!.geburtsname).toBeUndefined();
    expect(person.geburt!.ort).toBe("keine Angabe");
    expect(person.geburt!.staat).toBe("keine Angabe");
  });

  it("maps the staatsangehörigkeit key to its destatis code (deutsch = 000, französisch = 129)", async () => {
    const deutsch = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
    );
    expect(deutsch.referenzierteSubjekte!.natuerlichePerson![0]!.staatsangehoerigkeit).toBe("000");

    const französisch = transformToGewerbeanmeldung(
      {
        ...registerGewerbeSampleRequestAllFieldsFilled,
        persönlicheDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.persönlicheDaten,
          staatsangehörigkeit: "französisch",
        },
      },
      testRoutingInfo,
    );
    expect(französisch.referenzierteSubjekte!.natuerlichePerson![0]!.staatsangehoerigkeit).toBe(
      "129",
    );
  });

  it.each([
    { icao: "D", expected: "000" },
    { icao: "FRA", expected: "129" },
    { icao: "GBD", expected: "185" },
    { icao: "XXX", expected: "999" },
  ] as const)(
    "maps the staatsangehörigkeitIcao $icao to the destatis code $expected",
    ({ icao, expected }) => {
      const result = transformToGewerbeanmeldung(
        {
          ...registerGewerbeSampleRequestAllFieldsFilled,
          persönlicheDaten: {
            ...registerGewerbeSampleRequestAllFieldsFilled.persönlicheDaten,
            staatsangehörigkeitIcao: icao,
          },
        },
        testRoutingInfo,
      );

      expect(result.referenzierteSubjekte!.natuerlichePerson![0]!.staatsangehoerigkeit).toBe(
        expected,
      );
    },
  );

  it("prefers staatsangehörigkeitIcao over the deprecated staatsangehörigkeit", () => {
    const result = transformToGewerbeanmeldung(
      {
        ...registerGewerbeSampleRequestAllFieldsFilled,
        persönlicheDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.persönlicheDaten,
          staatsangehörigkeit: "französisch",
          staatsangehörigkeitIcao: "ITA",
        },
      },
      testRoutingInfo,
    );

    expect(result.referenzierteSubjekte!.natuerlichePerson![0]!.staatsangehoerigkeit).toBe("137");
  });

  it("uses datumGewerbeamt (not datumFinanzamt) for gueltigAb", () => {
    const result = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
    );

    expect(result.gueltigAb).toBe(
      registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten.datumGewerbeamt,
    );
    expect(result.gueltigAb).not.toBe(
      registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten.datumFinanzamt,
    );
  });

  it("uses adresseAbweichend as betriebsstaette anschrift when provided", () => {
    const result = transformToGewerbeanmeldung(
      {
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          adresseAbweichend: {
            strasseUndHausnummer: "Betriebsweg 42a",
            postleitzahl: "23936",
            ort: "Testorf-Steinfort",
          },
        },
      },
      testRoutingInfo,
    );

    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Betriebsweg",
      hausnummerVon: "42a",
      postleitzahl: "23936",
      ort: "Testorf-Steinfort",
    });
  });

  it("uses routingInfo.ags as gemeindeSchluessel", () => {
    const result = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
    );

    expect(result.gemeindeSchluessel).toBe(testRoutingInfo.ags);
  });

  it("derives the Hamburg gemeindeschluesselErgaenzung 02100000 from adresseAbweichend.postleitzahl 22767", () => {
    const result = transformToGewerbeanmeldung(
      {
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          adresseAbweichend: {
            strasseUndHausnummer: "Reeperbahn 1",
            postleitzahl: "22767",
            ort: "Hamburg",
          },
        },
      },
      testRoutingInfoHamburg,
    );

    expect(result.gemeindeschluesselErgaenzung).toBe("02100000");
  });

  it("leaves gemeindeschluesselErgaenzung undefined for non-Hamburg municipalities", () => {
    const result = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
    );

    expect(result.gemeindeSchluessel).not.toBe(testRoutingInfoHamburg.ags);
    expect(result.gemeindeschluesselErgaenzung).toBeUndefined();
  });

  it("leaves gemeindeschluesselErgaenzung undefined for unmapped Hamburg PLZ 20000", () => {
    const result = transformToGewerbeanmeldung(
      {
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          adresseAbweichend: {
            strasseUndHausnummer: "Musterstraße 1",
            postleitzahl: "20000",
            ort: "Hamburg",
          },
        },
      },
      testRoutingInfoHamburg,
    );

    expect(result.gemeindeschluesselErgaenzung).toBeUndefined();
  });
});
