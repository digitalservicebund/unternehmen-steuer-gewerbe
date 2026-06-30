import { fetchJson } from "../../helpers/fetchJson";

interface V3Location {
  ars: string;
  plz?: string;
  strasse?: string;
}

export interface PvogLocation {
  ars: string;
  ags: string;
}

// AGS: Bundesland (2 Stellen), Regierungsbezirk (1 Stelle), Kreis (2 Stellen) und Gemeinde (3 Stellen)
// => https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/Glossar/amtlicher-gemeindeschluessel.html
//
// ARS: Bundesland (2 Stellen), Regierungsbezirk (1 Stelle), Kreis (2 Stellen), Gemeindeverband (4 Stellen) und Gemeinde (3 Stellen).
// => https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/Glossar/regionalschluessel.html
//
// The ARS (12 digits) embeds the AGS (8 digits)
// ARS digits 1-5 (state + Regierungsbezirk + Kreis) map to AGS 1-5, ARS digits 10-12 (Gemeinde) to AGS 6-8.
function deriveAgsFromArs(ars: string): string {
  return ars.slice(0, 5) + ars.slice(9);
}

function normalize(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Resolves a PLZ (optionally narrowed by street and house number) to the matching municipalities, returning
 * their ARS and derived AGS. A single PLZ can span several municipalities, so the result is a list. Uses
 * the v3 locations endpoint, which is street/house-number aware. V3 does not return the AGS, so it is
 * derived from the ARS.
 */
export async function getLocations(
  plz: string,
  strasse?: string,
  hausnummer?: string,
): Promise<PvogLocation[]> {
  const q = [plz, strasse, hausnummer].filter(Boolean).join(" ");
  const data = await fetchJson<V3Location[]>("https://pvog.fitko.net/suchdienst/api/v3/locations", {
    params: { q },
  });

  // The v3 search is fuzzy and can return neighbouring PLZ, so keep only items matching the searched
  // PLZ (items without a plz field are kept to avoid over-filtering sparse responses).
  const plzMatches = data.filter((item) => item.plz === undefined || item.plz === plz);

  // When a street is given, narrow to items whose street matches; fall back to the PLZ matches if
  // none match (best-effort — a typo should still yield the municipality's offices).
  let candidates = plzMatches;
  if (strasse !== undefined) {
    const normalizedStrasse = normalize(strasse);
    const streetMatches = plzMatches.filter(
      (item) => item.strasse !== undefined && normalize(item.strasse).includes(normalizedStrasse),
    );
    if (streetMatches.length > 0) {
      candidates = streetMatches;
    }
  }

  // Drop anything that isn't a valid 12-digit ARS
  const arsList = new Set<string>();
  for (const item of candidates) {
    if (item.ars.length === 12) {
      arsList.add(item.ars);
    }
  }

  return [...arsList].map((ars) => ({ ars, ags: deriveAgsFromArs(ars) }));
}
