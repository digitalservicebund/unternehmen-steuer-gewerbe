import { describe, it, expect } from "vitest";
import { transformToGewerbeanmeldung } from "./transformToGewerbeanmeldung";
import { type CreateGewerbeanmeldungXmlData } from "../../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import {
  registerGewerbeSampleRequestAllFieldsFilled,
  withUnternehmensDatenOverrides,
  withPersönlicheDatenOverrides,
  adresseBerlinHausnummerRange,
  adresseFuldaHausnummerRange,
  adresseTestorfSteinfortMitZusatz,
  adresseTestorfSteinfortOhneZusatz,
  adresseAbweichendCoburg,
} from "../testHelpers";

const testRoutingInfo = {
  ags: "03046001",
  ars: "030460014004",
  gewerbeamt: { name: "Stadt Fulda", onlineServices: [] },
  fitConnectDestinationInformation: { destinationId: "00000000-0000-0000-0000-000000000002" },
};
const testRoutingInfoHamburg = { ...testRoutingInfo, ags: "02000000" };

describe("transformToGewerbeanmeldung", () => {
  it("falls back to persönlicheDaten.adresse as betriebsstaette anschrift when adresseAbweichend is not given", () => {
    const result = transformToGewerbeanmeldung(
      withUnternehmensDatenOverrides({ adresseAbweichend: undefined }),
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Musterstraße",
      hausnummerVon: "1 a",
      postleitzahl: "03046",
      ort: "Cottbus",
    });
  });

  it("maps tätigkeitsbereich handwerk to the betriebArt flags", () => {
    const result = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gewerbebetrieb!.betriebArt).toEqual({
      industrie: false,
      handwerk: true,
      handel: false,
      sonstiges: false,
    });
  });

  it("maps gewerbeart hauptgewerbe to istNebenerwerb false", () => {
    const result = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gewerbebetrieb!.istNebenerwerb).toBe(false);
  });

  it("omits natuerlichePerson.geburtsname when geburtsname is not given", () => {
    const result = transformToGewerbeanmeldung(
      withPersönlicheDatenOverrides({ geburtsname: undefined }),
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.referenzierteSubjekte!.natuerlichePerson![0]!.name!.geburtsname).toBeUndefined();
  });

  it.each([
    {
      label: "gründungsart neugründung",
      expected: "01",
      actual: (result: CreateGewerbeanmeldungXmlData) => result.grundAnmeldungSchluessel,
    },
    {
      label: "rechtsform nichtEingetragenesEinzelunternehmen",
      expected: "412000",
      actual: (result: CreateGewerbeanmeldungXmlData) => result.gewerbebetrieb!.rechtsformcode,
    },
    {
      label: "artBetriebsstaette hauptniederlassung",
      expected: "01",
      actual: (result: CreateGewerbeanmeldungXmlData) =>
        result.gewerbebetrieb!.betriebsstaette!.artBetriebsstaette,
    },
    {
      label: "beteiligungOeffentlicheHand nein",
      expected: "0",
      actual: (result: CreateGewerbeanmeldungXmlData) =>
        result.gewerbebetrieb!.beteiligungOeffentlicheHand,
    },
  ])("maps $label to the xGewerbeordnung code $expected", ({ expected, actual }) => {
    const result = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
      "fitConnect",
    );

    expect(actual(result)).toBe(expected);
  });

  it("falls back to 'keine Angabe' for geburt.ort and geburt.staat when geburtsort and geburtsland are not given", () => {
    const result = transformToGewerbeanmeldung(
      withPersönlicheDatenOverrides({ geburtsort: undefined, geburtsland: undefined }),
      testRoutingInfo,
      "fitConnect",
    );
    const { geburt } = result.referenzierteSubjekte!.natuerlichePerson![0]!;

    expect(geburt!.ort).toBe("keine Angabe");
    expect(geburt!.staat).toBe("keine Angabe");
  });

  it.each([
    { geschlecht: "weiblich", expected: "w" },
    { geschlecht: "keineAngabe", expected: "x" },
  ] as const)(
    "maps geschlecht $geschlecht to the XInneres code $expected",
    ({ geschlecht, expected }) => {
      const result = transformToGewerbeanmeldung(
        withPersönlicheDatenOverrides({ geschlecht }),
        testRoutingInfo,
        "fitConnect",
      );

      expect(result.referenzierteSubjekte!.natuerlichePerson![0]!.geschlecht).toBe(expected);
    },
  );

  it("maps the staatsangehörigkeit key to its destatis code (deutsch = 000, französisch = 129)", async () => {
    const deutsch = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
      "fitConnect",
    );
    expect(deutsch.referenzierteSubjekte!.natuerlichePerson![0]!.staatsangehoerigkeit).toBe("000");

    const französisch = transformToGewerbeanmeldung(
      withPersönlicheDatenOverrides({ staatsangehörigkeit: "französisch" }),
      testRoutingInfo,
      "fitConnect",
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
        withPersönlicheDatenOverrides({ staatsangehörigkeitIcao: icao }),
        testRoutingInfo,
        "fitConnect",
      );

      expect(result.referenzierteSubjekte!.natuerlichePerson![0]!.staatsangehoerigkeit).toBe(
        expected,
      );
    },
  );

  it("prefers staatsangehörigkeitIcao over the deprecated staatsangehörigkeit", () => {
    const result = transformToGewerbeanmeldung(
      withPersönlicheDatenOverrides({
        staatsangehörigkeit: "französisch",
        staatsangehörigkeitIcao: "ITA",
      }),
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.referenzierteSubjekte!.natuerlichePerson![0]!.staatsangehoerigkeit).toBe("137");
  });

  it("uses anmeldedatumGewerbeamt (not anmeldedatumFinanzamt) for gueltigAb", () => {
    const result = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gueltigAb).toBe(
      registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten.anmeldedatumGewerbeamt,
    );
    expect(result.gueltigAb).not.toBe(
      registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten.anmeldedatumFinanzamt,
    );
  });

  it("uses adresseAbweichend as betriebsstaette anschrift when provided", () => {
    const result = transformToGewerbeanmeldung(
      withUnternehmensDatenOverrides({
        adresseAbweichend: {
          strasseUndHausnummer: "Betriebsweg 42a",
          postleitzahl: "23936",
          ort: "Testorf-Steinfort",
        },
      }),
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Betriebsweg",
      hausnummerVon: "42a",
      postleitzahl: "23936",
      ort: "Testorf-Steinfort",
    });
  });

  it("uses adresse as betriebsstaette anschrift when provided", () => {
    const result = transformToGewerbeanmeldung(
      withUnternehmensDatenOverrides({ adresse: adresseTestorfSteinfortOhneZusatz }),
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Betriebsweg",
      hausnummerVon: "42",
      postleitzahl: "23936",
      ort: "Testorf-Steinfort",
    });
  });

  it("maps the hausnummer 8-14 to hausnummerVon 8 and hausnummerBis 14", () => {
    const result = transformToGewerbeanmeldung(
      withUnternehmensDatenOverrides({ adresse: adresseBerlinHausnummerRange }),
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Prinzessinnenstraße",
      hausnummerVon: "8",
      hausnummerBis: "14",
      postleitzahl: "10969",
      ort: "Berlin",
    });
  });

  it("maps the hausnummer 1C-1E to hausnummerVon 1C and hausnummerBis 1E", () => {
    const result = transformToGewerbeanmeldung(
      withUnternehmensDatenOverrides({ adresse: adresseFuldaHausnummerRange }),
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Domstraße",
      hausnummerVon: "1C",
      hausnummerBis: "1E",
      postleitzahl: "36037",
      ort: "Fulda",
    });
  });

  it("appends the hausnummer Zusatz to hausnummerVon for 42a", () => {
    const result = transformToGewerbeanmeldung(
      withUnternehmensDatenOverrides({ adresse: adresseTestorfSteinfortMitZusatz }),
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Betriebsweg",
      hausnummerVon: "42a",
      postleitzahl: "23936",
      ort: "Testorf-Steinfort",
    });
  });

  it("prefers adresse over adresseAbweichend", () => {
    const result = transformToGewerbeanmeldung(
      withUnternehmensDatenOverrides({
        adresse: adresseTestorfSteinfortOhneZusatz,
        adresseAbweichend: adresseAbweichendCoburg,
      }),
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gewerbebetrieb!.betriebsstaette!.anschrift).toEqual({
      strasse: "Betriebsweg",
      hausnummerVon: "42",
      postleitzahl: "23936",
      ort: "Testorf-Steinfort",
    });
  });

  it("maps geschäftsbezeichnung to gewerbebetrieb.geschaeftsbezeichnung", () => {
    const result = transformToGewerbeanmeldung(
      withUnternehmensDatenOverrides({ geschäftsbezeichnung: "Musterhandel Schmidt" }),
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gewerbebetrieb!.geschaeftsbezeichnung).toBe("Musterhandel Schmidt");
  });

  it("omits gewerbebetrieb.geschaeftsbezeichnung when geschäftsbezeichnung is not given", () => {
    const result = transformToGewerbeanmeldung(
      withUnternehmensDatenOverrides({ geschäftsbezeichnung: undefined }),
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gewerbebetrieb!.geschaeftsbezeichnung).toBeUndefined();
  });

  it("omits gewerbebetrieb.gemeindeMeldungNr", () => {
    const result = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gewerbebetrieb!.gemeindeMeldungNr).toBeUndefined();
  });

  it("maps anzahlVollzeitBeschaeftigte and anzahlTeilzeitBeschaeftigte to gewerbebetrieb", () => {
    const result = transformToGewerbeanmeldung(
      withUnternehmensDatenOverrides({
        anzahlVollzeitBeschaeftigte: 3,
        anzahlTeilzeitBeschaeftigte: 4,
      }),
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gewerbebetrieb!.anzahlVollzeitBeschaeftigte).toBe(3);
    expect(result.gewerbebetrieb!.anzahlTeilzeitBeschaeftigte).toBe(4);
  });

  it("uses routingInfo.ags as gemeindeSchluessel", () => {
    const result = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gemeindeSchluessel).toBe(testRoutingInfo.ags);
  });

  it("derives the Hamburg gemeindeschluesselErgaenzung 02100000 from adresseAbweichend.postleitzahl 22767", () => {
    const result = transformToGewerbeanmeldung(
      withUnternehmensDatenOverrides({
        adresseAbweichend: {
          strasseUndHausnummer: "Reeperbahn 1",
          postleitzahl: "22767",
          ort: "Hamburg",
        },
      }),
      testRoutingInfoHamburg,
      "fitConnect",
    );

    expect(result.gemeindeschluesselErgaenzung).toBe("02100000");
  });

  it("derives the Hamburg gemeindeschluesselErgaenzung 02100000 from adresse.postleitzahl 22767", () => {
    const result = transformToGewerbeanmeldung(
      withUnternehmensDatenOverrides({
        adresse: { strasse: "Reeperbahn", hausnummer: "1", postleitzahl: "22767", ort: "Hamburg" },
      }),
      testRoutingInfoHamburg,
      "fitConnect",
    );

    expect(result.gemeindeschluesselErgaenzung).toBe("02100000");
  });

  it("leaves gemeindeschluesselErgaenzung undefined for non-Hamburg municipalities", () => {
    const result = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.gemeindeSchluessel).not.toBe(testRoutingInfoHamburg.ags);
    expect(result.gemeindeschluesselErgaenzung).toBeUndefined();
  });

  it("leaves gemeindeschluesselErgaenzung undefined for unmapped Hamburg PLZ 20000", () => {
    const result = transformToGewerbeanmeldung(
      withUnternehmensDatenOverrides({
        adresseAbweichend: {
          strasseUndHausnummer: "Musterstraße 1",
          postleitzahl: "20000",
          ort: "Hamburg",
        },
      }),
      testRoutingInfoHamburg,
      "fitConnect",
    );

    expect(result.gemeindeschluesselErgaenzung).toBeUndefined();
  });

  it("declares the PDF receipt as nachweisdokument.onlinedienst for the osci transportMethod", () => {
    const result = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
      "osci",
    );

    expect(result.nachweisdokumentOnlinedienst).toEqual({
      dokumentid: "gewerbeanmeldung-beleg.pdf",
      dateiname: "gewerbeanmeldung-beleg.pdf",
      mimetype: "application/pdf",
      kategorie: "Antrag im Original",
    });
  });

  it("omits nachweisdokumentOnlinedienst for the fitConnect transportMethod", () => {
    const result = transformToGewerbeanmeldung(
      registerGewerbeSampleRequestAllFieldsFilled,
      testRoutingInfo,
      "fitConnect",
    );

    expect(result.nachweisdokumentOnlinedienst).toBeUndefined();
  });
});
