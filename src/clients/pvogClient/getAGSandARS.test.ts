import { describe, expect, it } from "vitest";
import { getAGSandARS } from "./getAGSandARS";

describe("getAGSandARS", () => {
  it("returns AGS (Amtlicher Gemeindeschlüssel) 08421000 and ARS (Amtlicher Regionalschlüssel) 084210000000 for zip code 89073", async () => {
    const result = await getAGSandARS({ plz: "89073" });

    expect(result.ags).toBe("08421000");
    expect(result.ars).toBe("084210000000");
  });

  it("returns AGS 01054080 and ARS 010545494080 of Lütjenholm for Dorfstraße 1 in 25842 when the ort is given", async () => {
    const result = await getAGSandARS({
      plz: "25842",
      ort: "Lütjenholm",
      strasse: "Dorfstraße",
      hausnummer: "1",
    });

    expect(result.ars).toBe("010545494080");
    expect(result.ags).toBe("01054080");
  });

  it("throws if nothing was found for ZIP 00000", async () => {
    await expect(getAGSandARS({ plz: "00000" })).rejects.toThrow(
      "No location found for zip code 00000",
    );
  });
});
