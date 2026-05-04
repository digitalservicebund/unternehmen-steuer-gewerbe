import { describe, it, expect } from "vitest";
import { transformToEUnFsE } from "./transformToFsE";
import { baseRequest } from "./testHelpers";

describe("transformToEUnFsE", () => {
  it("maps output fields from request data", () => {
    const result = transformToEUnFsE(baseRequest);
    const natPers = result.eUn?.allgAngaben?.inhaber?.natPers;

    expect(natPers?.vorname).toBe("Erika");
    expect(natPers?.name).toBe("Mustermann");
    expect(natPers?.gebName).toBe("Muster");
    expect(natPers?.gebDat).toBe("10.09.1988");
    expect(natPers?.adrkette?.strAdr).toMatchObject({
      str: "Musterstraße",
      hausNr: "1",
      plz: "12345",
      ort: "Musterstadt",
    });
    expect(result.eUn?.allgAngaben?.komm?.tel?.[0]).toEqual({
      intVorw: "+49",
      natVorw: "234",
      rufNr: "121314",
    });
    expect(result.eUn?.allgAngaben?.artTaet?.gewerbeArt).toBe("Vertrieb von Vertriebsmustern");
    expect(result.eUn?.betrieb?.betrBeginn?.betriebsbeginn).toBe("17.04.2026");
  });

  it("maps geschlecht 'm' to anredeId '1' and 'w' to '2'", () => {
    const männlich = transformToEUnFsE({
      ...baseRequest,
      persönlicheDaten: { ...baseRequest.persönlicheDaten, geschlecht: "m" },
    });
    expect(männlich.eUn?.allgAngaben?.inhaber?.natPers?.anredeId).toBe("1");

    const weiblich = transformToEUnFsE({
      ...baseRequest,
      persönlicheDaten: { ...baseRequest.persönlicheDaten, geschlecht: "w" },
    });
    expect(weiblich.eUn?.allgAngaben?.inhaber?.natPers?.anredeId).toBe("2");
  });

  it("sets entsprichtWohnanschrift: true when adresseAbweichend is not set", () => {
    const { adresseAbweichend: _, ...unternehmensDatenOhneAbweichung } =
      baseRequest.unternehmensDaten;
    const result = transformToEUnFsE({
      ...baseRequest,
      unternehmensDaten: unternehmensDatenOhneAbweichung,
    });
    expect(result.eUn?.betrieb?.unternehmen?.entsprichtWohnanschrift).toBe(true);
  });
});
