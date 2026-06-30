import { describe, expect, it } from "vitest";
import { getLocations } from "./getLocations";

describe("getLocations", () => {
  it("returns the single municipality Ulm with ARS 084210000000 and derived AGS 08421000 for zip code 89073", async () => {
    const result = await getLocations("89073");

    expect(result).toEqual([{ ars: "084210000000", ags: "08421000" }]);
  });

  it("returns all municipalities for zip code 25813 (Husum, Schwesing, ...) when no street is given, since that PLZ spans several municipalities", async () => {
    const result = await getLocations("25813");

    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result).toContainEqual({ ars: "010540056056", ags: "01054056" });
  });

  it("narrows zip code 25813 down to the single municipality Husum (ARS 010540056056, AGS 01054056) when the street Markt 1 is given", async () => {
    const result = await getLocations("25813", "Markt", "1");

    expect(result).toEqual([{ ars: "010540056056", ags: "01054056" }]);
  });

  it("returns an empty array for the non-existent zip code 00000 instead of throwing", async () => {
    await expect(getLocations("00000")).resolves.toEqual([]);
  });
});
