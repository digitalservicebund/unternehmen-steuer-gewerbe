import { HonoAppType } from "../../app";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import { validateFsE } from "../../private/eric/eric";
import { createElsterFsEEUnXml } from "../../private/xmlBuilders/elsterFsE/elsterFsEEUn";
import { getSecret } from "../../secrets";
import { createGewerbeanmeldungXml } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { RegisterGewerbeRequest } from "./registerGewerbeInterfaces";
import { registerGewerbeRoute } from "./registerGewerbeRoute";
import { transformToEUnFsE } from "./transformToFsE";
import { transformToGewerbeanmeldung } from "./transformToGewerbeanmeldung";

async function submitGewerbeanmeldung(data: RegisterGewerbeRequest) {
  const gewerbeanmeldung = transformToGewerbeanmeldung(data);
  const gewerbeanmeldungXml = await createGewerbeanmeldungXml(gewerbeanmeldung);

  const fitConnectClient = getFitConnectClient();

  return fitConnectClient.submitData({
    // The destination varies from commune to commune.
    // We can hard‑code it here for the first iterations, but in the future we need to
    // use the Fit‑Connect routing API to determine the destination ID.
    destinationId: getSecret("FIT_CONNECT_DESTINATION_ID"),
    publicService: {
      identifier: "urn:de:fim:leika:leistung:99050012104000",
      name: "Gewerbe Anmeldung",
    },
    dataSchema: {
      schemaUri: "urn:xoev-de:kosit:standard:xgewerbeordnung",
      mimeType: "application/xml",
    },
    data: gewerbeanmeldungXml,
  });
}

async function submitFsE(data: RegisterGewerbeRequest) {
  const elsterEUnFsE = transformToEUnFsE(data);
  const elsterEUnFsEXml = await createElsterFsEEUnXml(elsterEUnFsE);
  const valid = validateFsE(elsterEUnFsEXml);

  return valid;
}

export function addRegisterGewerbeEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(registerGewerbeRoute, async (c) => {
    try {
      // With OpenAPIHono, the body is already validated against your schema
      const data = c.req.valid("json");

      const fitConnectResponse = await submitGewerbeanmeldung(data);
      const elsterResponse = await submitFsE(data);

      return c.json(
        {
          gewerbeanmeldung: {
            success: true,
            submissionId: fitConnectResponse.submissionId,
          },
          steuernummer: {
            success: elsterResponse.isValid, // replace this as soon as we really send the data
            submissionId: "00000000-0000-0000-0000-000000000000", // // replace this as soon as we really send the data
          },
        },
        200,
      );
    } catch (error) {
      console.error(error);
      // TODO we should distinguish between the steuernummer and gewerbeanmeldung errors
      return c.json(
        {
          gewerbeanmeldung: {
            success: false,
            info: "Internal Server Error",
          },
          steuernummer: {
            success: false, // replace this as soon as we really send the data
            info: "Internal Server Error",
          },
        },
        500,
      );
    }
  });

  return app;
}
