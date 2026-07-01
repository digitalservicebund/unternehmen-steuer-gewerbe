import { describe, expect, it } from "vitest";
import { getLocations } from "./getLocations";

describe("getLocations", () => {
  it("returns only locations with the ARS 084210000000 of Ulm for zip code 89073, which spans a single municipality", async () => {
    const result = await getLocations("89073");

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((location) => location.ars === "084210000000")).toBe(true);
  });

  it("returns the ARS of all municipalities for zip code 25813 (Husum, Schwesing, ...) when no street is given, since that PLZ spans several municipalities", async () => {
    const result = await getLocations("25813");
    const allArs = result.map((location) => location.ars);

    expect(allArs.length).toBeGreaterThanOrEqual(2);
    expect(allArs).toContain("010540056056"); // Husum
    expect(allArs).toContain("010545453118"); // Schwesing
  });

  it("narrows zip code 25813 down to the ARS 010540056056 of the single municipality Husum when the street Markt 1 is given", async () => {
    const result = await getLocations("25813", "Markt", "1");

    expect(result.every((location) => location.ars === "010540056056")).toBe(true);
  });

  it("returns an empty array for the non-existent zip code 00000 instead of throwing", async () => {
    await expect(getLocations("00000")).resolves.toEqual([]);
  });
});
