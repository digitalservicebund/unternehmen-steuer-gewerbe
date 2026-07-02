import {
  getFinanzamtDetailsById,
  getFinanzamtId,
} from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import { getGewerbeamt, getLocationsDetails } from "../../clients/pvogClient";
import { joinStrasseUndHausnummer } from "../../helpers/formFieldTransformations";
import { type OfficeDetails } from "./regionInterfaces";

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

    const finanzaemter = finanzamtIds
      .map((id) => {
        const details = getFinanzamtDetailsById(id);

        if (details === undefined) {
          return undefined;
        }

        const hausanschrift = details.hausanschrift;

        return {
          name: details.name,
          strasseUndHausnummer: joinStrasseUndHausnummer(
            hausanschrift?.strasse,
            hausanschrift?.hausnummer,
          ),
          postleitzahl: hausanschrift?.postleitzahl,
          ort: hausanschrift?.ort,
          telefon: details.telefonnummer,
        };
      })
      .filter((finanzamt) => finanzamt !== undefined);

    return finanzaemter;
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
  try {
    const locations = await getLocationsDetails(plz, strasse, hausnummer);

    // A PLZ can return several entries per municipality, so we need to deduplicate
    // the results by ARS to look up each Gewerbeamt only once
    const arsList = [...new Set(locations.map((location) => location.ars))];

    const gewerbeaemter: OfficeDetails[] = [];

    for (const ars of arsList) {
      try {
        const gewerbeamt = await getGewerbeamt(ars);
        const adresse = gewerbeamt.adresse;

        gewerbeaemter.push({
          name: gewerbeamt.name,
          strasseUndHausnummer: joinStrasseUndHausnummer(adresse?.strasse, adresse?.hausnummer),
          postleitzahl: adresse?.postleitzahl,
          ort: adresse?.ort,
          telefon: gewerbeamt.telefon,
          email: gewerbeamt.email,
          onlineServices: gewerbeamt.onlineServiceLinks,
        });
      } catch (error) {
        console.error(`Gewerbeamt lookup failed for ARS ${ars}`, error);
      }
    }

    return gewerbeaemter;
  } catch (error) {
    console.error("Gewerbeamt lookup failed", error);
    return [];
  }
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
