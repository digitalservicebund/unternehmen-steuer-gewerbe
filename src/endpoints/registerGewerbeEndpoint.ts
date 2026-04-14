import { HonoAppType } from "../app";
import { getFitConnectClient } from "../clients/fitConnectClient/fitConnectClient";
import { registerGewerbeRoute } from "./registerGewerbeRoute";

export function addRegisterGewerbeEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(registerGewerbeRoute, async (c) => {
    try {
      // With OpenAPIHono, the body is already validated against your schema
      const data = c.req.valid("json");

      const fitConnectClient = getFitConnectClient();

      const fitConnectResponse = await fitConnectClient.submitData({
        // The destination varies from commune to commune.
        // We can hard‑code it here for the demo, but in the future we need to
        // use the Fit‑Connect routing API to determine the destination ID.
        destinationId: "dbc4efa5-58e7-4527-8898-00d58450c68e",
        publicService: {
          identifier: "urn:de:fim:leika:leistung:99050012104000",
          name: "Gewerbe Anmeldung",
        },
        dataSchema: {
          schemaUri: "https://schema.fitko.de/demo/muster-fachdaten.schema.json",
          mimeType: "application/json",
        },
        data: JSON.stringify(data),
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
      return c.text("Internal Server Error", 500);
    }
  });

  return app;
}
