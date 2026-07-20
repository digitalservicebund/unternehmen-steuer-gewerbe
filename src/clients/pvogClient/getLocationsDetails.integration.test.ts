import { afterEach, describe, expect, it, vi } from "vitest";

const { mockFetchJson } = vi.hoisted(() => ({
  mockFetchJson: vi.fn(),
}));

vi.mock("../../helpers/fetchJson", () => ({
  fetchJson: mockFetchJson,
}));

import { getLocationsDetails } from "./getLocationsDetails";

const PVOG_SUCHDIENST_API_URL = "https://pvog.fitko.net/suchdienst/api";

describe("getLocationsDetails with mocked PVOG responses", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("joins plz, ort, strasse and hausnummer into a single query string", async () => {
    mockFetchJson.mockResolvedValueOnce([]);

    await getLocationsDetails({
      plz: "25813",
      ort: "Husum",
      strasse: "Marktstraße",
      hausnummer: "1",
    });

    expect(mockFetchJson).toHaveBeenCalledWith(`${PVOG_SUCHDIENST_API_URL}/v3/locations`, {
      params: { q: "25813 Husum Marktstraße 1", distinctBy: "ars", limit: 25 },
    });
  });

  it("omits undefined query parts, only joining plz when nothing else is given", async () => {
    mockFetchJson.mockResolvedValueOnce([]);

    await getLocationsDetails({ plz: "89073" });

    expect(mockFetchJson).toHaveBeenCalledWith(`${PVOG_SUCHDIENST_API_URL}/v3/locations`, {
      params: { q: "89073", distinctBy: "ars", limit: 25 },
    });
  });

  it("returns the locations resolved by the PVOG API", async () => {
    const locations = [{ ars: "084210000000", name: "Ulm" }];
    mockFetchJson.mockResolvedValueOnce(locations);

    const result = await getLocationsDetails({ plz: "89073" });

    expect(result).toEqual(locations);
  });
});
