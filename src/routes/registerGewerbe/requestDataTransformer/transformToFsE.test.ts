import { describe, it, expect } from "vitest";
import { transformToEUnFsE } from "./transformToFsE";
import { registerGewerbeSampleRequestAllFieldsFilled } from "../testHelpers";
import { RegisterGewerbeRequestSchema } from "../registerGewerbeInterfaces";
import { formatDatumDE } from "../../../helpers/formFieldTransformations";

describe("transformToEUnFsE", () => {
  it("maps output fields from request data", () => {
    const result = transformToEUnFsE(registerGewerbeSampleRequestAllFieldsFilled);
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
    expect(result.eUn?.umsatzsteuer?.zahllastUeberschuss?.auswahl).toBe("1");
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

  it("sets entsprichtWohnanschrift: true when adresseAbweichend is not set", () => {
    const { adresseAbweichend: _, ...unternehmensDatenOhneAbweichung } =
      registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten;
    const result = transformToEUnFsE({
      ...registerGewerbeSampleRequestAllFieldsFilled,
      unternehmensDaten: unternehmensDatenOhneAbweichung,
    });
    expect(result.eUn?.betrieb?.unternehmen?.entsprichtWohnanschrift).toBe(true);
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
