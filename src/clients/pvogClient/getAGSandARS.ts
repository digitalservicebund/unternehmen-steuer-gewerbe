import { getLocations, type PvogLocation } from "./getLocations";

export async function getAGSandARS(
  plz: string,
  strasse?: string,
  hausnummer?: string,
): Promise<PvogLocation> {
  const [location] = await getLocations(plz, strasse, hausnummer);
  if (location === undefined) {
    throw new Error(`No location found for zip code ${plz}`);
  }
  return location;
}
