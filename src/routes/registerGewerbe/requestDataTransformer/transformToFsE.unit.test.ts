import { describe, it, expect, vi } from "vitest";
import { defaultFinanzamtId, transformToEUnFsE } from "./transformToFsE";
import {
  registerGewerbeSampleRequestAllFieldsFilled,
  withUnternehmensDatenOverrides,
  adresseBerlinHausnummerRange,
  adresseFuldaHausnummerRange,
  adresseTestorfSteinfortMitZusatz,
  adresseTestorfSteinfortOhneZusatz,
  adresseAbweichendCoburg,
} from "../testHelpers";
import { ElsterFsEEUn } from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import { formatDatumDE } from "../../../helpers/formFieldTransformations";

describe("transformToEUnFsE", () => {
  it("maps output fields from request data", () => {
    const result: ElsterFsEEUn = transformToEUnFsE(registerGewerbeSampleRequestAllFieldsFilled);
    const natPers = result.eUn?.allgAngaben?.inhaber?.natPers;

    expect(natPers?.vorname).toBe("Erika");
    expect(natPers?.name).toBe("Mustermann");
    expect(natPers?.gebName).toBe("Muster");
    expect(natPers?.gebDat).toBe("10.09.1988");
    expect(natPers?.persIdNr).toBe("06646829576");
    expect(natPers?.adrkette?.strAdr).toMatchObject({
      str: "Musterstraße",
      hausNr: "1",
      hausNrZu: "a",
      plz: "03046",
      ort: "Cottbus",
    });
    expect(result.eUn?.allgAngaben?.komm?.tel?.[0]).toEqual({
      intVorw: "+1",
      natVorw: "415",
      rufNr: "5552671",
    });
    expect(result.eUn?.allgAngaben?.artTaet?.gewerbeArt).toBe("Vertrieb von Mustern");
    expect(result.eUn?.betrieb?.betrBeginn?.betriebsbeginn).toBe("17.04.2026");
    expect(result.eUn?.betrieb?.gruendungsangaben?.gruendungsForm?.uebertrStichtag).toBe(
      "17.04.2026",
    );
    expect(result.eUn?.umsatzsteuer?.sollIstVersteuerung?.auswahlSollIstVerst).toBe("1");
    expect(result.eUn?.umsatzsteuer?.zahllastUeberschuss?.auswahl).toBe("1"); // 1 means "zahllast", 2 means "überschuss"
    expect(result.eUn?.umsatzsteuer?.zahllastUeberschuss?.betrag).toBe(0);

    expect(
      result.eUn?.festsetzungsAngaben?.voraussichtlicheEinkuenfte?.einkGewBetr?.gruendJahrA,
    ).toBe(1);
    expect(
      result.eUn?.festsetzungsAngaben?.voraussichtlicheEinkuenfte?.einkGewBetr?.folgeJahrA,
    ).toBe(1);

    expect(result.eUn?.umsatzsteuer?.uStIdNr?.uStIdAntrag?.merkerAntragUStId).toBe(true);
  });

  it("maps gründungsart to gruendungsForm.gruendungsArt (neugründung = 1)", () => {
    const result = transformToEUnFsE(registerGewerbeSampleRequestAllFieldsFilled);

    expect(result.eUn?.betrieb?.gruendungsangaben?.gruendungsForm?.gruendungsArt).toBe("1");
  });

  it("maps anmeldedatumFinanzamt to both betriebsbeginn and uebertrStichtag", () => {
    const result = transformToEUnFsE(registerGewerbeSampleRequestAllFieldsFilled);
    const expectedDate = formatDatumDE(
      registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten.anmeldedatumFinanzamt,
    );

    expect(result.eUn?.betrieb?.betrBeginn?.betriebsbeginn).toBe(expectedDate);
    expect(result.eUn?.betrieb?.gruendungsangaben?.gruendungsForm?.uebertrStichtag).toBe(
      expectedDate,
    );
  });

  describe("gewerbeArt (tätigkeitsbeschreibung)", () => {
    it("falls back to tätigkeitsbeschreibung when tätigkeitsbeschreibungKurz is missing", () => {
      const result = transformToEUnFsE(
        withUnternehmensDatenOverrides({
          tätigkeitsbeschreibung: "Vertrieb von Vertriebsmustern",
          tätigkeitsbeschreibungKurz: undefined,
        }),
      );

      expect(result.eUn?.allgAngaben?.artTaet?.gewerbeArt).toBe("Vertrieb von Vertriebsmustern");
    });

    it("truncates the tätigkeitsbeschreibung fallback to 200 characters", () => {
      const result = transformToEUnFsE(
        withUnternehmensDatenOverrides({
          tätigkeitsbeschreibung: "a".repeat(250),
          tätigkeitsbeschreibungKurz: undefined,
        }),
      );

      expect(result.eUn?.allgAngaben?.artTaet?.gewerbeArt).toBe("a".repeat(200));
    });
  });

  describe("finanzamtId", () => {
    it("uses default testfinanzamt (instead of the given 0000) if ERIC_ENABLE_CUSTOM_FINANZAMT_IDS is not set", () => {
      vi.stubEnv("ERIC_ENABLE_CUSTOM_FINANZAMT_IDS", "");

      const result = transformToEUnFsE(registerGewerbeSampleRequestAllFieldsFilled, "0000");

      expect(result.nutzdatenHeader?.empfaenger?.value).toEqual(defaultFinanzamtId); // not 0000
    });

    it("uses the given id 1111 if CUSTOM_FINANZAMT_ID_ENABLED=true set in environment", () => {
      vi.stubEnv("ERIC_ENABLE_CUSTOM_FINANZAMT_IDS", "true");

      const result = transformToEUnFsE(registerGewerbeSampleRequestAllFieldsFilled, "1111");

      expect(result.nutzdatenHeader?.empfaenger?.value).toEqual("1111");
    });

    it("uses default testfinanzamt if no finanzamt is given", () => {
      vi.stubEnv("ERIC_ENABLE_CUSTOM_FINANZAMT_IDS", "true");

      const result = transformToEUnFsE(registerGewerbeSampleRequestAllFieldsFilled); // no finanzamtId

      expect(result.nutzdatenHeader?.empfaenger?.value).toEqual(defaultFinanzamtId);
    });
  });

  describe("umsatzsteuer", () => {
    it.each([
      {
        zahllastUeberschussAuswahl: "zahllast" as const,
        zahllastUeberschussBetrag: 111,
        expectedAuswahl: "1",
        deprecatedUmsatzsteuerImErstenJahr: -111,
      },
      {
        zahllastUeberschussAuswahl: "ueberschuss" as const,
        zahllastUeberschussBetrag: 222,
        expectedAuswahl: "2",
        deprecatedUmsatzsteuerImErstenJahr: 222,
      },
    ])(
      "maps zahllastUeberschussAuswahl $zahllastUeberschussAuswahl and zahllastUeberschussBetrag $zahllastUeberschussBetrag, ignoring the deprecated umsatzsteuerImErstenJahr",
      ({
        zahllastUeberschussAuswahl,
        zahllastUeberschussBetrag,
        expectedAuswahl,
        deprecatedUmsatzsteuerImErstenJahr,
      }) => {
        const data = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);
        data.unternehmensDaten.zahllastUeberschussAuswahl = zahllastUeberschussAuswahl;
        data.unternehmensDaten.zahllastUeberschussBetrag = zahllastUeberschussBetrag;
        // deprecated field must be ignored; set to a value that would flip the result if it were still read
        data.unternehmensDaten.umsatzsteuerImErstenJahr = deprecatedUmsatzsteuerImErstenJahr;

        const result = transformToEUnFsE(data);

        expect(result.eUn?.umsatzsteuer?.zahllastUeberschuss?.auswahl).toEqual(expectedAuswahl);
        expect(result.eUn?.umsatzsteuer?.zahllastUeberschuss?.betrag).toEqual(
          zahllastUeberschussBetrag,
        );
      },
    );

    it("maps uStIdNr to undefined if umsatzsteuerIdMitbeantragen=false", () => {
      const caseFalse = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);
      caseFalse.unternehmensDaten.umsatzsteuerIdMitbeantragen = false;

      const result = transformToEUnFsE(caseFalse);

      expect(result.eUn?.umsatzsteuer?.uStIdNr).toBeUndefined();
    });

    it("maps onlinehandel and influencer", () => {
      const result = transformToEUnFsE(registerGewerbeSampleRequestAllFieldsFilled);

      expect(result.eUn?.umsatzsteuer?.onlinehandel).toEqual({
        eigenerWebshop: true,
        adresseEigenerWebshop: "https://example.org",
        onlineMarktplaetze: true,
        onlineMarktplatz: [{ nameMarktplatz: "Amazon", nameAccount: "example-shop" }],
      });
      expect(result.eUn?.umsatzsteuer?.influencer).toEqual({
        influencerUmsatz: true,
        plattform: [{ namePlattform: "Instagram", nameAccount: "example" }],
      });
    });

    it("omits eigenerWebshop/onlineMarktplaetze/influencerUmsatz when false (JaTrueBaseSType only allows 'true')", () => {
      const data = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);
      data.unternehmensDaten.onlinehandel = {
        eigenerWebshop: false,
        onlineMarktplaetze: false,
      };
      data.unternehmensDaten.influencer = { influencerUmsatz: false };

      const result = transformToEUnFsE(data);

      expect(result.eUn?.umsatzsteuer?.onlinehandel?.eigenerWebshop).toBeUndefined();
      expect(result.eUn?.umsatzsteuer?.onlinehandel?.onlineMarktplaetze).toBeUndefined();
      expect(result.eUn?.umsatzsteuer?.influencer?.influencerUmsatz).toBeUndefined();
    });

    it("omits onlinehandel and influencer entirely when not given", () => {
      const data = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);
      data.unternehmensDaten.onlinehandel = undefined;
      data.unternehmensDaten.influencer = undefined;

      const result = transformToEUnFsE(data);

      expect(result.eUn?.umsatzsteuer?.onlinehandel).toBeUndefined();
      expect(result.eUn?.umsatzsteuer?.influencer).toBeUndefined();
    });
  });

  it.each([
    ["unterschreitungUmsatzgrenze", "istVerstUStGrundUmsatz"],
    ["befreiungBuchführungspflicht", "istVerstUStGrundAO"],
    ["freiberuflicheTätigkeit", "istVerstUStGrundFreierBeruf"],
  ] as const)(
    "maps istVersteuerungGrund '%s' to the %s flag and leaves the others unset",
    (grund, expectedFlag) => {
      const result = transformToEUnFsE(
        withUnternehmensDatenOverrides({
          sollIstVersteuerung: "istVersteuerung",
          istVersteuerungGrund: grund,
        }),
      );
      const sollIstVersteuerung = result.eUn?.umsatzsteuer?.sollIstVersteuerung;
      for (const flag of [
        "istVerstUStGrundUmsatz",
        "istVerstUStGrundAO",
        "istVerstUStGrundFreierBeruf",
      ] as const) {
        expect(sollIstVersteuerung?.[flag]).toBe(flag === expectedFlag ? true : undefined);
      }
    },
  );

  it("maps geschäftsbezeichnung to eUn.betrieb.unternehmen.abwFirmenname", () => {
    const result = transformToEUnFsE(
      withUnternehmensDatenOverrides({ geschäftsbezeichnung: "Musterhandel Schmidt" }),
    );
    expect(result.eUn?.betrieb?.unternehmen?.abwFirmenname).toBe("Musterhandel Schmidt");
  });

  it("omits eUn.betrieb.unternehmen.abwFirmenname when geschäftsbezeichnung is not given", () => {
    const result = transformToEUnFsE(
      withUnternehmensDatenOverrides({ geschäftsbezeichnung: undefined }),
    );
    expect(result.eUn?.betrieb?.unternehmen?.abwFirmenname).toBeUndefined();
  });

  it("sets entsprichtWohnanschrift: true when neither adresse nor adresseAbweichend is set", () => {
    const { adresseAbweichend: _, ...unternehmensDatenOhneAbweichung } =
      registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten;
    const result = transformToEUnFsE({
      ...registerGewerbeSampleRequestAllFieldsFilled,
      unternehmensDaten: unternehmensDatenOhneAbweichung,
    });
    expect(result.eUn?.betrieb?.unternehmen?.entsprichtWohnanschrift).toBe(true);
  });

  it("maps adresseAbweichend to Unternehmen-Anschrift (ERiC Anschrift_angegeben)", () => {
    const result = transformToEUnFsE(registerGewerbeSampleRequestAllFieldsFilled);
    expect(result.eUn?.betrieb?.unternehmen?.entsprichtWohnanschrift).toBeUndefined();
    expect(result.eUn?.betrieb?.unternehmen?.adrkette?.strAdr).toMatchObject({
      str: "Musterstraße",
      hausNr: "2",
      hausNrZu: "a",
      plz: "96450",
      ort: "Coburg",
    });
  });

  it("maps adresse to Unternehmen-Anschrift", () => {
    const result = transformToEUnFsE(
      withUnternehmensDatenOverrides({ adresse: adresseTestorfSteinfortMitZusatz }),
    );
    expect(result.eUn?.betrieb?.unternehmen?.adrkette?.strAdr).toMatchObject({
      str: "Betriebsweg",
      hausNr: "42",
      hausNrZu: "a",
      plz: "23936",
      ort: "Testorf-Steinfort",
    });
  });

  it("maps the hausnummer 8-14 to hausNrZu -14", () => {
    const result = transformToEUnFsE(
      withUnternehmensDatenOverrides({ adresse: adresseBerlinHausnummerRange }),
    );
    expect(result.eUn?.betrieb?.unternehmen?.adrkette?.strAdr).toMatchObject({
      str: "Prinzessinnenstraße",
      hausNr: "8",
      hausNrZu: "-14",
      plz: "10969",
      ort: "Berlin",
    });
  });

  it("maps the hausnummer 1C-1E to hausNrZu C-1E", () => {
    const result = transformToEUnFsE(
      withUnternehmensDatenOverrides({ adresse: adresseFuldaHausnummerRange }),
    );
    expect(result.eUn?.betrieb?.unternehmen?.adrkette?.strAdr).toMatchObject({
      str: "Domstraße",
      hausNr: "1",
      hausNrZu: "C-1E",
      plz: "36037",
      ort: "Fulda",
    });
  });

  it("prefers adresse over adresseAbweichend", () => {
    const result = transformToEUnFsE(
      withUnternehmensDatenOverrides({
        adresse: adresseTestorfSteinfortOhneZusatz,
        adresseAbweichend: adresseAbweichendCoburg,
      }),
    );
    expect(result.eUn?.betrieb?.unternehmen?.adrkette?.strAdr).toMatchObject({
      str: "Betriebsweg",
      hausNr: "42",
      plz: "23936",
      ort: "Testorf-Steinfort",
    });
  });

  it("sets kleinUnternUStVerzicht=true when kleinunternehmerRegelung is false (ERiC KleinUN_fehlende_Angaben), kleinUnternUst is undefined", () => {
    const result = transformToEUnFsE(registerGewerbeSampleRequestAllFieldsFilled);
    expect(result.eUn?.umsatzsteuer?.kleinunternehmerRegelung).toEqual({
      kleinUnternUStVerzicht: true,
    });
    expect(result.eUn?.umsatzsteuer?.kleinunternehmerRegelung?.kleinUnternUSt).toBeUndefined();
  });

  describe("bankKonto", () => {
    it("maps personensteuerkonto and betriebssteuerkonto to BankKonto entries with matching Steuerart", () => {
      const result = transformToEUnFsE(registerGewerbeSampleRequestAllFieldsFilled);

      expect(result.eUn?.allgAngaben?.bankKonto).toEqual([
        {
          iban: "DE02120300000000202051",
          steuerart: "1", // 1 means "Personensteuern", 2 means "Betriebssteuern"
          kontoinhaber: { rolleKontoinhaber: "1", abwKontoinhaber: undefined }, // 1 means "die steuerpflichtige Person"
        },
        {
          iban: "DE02500105170137075030",
          steuerart: "2", // 1 means "Personensteuern", 2 means "Betriebssteuern"
          kontoinhaber: { rolleKontoinhaber: "99", abwKontoinhaber: "Max Mustermann" }, // 99 means "eine andere Person"
        },
      ]);
    });

    it("puts a foreign IBAN (identified by a non-DE country code) into ibanAusland instead of iban", () => {
      const result = transformToEUnFsE({
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          bankKonto: {
            personensteuerkonto: {
              iban: "FR7630006000011234567890189",
              bic: "AGRIFRPP",
              kontoinhaber: "steuerpflichtigePerson",
            },
          },
        },
      });

      expect(result.eUn?.allgAngaben?.bankKonto).toEqual([
        {
          ibanAusland: "FR7630006000011234567890189",
          bic: "AGRIFRPP",
          steuerart: "1", // 1 means "Personensteuern", 2 means "Betriebssteuern"
          kontoinhaber: { rolleKontoinhaber: "1", abwKontoinhaber: undefined }, // 1 means "die steuerpflichtige Person"
        },
      ]);
    });

    it("omits betriebssteuerkonto's entry when not given", () => {
      const result = transformToEUnFsE({
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          bankKonto: {
            personensteuerkonto: {
              iban: "DE02120300000000202051",
              kontoinhaber: "steuerpflichtigePerson",
            },
          },
        },
      });

      expect(result.eUn?.allgAngaben?.bankKonto).toHaveLength(1);
    });

    it("is undefined when no bankKonto is given", () => {
      const result = transformToEUnFsE({
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          bankKonto: undefined,
        },
      });

      expect(result.eUn?.allgAngaben?.bankKonto).toBeUndefined();
    });
  });

  it("sets kleinUnternUSt=true when kleinunternehmerRegelung is true, kleinUnternUStVerzicht is undefined", () => {
    const result = transformToEUnFsE({
      ...registerGewerbeSampleRequestAllFieldsFilled,
      unternehmensDaten: {
        ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
        kleinunternehmerRegelung: true,
      },
    });
    expect(result.eUn?.umsatzsteuer?.kleinunternehmerRegelung).toEqual({
      kleinUnternUSt: true,
    });
    expect(
      result.eUn?.umsatzsteuer?.kleinunternehmerRegelung?.kleinUnternUStVerzicht,
    ).toBeUndefined();
  });
});
