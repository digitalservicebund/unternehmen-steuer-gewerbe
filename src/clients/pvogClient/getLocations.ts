import { fetchJson } from "../../helpers/fetchJson";

export interface PvogLocation {
  ars: string;
  name: string;
  plz?: string;
  strasse?: string;
  gemeinde?: string;
}

/**
 * Resolves a PLZ (optionally narrowed by street and house number) to the matching locations.
 * A single PLZ can span several municipalities, so the result is a list. Uses the v3 locations
 * endpoint, which is street/house-number aware.
 */
export async function getLocations(
  plz: string,
  strasse?: string,
  hausnummer?: string,
): Promise<PvogLocation[]> {
  const q = [plz, strasse, hausnummer].filter(Boolean).join(" ");
  const data = await fetchJson<PvogLocation[]>(
    "https://pvog.fitko.net/suchdienst/api/v3/locations",
    { params: { q } },
  );

  // The v3 search is fuzzy and can return neighbouring PLZ, so keep only items matching the searched PLZ.
  return data.filter((item) => item.plz === undefined || item.plz === plz);
}
