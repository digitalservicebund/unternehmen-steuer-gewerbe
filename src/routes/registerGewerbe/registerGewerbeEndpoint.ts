import { HonoAppType } from "../../app";
import { getFitConnectClient } from "../../clients/fitConnectClient/fitConnectClient";
import { getSecret } from "../../secrets";
import { createGewerbeanmeldungXml } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { registerGewerbeRoute } from "./registerGewerbeRoute";
import { transformToGewerbeanmeldung } from "./transformToGewerbeanmeldung";

export function addRegisterGewerbeEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(registerGewerbeRoute, async (c) => {
    try {
      // With OpenAPIHono, the body is already validated against your schema
      const data = c.req.valid("json");

      const gewerbeanmeldung = transformToGewerbeanmeldung(data);
      const gewerbeanmeldungXml = await createGewerbeanmeldungXml(gewerbeanmeldung);

      const fitConnectClient = getFitConnectClient();

      const fitConnectResponse = await fitConnectClient.submitData({
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

      return c.json(
        {
          success: true,
          submissionId: fitConnectResponse.submissionId,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json(
        {
          success: false,
          info: "Internal Server Error",
        },
        500,
      );
    }
  });

  return app;
}
