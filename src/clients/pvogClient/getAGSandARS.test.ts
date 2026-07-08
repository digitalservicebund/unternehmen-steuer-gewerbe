import { describe, expect, it } from "vitest";
import { getAGSandARS } from "./getAGSandARS";

describe("getAGSandARS", () => {
  it("returns AGS (Amtlicher Gemeindeschlüssel) 08421000 and ARS (Amtlicher Regionalschlüssel) 084210000000 for zip code 89073", async () => {
    const result = await getAGSandARS({ plz: "89073" });

    expect(result.ags).toBe("08421000");
    expect(result.ars).toBe("084210000000");
  });

  it("returns different AGS and ARS for Dorfstraße 1 in 25842 depending on whether an ort is given", async () => {
    const withoutOrt = await getAGSandARS({
      plz: "25842",
      strasse: "Dorfstraße",
      hausnummer: "1",
    });
    const withOrt = await getAGSandARS({
      plz: "25842",
      strasse: "Dorfstraße",
      hausnummer: "1",
      ort: "Lütjenholm",
    });

    // without ort, the API returns Ockholm as the first of several matches
    expect(withoutOrt.ags).toBe("01054093");
    expect(withoutOrt.ars).toBe("010545494093");

    expect(withOrt.ags).toBe("01054080");
    expect(withOrt.ars).toBe("010545494080");
  });

  it("throws if nothing was found for ZIP 00000", async () => {
    await expect(getAGSandARS({ plz: "00000" })).rejects.toThrow(
      "No location found for zip code 00000",
    );
  });
});
