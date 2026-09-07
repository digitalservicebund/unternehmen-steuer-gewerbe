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

interface RegionDetails {
  arsList: string[];
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

// PVOG names a location after its Ortsteil, e.g. "Dresden 'Gruna'", not the Kommune itself, so
// matching the Kommune requires the gemeinde field instead of name.
const GEMEINDE_STADT_DRESDEN = "Stadt Dresden";

function limitGewerbeamtToBestMatch<T>(matches: T[], locationQuery: LocationQuery): T[] {
  // Dresden override:
  // If the query is for some Dresden address and the locations contain an entry for Dresden: return it
  if (locationQuery.ort === "Dresden") {
    const dresdenMatch = matches.find(
      (e) => (e as LocationDetails).gemeinde === GEMEINDE_STADT_DRESDEN,
    );
    if (dresdenMatch) {
      return [dresdenMatch];
    }
  }

  return limitToBestMatch(matches);
}

/**
 * Get the ARS of every Kommune the given PLZ, ort, street and house number resolve to, plus the
 * responsible Finanzämter and Gewerbeämter.
 * Unless getAllOffices is set, each office list contains only the best match — the same office the
 * XML submission would use. `arsList` always contains every resolved Kommune, so that callers can
 * tell an ambiguous address from an unambiguous one.
 * Best-effort: a failing upstream lookup results in an empty array
 */
export async function getRegionDetails(
  locationQuery: LocationQuery,
  getAllOffices: boolean,
): Promise<RegionDetails> {
  const allFinanzamtIds = getAllFinanzamtIds(locationQuery);
  const allGewerbeamtLocations = await getAllLocations(locationQuery);

  const arsListGewerbeamt = allGewerbeamtLocations.map((location) => location.ars);

  const selectedFinanzamtIds = getAllOffices ? allFinanzamtIds : limitToBestMatch(allFinanzamtIds);
  const selectedLocationsGewerbeamt = getAllOffices
    ? allGewerbeamtLocations
    : limitGewerbeamtToBestMatch(allGewerbeamtLocations, locationQuery); // incl. Dresden override

  const finanzaemter = createFinanzaemterOfficeDetails(selectedFinanzamtIds);
  const gewerbeaemter = await createGewerbeaemterOfficeDetails(selectedLocationsGewerbeamt);

  // City of Dresden override
  if (locationQuery.ort === "Dresden") {
    const arsListGewerbeamtDresden = allGewerbeamtLocations
      .filter((location) => location.gemeinde === GEMEINDE_STADT_DRESDEN)
      .map((location) => location.ars);
    // none of the matches may belong to the city of Dresden, in which case we fall back to the default result
    if (arsListGewerbeamtDresden.length > 0)
      return { arsList: arsListGewerbeamtDresden, finanzaemter, gewerbeaemter };
  }

  return { arsList: arsListGewerbeamt, finanzaemter, gewerbeaemter };
}
