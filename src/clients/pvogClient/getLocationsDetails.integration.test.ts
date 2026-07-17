import { afterEach, describe, expect, it, vi } from "vitest";

const { mockFetchJson } = vi.hoisted(() => ({
  mockFetchJson: vi.fn(),
}));

vi.mock("../../helpers/fetchJson", () => ({
  fetchJson: mockFetchJson,
}));

import { getLocationsDetails } from "./getLocationsDetails";
import {
  dorfstrasse25842WithOrt,
  dorfstrasse25842WithoutOrt,
  noLocations,
  plz17337Locations,
  plz25813AllMunicipalities,
  plz25813Narrowed,
  ulmLocations,
} from "./getLocationsDetails.fixtures";

// Mocked counterpart of getLocationsDetails.contract.test.ts - same scenarios and assertions,
// against fixtures recorded from the real PVOG API instead of a live call.
describe("getLocationsDetails with mocked PVOG responses", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns only locations with the ARS 084210000000 of Ulm for zip code 89073, which spans a single municipality", async () => {
    mockFetchJson.mockResolvedValueOnce(ulmLocations);

    const result = await getLocationsDetails({ plz: "89073" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((location) => location.ars === "084210000000")).toBe(true);
  });

  it("returns the ARS-List of all municipalities for zip code 25813 (Husum, Schwesing, ...) when no street is given, since that PLZ spans several municipalities", async () => {
    mockFetchJson.mockResolvedValueOnce(plz25813AllMunicipalities);

    const result = await getLocationsDetails({ plz: "25813" });
    const allArs = result.map((location) => location.ars);
    expect(allArs.length).toBeGreaterThanOrEqual(2);
    expect(allArs).toContain("010540056056"); // Husum
    expect(allArs).toContain("010545453118"); // Schwesing
  });

  it("narrows ARS down to 010540056056 (single municipality Husum) when not only the zip code 25813, but also the street name Marktstraße 1 is given", async () => {
    mockFetchJson.mockResolvedValueOnce(plz25813Narrowed);

    const result = await getLocationsDetails({
      plz: "25813",
      strasse: "Marktstraße",
      hausnummer: "1",
    });
    expect(result).toHaveLength(1);
    expect(result[0]!.ars).toBe("010540056056");
  });

  it("returns different municipalities for Dorfstraße 1 in 25842 depending on whether an ort is given", async () => {
    mockFetchJson
      .mockResolvedValueOnce(dorfstrasse25842WithoutOrt)
      .mockResolvedValueOnce(dorfstrasse25842WithOrt);

    const withoutOrt = await getLocationsDetails({
      plz: "25842",
      strasse: "Dorfstraße",
      hausnummer: "1",
    });
    const withOrt = await getLocationsDetails({
      plz: "25842",
      ort: "Lütjenholm",
      strasse: "Dorfstraße",
      hausnummer: "1",
    });

    // without ort: Langenhorn, Lütjenholm and Ockholm all match
    const allArs = withoutOrt.map((location) => location.ars);
    expect(allArs.toSorted()).toEqual(["010545494075", "010545494080", "010545494093"]);

    expect(withOrt).toHaveLength(1);
    expect(withOrt[0]!.ars).toBe("010545494080");
  });

  it("returns three entries (one entry per ARS) for the zip code 17337 without duplicates", async () => {
    mockFetchJson.mockResolvedValueOnce(plz17337Locations);

    const result = await getLocationsDetails({ plz: "17337" });
    const allArs = result.map((location) => location.ars);
    expect(allArs.toSorted()).toEqual(["120730579579", "130715164132", "130755560042"]);
  });

  it("returns an empty array for the non-existent zip code 00000 instead of throwing", async () => {
    mockFetchJson.mockResolvedValueOnce(noLocations);
    await expect(getLocationsDetails({ plz: "00000" })).resolves.toEqual([]);
  });
});
