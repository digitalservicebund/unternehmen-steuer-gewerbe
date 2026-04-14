import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import { swaggerUI } from "@hono/swagger-ui";

import FitConnectClient from "./fitConnectClient";
import type { Environment } from "./fitConnectClient/environments";
import { getSecret } from "./secrets";
import { registerGewerbeRoute } from "./endpoints/registerGewerbeRoute";
import { getEventsRoute } from "./endpoints/getEventsRoute";
import { addHealthCheckEndpoint } from "./endpoints/rootHealthCheckEndpoint";
import { addRegisterSteuernummerEndpoint } from "./endpoints/registerSteuernummerEndpoint";

const app: OpenAPIHono<Env> = new OpenAPIHono();

export type HonoAppType = typeof app;

const fitConnectClient = new FitConnectClient({
  environment: (getSecret("FIT_CONNECT_ENV") || "test") as Environment,
  clientId: getSecret("FIT_CONNECT_CLIENT_ID"),
  clientSecret: getSecret("FIT_CONNECT_CLIENT_SECRET"),
  privateKey: getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK")
    ? JSON.parse(getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK"))
    : undefined,
});

addHealthCheckEndpoint(app);

addRegisterSteuernummerEndpoint(app);

app.openapi(registerGewerbeRoute, async (c) => {
  try {
    // With OpenAPIHono, the body is already validated against your schema
    const data = c.req.valid("json");

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

app.openapi(getEventsRoute, async (c) => {
  try {
    // submissionId is automatically extracted and validated as a string/uuid
    const { submissionId } = c.req.valid("param");

    const submissionEvents = await fitConnectClient.getSubmissionEvents(submissionId);

    if (!submissionEvents) {
      return c.json({ message: "Not Found" }, 404);
    }

    return c.json(submissionEvents, 200);
  } catch (error) {
    console.error("FIT-Connect Event Fetch Error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// OpenAPI Documentation
// 1) Serve the JSON file
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});
// 2) Serve the Swagger UI
app.get("/ui", swaggerUI({ url: "/doc" }));

export default app;
