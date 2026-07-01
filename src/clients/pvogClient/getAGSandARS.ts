import { getLocations } from "./getLocations";

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
function createAgsFromArs(ars: string): string {
  return ars.slice(0, 5) + ars.slice(9);
}

/**
 * Returns the single best (first) match for an address, throwing if none is found.
 * Use getLocations directly when all municipalities a PLZ spans are needed.
 */
export async function getAGSandARS(
  plz: string,
  strasse?: string,
  hausnummer?: string,
): Promise<AGSandARS> {
  const [location] = await getLocations(plz, strasse, hausnummer);
  if (location === undefined) {
    throw new Error(`No location found for zip code ${plz}`);
  }

  const ags = createAgsFromArs(location.ars);
  return { ars: location.ars, ags };
}
