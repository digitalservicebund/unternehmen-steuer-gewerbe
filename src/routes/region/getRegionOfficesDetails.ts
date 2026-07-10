import {
  getFinanzamtDetailsById,
  getFinanzamtId,
} from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import {
  getGewerbeamt,
  getLocationsDetails,
  type LocationDetails,
  type LocationQuery,
} from "../../clients/pvogClient";
import {
  createOfficeDetailsFromFinanzamt,
  createOfficeDetailsFromGewerbeamt,
  type OfficeDetails,
} from "../../helpers/createOfficeDetails";
import { getFirstAssumingItsTheBestMatch } from "../../helpers/getFirstAssumingItsTheBestMatch";

interface RegionOfficesDetails {
  finanzaemter: OfficeDetails[];
  gewerbeaemter: OfficeDetails[];
}

function getAllFinanzamtIds(locationQuery: LocationQuery): string[] {
  return getFinanzamtId({
    postleitzahl: locationQuery.plz,
    ort: locationQuery.ort,
    strassenName: locationQuery.strasse,
    hausnummerVon: locationQuery.hausnummer,
  });
}

async function getAllLocations(locationQuery: LocationQuery): Promise<LocationDetails[]> {
  return await getLocationsDetails(locationQuery);
}

function createFinanzaemterOfficeDetails(finanzamtIds: string[]): OfficeDetails[] {
  return finanzamtIds
    .map((id) => getFinanzamtDetailsById(id))
    .filter((details) => details !== undefined)
    .map(createOfficeDetailsFromFinanzamt);
}

async function createGewerbeaemterOfficeDetails(
  locations: LocationDetails[],
): Promise<OfficeDetails[]> {
  const gewerbeaemter: OfficeDetails[] = [];

  // getLocationsDetails returns one entry per municipality (ARS), so each Gewerbeamt is looked up only once
  for (const { ars } of locations) {
    const gewerbeamt = await getGewerbeamt(ars);
    if (gewerbeamt) {
      gewerbeaemter.push(createOfficeDetailsFromGewerbeamt(gewerbeamt));
    }
  }

  return gewerbeaemter;
}

function limitToBestMatch<T>(matches: T[]): T[] {
  const bestMatch = getFirstAssumingItsTheBestMatch(matches);
  return bestMatch === undefined ? [] : [bestMatch];
}

/**
 * Get the responsible Finanzämter and Gewerbeämter for a given PLZ, ort, street and house number.
 * Unless getAllOffices is set, each list contains only the best match — the same office the XML
 * submission would use.
 * Best-effort: a failing upstream lookup results in an empty array
 */
export async function getRegionOfficesDetails(
  locationQuery: LocationQuery,
  getAllOffices: boolean,
): Promise<RegionOfficesDetails> {
  const allFinanzamtIds = getAllFinanzamtIds(locationQuery);
  const allLocations = await getAllLocations(locationQuery);

  const selectedFinanzamtIds = getAllOffices ? allFinanzamtIds : limitToBestMatch(allFinanzamtIds);
  const selectedLocations = getAllOffices ? allLocations : limitToBestMatch(allLocations);

  const finanzaemter = createFinanzaemterOfficeDetails(selectedFinanzamtIds);
  const gewerbeaemter = await createGewerbeaemterOfficeDetails(selectedLocations);
  return { finanzaemter, gewerbeaemter };
}
