import { fetchJson } from "../../helpers/fetchJson";
import { PVOG_SUCHDIENST_API_URL } from "./constants";

export interface LocationDetails {
  ars: string;
  name: string;
  plz?: string;
  strasse?: string;
  gemeinde?: string;
}

export interface LocationQuery {
  plz: string;
  ort?: string;
  strasse?: string;
  hausnummer?: string;
}

/**
 * Resolves a PLZ (optionally narrowed by ort, street and house number) to the matching locations.
 * A single PLZ can span several municipalities, so the result is a list. Uses the v3 locations
 * endpoint, which is street/house-number aware. The ort disambiguates street names that exist
 * in several municipalities of the same PLZ.
 */
export async function getLocationsDetails({
  plz,
  ort,
  strasse,
  hausnummer,
}: LocationQuery): Promise<LocationDetails[]> {
  const q = [plz, ort, strasse, hausnummer].filter(Boolean).join(" ");
  return fetchJson<LocationDetails[]>(`${PVOG_SUCHDIENST_API_URL}/v3/locations`, {
    params: { q, distinctBy: "ars", limit: 25 },
  });
}
