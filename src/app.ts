import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import { swaggerUI } from "@hono/swagger-ui";

import { getEventsRoute } from "./endpoints/getEventsRoute";
import { addHealthCheckEndpoint } from "./endpoints/rootHealthCheckEndpoint";
import { addRegisterSteuernummerEndpoint } from "./endpoints/registerSteuernummerEndpoint";
import { addRegisterGewerbeEndpoint } from "./endpoints/registerGewerbeEndpoint";
import { getFitConnectClient } from "./clients/fitconnectClient";
import { addGetEventsEndpoint } from "./endpoints/getEventsEndpoint";

const app: OpenAPIHono<Env> = new OpenAPIHono();

export type HonoAppType = typeof app;

// add routes/endpoints
addHealthCheckEndpoint(app);
addRegisterSteuernummerEndpoint(app);
addRegisterGewerbeEndpoint(app);
addGetEventsEndpoint(app);

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
