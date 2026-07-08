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

interface RegionOfficesDetails {
  finanzaemter: OfficeDetails[];
  gewerbeaemter: OfficeDetails[];
}

function getFinanzaemterOfficeDetails(locationQuery: LocationQuery): OfficeDetails[] {
  try {
    const finanzamtIds = getFinanzamtId({
      postleitzahl: locationQuery.plz,
      ort: locationQuery.ort,
      strassenName: locationQuery.strasse,
      hausnummerVon: locationQuery.hausnummer,
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

async function getGewerbeaemterOfficeDetails(
  locationQuery: LocationQuery,
): Promise<OfficeDetails[]> {
  let locations: LocationDetails[];
  try {
    locations = await getLocationsDetails(locationQuery);
  } catch (error) {
    console.error("Location lookup failed", error);
    return [];
  }

  const gewerbeaemter: OfficeDetails[] = [];

  // getLocationsDetails returns one entry per municipality (ARS), so each Gewerbeamt is looked up only once
  for (const { ars } of locations) {
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
 * Get the responsible Finanzämter and Gewerbeämter for a given PLZ, ort, street and house number.
 * Best-effort: a failing upstream lookup results in an empty array
 */
export async function getRegionOfficesDetails(
  locationQuery: LocationQuery,
): Promise<RegionOfficesDetails> {
  const finanzaemter = getFinanzaemterOfficeDetails(locationQuery);
  const gewerbeaemter = await getGewerbeaemterOfficeDetails(locationQuery);
  return { finanzaemter, gewerbeaemter };
}
