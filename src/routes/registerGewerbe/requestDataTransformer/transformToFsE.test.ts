import { describe, it, expect } from "vitest";
import { transformToEUnFsE } from "./transformToFsE";
import { registerGewerbeSampleRequestAllFieldsFilled } from "../testHelpers";
import { RegisterGewerbeRequestSchema } from "../registerGewerbeInterfaces";
import { formatDatumDE } from "../../../helpers/formFieldTransformations";
import { ElsterFsEEUn } from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";

describe("transformToEUnFsE", () => {
  it("maps output fields from request data", () => {
    const result: ElsterFsEEUn = transformToEUnFsE(registerGewerbeSampleRequestAllFieldsFilled);
    const natPers = result.eUn?.allgAngaben?.inhaber?.natPers;

    expect(natPers?.vorname).toBe("Erika");
    expect(natPers?.name).toBe("Mustermann");
    expect(natPers?.gebName).toBe("Muster");
    expect(natPers?.gebDat).toBe("10.09.1988");
    expect(natPers?.adrkette?.strAdr).toMatchObject({
      str: "Musterstraße",
      hausNr: "1",
      plz: "03046",
      ort: "Cottbus",
    });
    expect(result.eUn?.allgAngaben?.komm?.tel?.[0]).toEqual({
      intVorw: "+49",
      natVorw: "234",
      rufNr: "121314",
    });
    expect(result.eUn?.allgAngaben?.artTaet?.gewerbeArt).toBe("Vertrieb von Vertriebsmustern");
    expect(result.eUn?.betrieb?.betrBeginn?.betriebsbeginn).toBe("17.04.2026");
    expect(result.eUn?.betrieb?.gruendungsangaben?.gruendungsForm?.uebertrStichtag).toBe(
      "18.05.2026",
    );
    expect(result.eUn?.umsatzsteuer?.sollIstVersteuerung?.auswahlSollIstVerst).toBe("1");
    expect(result.eUn?.umsatzsteuer?.zahllastUeberschuss?.auswahl).toBe("2"); // 1 means "zahllast", 2 means "überschuss"
    expect(result.eUn?.umsatzsteuer?.zahllastUeberschuss?.betrag).toBe(111);

    expect(
      result.eUn?.festsetzungsAngaben?.voraussichtlicheEinkuenfte?.einkGewBetr?.gruendJahrA,
    ).toBe(1);
    expect(
      result.eUn?.festsetzungsAngaben?.voraussichtlicheEinkuenfte?.einkGewBetr?.folgeJahrA,
    ).toBe(1);

    expect(result.eUn?.umsatzsteuer?.uStIdNr?.uStIdAntrag?.merkerAntragUStId).toBe(true);
  });

  it("maps uStIdNr to undefined if umsatzsteuerIdMitbeantragen=false or undefined", () => {
    const caseFalse = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);
    caseFalse.unternehmensDaten.umsatzsteuerIdMitbeantragen = false;

    const caseUndefined = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);
    caseUndefined.unternehmensDaten.umsatzsteuerIdMitbeantragen = undefined;

    const resultForFalse = transformToEUnFsE(caseUndefined);
    const resultForUndefined = transformToEUnFsE(caseFalse);

    expect(resultForFalse.eUn?.umsatzsteuer?.uStIdNr).toBeUndefined();
    expect(resultForUndefined.eUn?.umsatzsteuer?.uStIdNr).toBeUndefined();
  });

  it("maps geschlecht 'm' to anredeId '1' and 'w' to '2'", () => {
    const männlich = transformToEUnFsE({
      ...registerGewerbeSampleRequestAllFieldsFilled,
      persönlicheDaten: {
        ...registerGewerbeSampleRequestAllFieldsFilled.persönlicheDaten,
        geschlecht: "m",
      },
    });
    expect(männlich.eUn?.allgAngaben?.inhaber?.natPers?.anredeId).toBe("1");

    const weiblich = transformToEUnFsE({
      ...registerGewerbeSampleRequestAllFieldsFilled,
      persönlicheDaten: {
        ...registerGewerbeSampleRequestAllFieldsFilled.persönlicheDaten,
        geschlecht: "w",
      },
    });
    expect(weiblich.eUn?.allgAngaben?.inhaber?.natPers?.anredeId).toBe("2");

    const istVersteuerung = transformToEUnFsE({
      ...registerGewerbeSampleRequestAllFieldsFilled,
      unternehmensDaten: {
        ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
        sollIstVersteuerung: "istVersteuerung",
      },
    });
    expect(istVersteuerung.eUn?.umsatzsteuer?.sollIstVersteuerung?.auswahlSollIstVerst).toBe("2");

    const ueberschuss = transformToEUnFsE({
      ...registerGewerbeSampleRequestAllFieldsFilled,
      unternehmensDaten: {
        ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
        zahllastUeberschussAuswahl: "ueberschuss",
      },
    });
    expect(ueberschuss.eUn?.umsatzsteuer?.zahllastUeberschuss?.auswahl).toBe("2");
  });

  it.each([
    ["unterschreitungUmsatzgrenze", "istVerstUStGrundUmsatz"],
    ["befreiungBuchführungspflicht", "istVerstUStGrundAO"],
    ["freiberuflicheTätigkeit", "istVerstUStGrundFreierBeruf"],
  ] as const)(
    "maps istVersteuerungGrund '%s' to the %s flag and leaves the others unset",
    (grund, expectedFlag) => {
      const result = transformToEUnFsE({
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          sollIstVersteuerung: "istVersteuerung",
          istVersteuerungGrund: grund,
        },
      });
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

  it("sets entsprichtWohnanschrift: true when adresseAbweichend is not set", () => {
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
      plz: "96450",
      ort: "Coburg",
    });
  });

  it("sets kleinUnternUStVerzicht=true when kleinunternehmerRegelung is false (ERiC KleinUN_fehlende_Angaben), kleinUnternUst is undefined", () => {
    const result = transformToEUnFsE(registerGewerbeSampleRequestAllFieldsFilled);
    expect(result.eUn?.umsatzsteuer?.kleinunternehmerRegelung).toEqual({
      kleinUnternUStVerzicht: true,
    });
    expect(result.eUn?.umsatzsteuer?.kleinunternehmerRegelung?.kleinUnternUSt).toBeUndefined();
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

  // TODO: temporary — the gründungsdatum default exists only to give the OSS time to
  // start sending the field. Remove this test together with the schema default once
  // gründungsdatum is always provided (field made required).
  it("falls back to today's date for uebertrStichtag when gründungsdatum is omitted", () => {
    const { gründungsdatum: _, ...unternehmensDatenOhneGründung } =
      registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten;
    const parsed = RegisterGewerbeRequestSchema.parse({
      ...registerGewerbeSampleRequestAllFieldsFilled,
      unternehmensDaten: unternehmensDatenOhneGründung,
    });

    const result = transformToEUnFsE(parsed);

    const heute = formatDatumDE(new Date().toISOString().split("T")[0]!);
    expect(result.eUn?.betrieb?.gruendungsangaben?.gruendungsForm?.uebertrStichtag).toBe(heute);
  });
});
