import { getGewerbeamt, getLocationsDetails, type Gewerbeamt } from "../../clients/pvogClient";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import { splitStrasseHausnummer } from "../../helpers/formFieldTransformations";
import { getAGS } from "../../helpers/getAgs";
import { getFirstAssumingItsTheBestMatch } from "../../helpers/getFirstAssumingItsTheBestMatch";
import { getEnvironmentVariable } from "../../secretsAndEnvironmentVariables";
import { type RegisterGewerbeRequest } from "./registerGewerbeInterfaces";

const GEWERBEANMELDUNG_LEIKA_KEY = "99050012104000";

interface FitConnectDestinationInformation {
  destinationId: string;
}

export interface GewerbeRoutingInfo {
  ags: string;
  ars: string;
  gewerbeamt: Gewerbeamt;
  /** FIT-Connect destination info. null means the Gewerbeanmeldung has to be sent via OSCI */
  fitConnectDestinationInformation: FitConnectDestinationInformation | null;
}

async function getFitConnectDestinationInformation(
  ars: string,
): Promise<FitConnectDestinationInformation | null> {
  // Test override: a configured destination forces FIT-Connect regardless of the routing result
  const configuredDestinationId = getEnvironmentVariable(
    "TEST_FIT_CONNECT_DESTINATION_ID_OVERRIDE",
  );
  if (configuredDestinationId) {
    return { destinationId: configuredDestinationId };
  }

  const fitConnectClient = getFitConnectClient();
  const res = await fitConnectClient.getRoutes(GEWERBEANMELDUNG_LEIKA_KEY, ars);

  if (res.routes.length === 0) {
    return null;
  }

  // TODO: double-check response as soon as we have communes that support FIT-Connect
  return { destinationId: res.routes[0]!.destinationId };
}

export async function getGewerbeRoutingInfo(
  data: RegisterGewerbeRequest,
): Promise<GewerbeRoutingInfo | undefined> {
  const address = data.unternehmensDaten.adresseAbweichend ?? data.persönlicheDaten.adresse;
  const { strasse, hausnummer } = splitStrasseHausnummer(address.strasseUndHausnummer);

  const locations = await getLocationsDetails({
    plz: address.postleitzahl,
    ort: address.ort,
    strasse,
    hausnummer,
  });
  const bestMatchingLocation = getFirstAssumingItsTheBestMatch(locations);
  if (bestMatchingLocation === undefined) {
    return undefined;
  }
  const { ars: resolvedArs } = bestMatchingLocation;

  const gewerbeamt = await getGewerbeamt(resolvedArs);
  if (!gewerbeamt) {
    return undefined;
  }

  const fitConnectDestinationInformation = await getFitConnectDestinationInformation(resolvedArs);

  // Test override: submit for a fixed ARS (e.g. the registered AKDB test authority) instead of the
  // one resolved from the address. Gewerbeamt and FIT-Connect routing still use the resolved ARS.
  const arsOverride = getEnvironmentVariable("TEST_OSCI_ARS_OVERRIDE");
  const ars = arsOverride || resolvedArs;
  const ags = getAGS(ars);

  return {
    ags,
    ars,
    gewerbeamt,
    fitConnectDestinationInformation,
  };
}
