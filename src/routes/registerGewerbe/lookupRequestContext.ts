import { getAGSandARS } from "../../clients/pvogClient/pvogClient";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import { type RegisterGewerbeRequest } from "./registerGewerbeInterfaces";

const GEWERBEANMELDUNG_LEIKA_KEY = "99050012104000";

export interface RegisterGewerbeContext {
  ags: string;
  destinationId: string;
}

export async function lookupRequestContext(
  data: RegisterGewerbeRequest,
): Promise<RegisterGewerbeContext> {
  const postleitzahl =
    data.unternehmensDaten.adresseAbweichend?.postleitzahl ??
    data.persönlicheDaten.adresse.postleitzahl;

  const { ags } = await getAGSandARS(postleitzahl);

  const fitConnectClient = getFitConnectClient();
  const { routes } = await fitConnectClient.getRoutes(GEWERBEANMELDUNG_LEIKA_KEY, ags);

  if (routes.length === 0) {
    throw new Error(`No FIT-Connect destination found for AGS ${ags}`);
  }

  return { ags, destinationId: routes[0]!.destinationId };
}
