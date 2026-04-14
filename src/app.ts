import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

import { Hono } from "hono";
// import helmet from "helmet";
import FitConnectClient from "./fitConnectClient";
import type { Environment } from "./fitConnectClient/environments";
import { getSecret } from "./secrets";

const app = new OpenAPIHono();
// app.use(helmet.hidePoweredBy());
// app.use(express.json());

const fitConnectClient = new FitConnectClient({
  environment: (getSecret("FIT_CONNECT_ENV") || "test") as Environment,
  clientId: getSecret("FIT_CONNECT_CLIENT_ID"),
  clientSecret: getSecret("FIT_CONNECT_CLIENT_SECRET"),
  privateKey: getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK")
    ? JSON.parse(getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK"))
    : undefined,
});

const HealthCheckResponseSchema = z.object({
  status: z.string().openapi({ example: "ok" }),
  fitConnectEnvironment: z.string().optional().openapi({
    example: "testing",
    description: "Only returned if verbose is true",
  }),
});

const HealthCheckQuerySchema = z.object({
  verbose: z
    .string()
    .optional()
    .openapi({
      param: { name: "verbose", in: "query" },
      example: "true",
    }),
});

const healthCheckRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: HealthCheckQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: HealthCheckResponseSchema,
        },
      },
      description: "Health check",
    },
  },
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

app.post("/api/v1/register-steuernummer", (c) => {
  return c.json({});
});

app.post("/api/v1/register-gewerbe", async (c) => {
  try {
    const data = await c.req.json();
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
    return c.json(fitConnectResponse);
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
