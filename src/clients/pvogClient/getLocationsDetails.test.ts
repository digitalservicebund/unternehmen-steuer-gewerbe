import { describe, expect, it } from "vitest";
import { getLocationsDetails } from "./getLocationsDetails";

describe("getLocationsDetails", () => {
  it("returns only locations with the ARS 084210000000 of Ulm for zip code 89073, which spans a single municipality", async () => {
    const result = await getLocationsDetails("89073");

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((location) => location.ars === "084210000000")).toBe(true);
  });

  it("returns the ARS-List of all municipalities for zip code 25813 (Husum, Schwesing, ...) when no street is given, since that PLZ spans several municipalities", async () => {
    const result = await getLocationsDetails("25813");
    const allArs = result.map((location) => location.ars);

    expect(allArs.length).toBeGreaterThanOrEqual(2);
    expect(allArs).toContain("010540056056"); // Husum
    expect(allArs).toContain("010545453118"); // Schwesing
  });

  it("narrows ARS down to 010540056056 (single municipality Husum) when not only the zip code 25813, but also the street name Marktstraße 1 is given", async () => {
    const result = await getLocationsDetails("25813", "Marktstraße", "1");

    expect(result).toHaveLength(1);
    expect(result[0]!.ars).toBe("010540056056");
  });

  it("returns one entry per ARS for the zip code 17337 without duplicates", async () => {
    const result = await getLocationsDetails("17337");
    const allArs = result.map((location) => location.ars);

    expect(allArs.toSorted()).toEqual(["120730579579", "130715164132", "130755560042"]);
  });

  it("returns an empty array for the non-existent zip code 00000 instead of throwing", async () => {
    await expect(getLocationsDetails("00000")).resolves.toEqual([]);
  });
});
