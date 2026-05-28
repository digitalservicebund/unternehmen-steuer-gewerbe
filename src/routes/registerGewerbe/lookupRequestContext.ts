import { getAGSandARS } from "../../clients/pvogClient/pvogClient";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import { type RegisterGewerbeRequest } from "./registerGewerbeInterfaces";

const GEWERBEANMELDUNG_LEIKA_KEY = "99050012104000";

interface FitConnectDestinationInformation {
  destinationId: string;
}

export interface RegisterGewerbeContext {
  ags: string;
  ars: string;
  /** FIT-Connect destination info. null if FIT-Connect is not supported */
  fitConnect: FitConnectDestinationInformation | null;
}

export async function lookupRequestContext(
  data: RegisterGewerbeRequest,
): Promise<RegisterGewerbeContext> {
  const postleitzahl =
    data.unternehmensDaten.adresseAbweichend?.postleitzahl ??
    data.persönlicheDaten.adresse.postleitzahl;

  const { ags, ars } = await getAGSandARS(postleitzahl);

  let fitConnect = null;

  if (isSupportingFitConnect(postleitzahl)) {
    const fitConnectClient = getFitConnectClient();
    const res = await fitConnectClient.getRoutes(GEWERBEANMELDUNG_LEIKA_KEY, ags);

    if (res.routes.length === 0) {
      throw new Error(`No FIT-Connect destination found for AGS ${ags}`);
    }

    // TODO: double-check response as soon as we have communes that support FIT-Connect
    fitConnect = { destinationId: res.routes[0]!.destinationId };
  }

  return {
    ags,
    ars,
    fitConnect,
  };
}

function isSupportingFitConnect(postleitzahl: string) {
  const communesWithFitConnect = ["00000"]; // currently no commune is supporting FIT-Connect
  return communesWithFitConnect.includes(postleitzahl);
}
