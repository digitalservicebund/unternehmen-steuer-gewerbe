import { fetchJson } from "../../helpers/fetchJson";

interface LocationDetails {
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
export async function getLocationsDetails(
  plz: string,
  strasse?: string,
  hausnummer?: string,
): Promise<LocationDetails[]> {
  const q = [plz, strasse, hausnummer].filter(Boolean).join(" ");
  const data = await fetchJson<LocationDetails[]>(
    "https://pvog.fitko.net/suchdienst/api/v3/locations",
    { params: { q } },
  );
  return data;
}
