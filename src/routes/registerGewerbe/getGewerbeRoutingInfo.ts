import { getGewerbeamt, getLocationsDetails, type Gewerbeamt } from "../../clients/pvogClient";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import { splitStrasseHausnummer } from "../../helpers/formFieldTransformations";
import { getAGS } from "../../helpers/getAgs";
import { getFirstAssumingItsTheBestMatch } from "../../helpers/getFirstAssumingItsTheBestMatch";
import { type RegisterGewerbeRequest } from "./registerGewerbeInterfaces";

const GEWERBEANMELDUNG_LEIKA_KEY = "99050012104000";

interface FitConnectDestinationInformation {
  destinationId: string;
}

export interface GewerbeRoutingInfo {
  ags: string;
  ars: string;
  gewerbeamt: Gewerbeamt;
  /** FIT-Connect destination info. null if FIT-Connect is not supported */
  fitConnectDestinationInformation: FitConnectDestinationInformation | null;
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
  const { ars } = bestMatchingLocation;
  const ags = getAGS(ars);

  const gewerbeamt = await getGewerbeamt(ars);
  if (!gewerbeamt) {
    return undefined;
  }

  let fitConnectDestinationInformation = null;

  if (isSupportingFitConnect(address.postleitzahl)) {
    const fitConnectClient = getFitConnectClient();
    const res = await fitConnectClient.getRoutes(GEWERBEANMELDUNG_LEIKA_KEY, ags);

    if (res.routes.length === 0) {
      return undefined;
    }

    // TODO: double-check response as soon as we have communes that support FIT-Connect
    fitConnectDestinationInformation = { destinationId: res.routes[0]!.destinationId };
  }

  return {
    ags,
    ars,
    gewerbeamt,
    fitConnectDestinationInformation,
  };
}

function isSupportingFitConnect(postleitzahl: string) {
  const communesWithFitConnect = ["00000"]; // currently no commune is supporting FIT-Connect; "00000" can be used for testing
  return communesWithFitConnect.includes(postleitzahl);
}
