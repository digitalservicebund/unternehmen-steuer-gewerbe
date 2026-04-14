import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

import FitConnectClient from "./fitConnectClient";
import type { Environment } from "./fitConnectClient/environments";
import { getSecret } from "./secrets";
import { healthCheckRoute } from "./routes/root.health-check";
import { registerSteuernummerRoute } from "./routes/register.steuernummer";
import { registerGewerbeRoute } from "./routes/register.gewerbe";

const app = new OpenAPIHono();

const fitConnectClient = new FitConnectClient({
  environment: (getSecret("FIT_CONNECT_ENV") || "test") as Environment,
  clientId: getSecret("FIT_CONNECT_CLIENT_ID"),
  clientSecret: getSecret("FIT_CONNECT_CLIENT_SECRET"),
  privateKey: getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK")
    ? JSON.parse(getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK"))
    : undefined,
});

app.openapi(healthCheckRoute, (c) => {
  const { verbose } = c.req.valid("query");

  return c.json(
    {
      status: "ok",
      ...(verbose ? { fitConnectEnvironment: getSecret("FIT_CONNECT_ENV") } : {}),
    },
    200,
  );
});

app.openapi(registerSteuernummerRoute, (c) => {
  return c.json({});
});

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

app.get("/api/v1/register-gewerbe/:submissionId/events", async (c) => {
  try {
    const submissionId = c.req.param("submissionId");
    const submissionEvents = await fitConnectClient.getSubmissionEvents(submissionId);
    return c.json(submissionEvents);
  } catch (error) {
    console.error(error);
    c.text("Internal Server Error", 500);
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
