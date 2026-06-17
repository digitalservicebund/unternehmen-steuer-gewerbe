import { describe, expect, it } from "vitest";
import { getAGSandARS } from "./getAGSandARS";

describe("getAGSandARS", () => {
  it("returns AGS (Amtlicher Gemeindeschlüssel) 08421000 and ARS (Amtlicher Regionalschlüssel) 084210000000 for zip code 89073", async () => {
    const result = await getAGSandARS("89073");

    expect(result.ags).toBe("08421000");
    expect(result.ars).toBe("084210000000");
  });

  it("throws if nothing was found for ZIP 00000", async () => {
    await expect(getAGSandARS("00000")).rejects.toThrow("No location found for zip code 00000");
  });
});
