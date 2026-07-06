import { fetchJson } from "../../helpers/fetchJson";
import { PVOG_SUCHDIENST_API_URL } from "./constants";

export interface LocationDetails {
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
  return fetchJson<LocationDetails[]>(`${PVOG_SUCHDIENST_API_URL}/v3/locations`, {
    params: { q, distinctBy: "ars", limit: 25 },
  });
}
