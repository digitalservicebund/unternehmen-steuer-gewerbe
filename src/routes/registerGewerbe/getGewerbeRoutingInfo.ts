import { getAGSandARS } from "../../clients/pvogClient";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import { type RegisterGewerbeRequest } from "./registerGewerbeInterfaces";

const GEWERBEANMELDUNG_LEIKA_KEY = "99050012104000";

interface FitConnectDestinationInformation {
  destinationId: string;
}

export interface GewerbeRoutingInfo {
  ags: string;
  ars: string;
  /** FIT-Connect destination info. null if FIT-Connect is not supported */
  fitConnectDestinationInformation: FitConnectDestinationInformation | null;
}

export async function getGewerbeRoutingInfo(
  data: RegisterGewerbeRequest,
): Promise<GewerbeRoutingInfo> {
  const postleitzahl =
    data.unternehmensDaten.adresseAbweichend?.postleitzahl ??
    data.persönlicheDaten.adresse.postleitzahl;

  const { ags, ars } = await getAGSandARS(postleitzahl);

  let fitConnectDestinationInformation = null;

  if (isSupportingFitConnect(postleitzahl)) {
    const fitConnectClient = getFitConnectClient();
    const res = await fitConnectClient.getRoutes(GEWERBEANMELDUNG_LEIKA_KEY, ags);

    if (res.routes.length === 0) {
      throw new Error(`No FIT-Connect destination found for AGS ${ags}`);
    }

    // TODO: double-check response as soon as we have communes that support FIT-Connect
    fitConnectDestinationInformation = { destinationId: res.routes[0]!.destinationId };
  }

  return {
    ags,
    ars,
    fitConnectDestinationInformation,
  };
}

function isSupportingFitConnect(postleitzahl: string) {
  const communesWithFitConnect = ["00000"]; // currently no commune is supporting FIT-Connect; "00000" can be used for testing
  return communesWithFitConnect.includes(postleitzahl);
}
