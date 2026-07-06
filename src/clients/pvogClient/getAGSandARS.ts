import { getLocationsDetails } from "./getLocationsDetails";

export interface AGSandARS {
  ars: string;
  ags: string;
}

// AGS: Bundesland (2 Stellen), Regierungsbezirk (1 Stelle), Kreis (2 Stellen) und Gemeinde (3 Stellen)
// => https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/Glossar/amtlicher-gemeindeschluessel.html
//
// ARS: Bundesland (2 Stellen), Regierungsbezirk (1 Stelle), Kreis (2 Stellen), Gemeindeverband (4 Stellen) und Gemeinde (3 Stellen).
// => https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/Glossar/regionalschluessel.html
//
// The ARS (12 digits) embeds the AGS (8 digits): ARS digits 1-5 (state + Regierungsbezirk + Kreis)
// map to AGS 1-5, ARS digits 10-12 (Gemeinde) to AGS 6-8.
function getAgsFromArs(ars: string): string {
  return ars.slice(0, 5) + ars.slice(9);
}

/**
 * Returns the single best (first) match for an address, throwing if none is found.
 * Use getLocationsDetails directly when all municipalities a PLZ spans are needed.
 */
export async function getAGSandARS(
  plz: string,
  strasse?: string,
  hausnummer?: string,
): Promise<AGSandARS> {
  const [firstMatchingLocation] = await getLocationsDetails(plz, strasse, hausnummer);
  if (firstMatchingLocation === undefined) {
    throw new Error(`No location found for zip code ${plz}`);
  }
  if (!/^\d{12}$/.test(firstMatchingLocation.ars)) {
    throw new Error(
      `No valid AGS and ARS found for "${[plz, strasse, hausnummer].filter(Boolean).join(" ")}"`,
    );
  }

  const ags = getAgsFromArs(firstMatchingLocation.ars);
  return { ars: firstMatchingLocation.ars, ags };
}
