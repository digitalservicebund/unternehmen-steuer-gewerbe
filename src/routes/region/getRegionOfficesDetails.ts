import {
  getFinanzamtDetailsById,
  getFinanzamtId,
} from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import { getGewerbeamt, getLocationsDetails, type LocationDetails } from "../../clients/pvogClient";
import {
  createOfficeDetailsFromFinanzamt,
  createOfficeDetailsFromGewerbeamt,
  type OfficeDetails,
} from "../../helpers/createOfficeDetails";

interface RegionOfficesDetails {
  finanzaemter: OfficeDetails[];
  gewerbeaemter: OfficeDetails[];
}

function getFinanzaemter(plz: string, strasse?: string, hausnummer?: string): OfficeDetails[] {
  try {
    const finanzamtIds = getFinanzamtId({
      postleitzahl: plz,
      strassenName: strasse,
      hausnummerVon: hausnummer,
    });

    return finanzamtIds
      .map((id) => getFinanzamtDetailsById(id))
      .filter((details) => details !== undefined)
      .map(createOfficeDetailsFromFinanzamt);
  } catch (error) {
    console.error("Finanzamt lookup failed", error);
    return [];
  }
}

async function getGewerbeaemter(
  plz: string,
  strasse?: string,
  hausnummer?: string,
): Promise<OfficeDetails[]> {
  let locations: LocationDetails[];
  try {
    locations = await getLocationsDetails(plz, strasse, hausnummer);
  } catch (error) {
    console.error("Location lookup failed", error);
    return [];
  }

  // A PLZ can return several entries per municipality, so we need to deduplicate
  // the results by ARS to look up each Gewerbeamt only once
  const arsList = [...new Set(locations.map((location) => location.ars))];

  const gewerbeaemter: OfficeDetails[] = [];

  for (const ars of arsList) {
    try {
      const gewerbeamt = await getGewerbeamt(ars);
      gewerbeaemter.push(createOfficeDetailsFromGewerbeamt(gewerbeamt));
    } catch (error) {
      console.error(`Gewerbeamt lookup failed for ARS ${ars}`, error);
    }
  }

  return gewerbeaemter;
}

/**
 * Get the responsible Finanzämter and Gewerbeämter for a given PLZ, street and house number.
 * Best-effort: a failing upstream lookup results in an empty array
 */
export async function getRegionOfficesDetails(
  plz: string,
  strasse?: string,
  hausnummer?: string,
): Promise<RegionOfficesDetails> {
  const finanzaemter = getFinanzaemter(plz, strasse, hausnummer);
  const gewerbeaemter = await getGewerbeaemter(plz, strasse, hausnummer);
  return { finanzaemter, gewerbeaemter };
}
