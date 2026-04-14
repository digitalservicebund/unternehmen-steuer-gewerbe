import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import { swaggerUI } from "@hono/swagger-ui";

import { getEventsRoute } from "./endpoints/getEventsRoute";
import { addHealthCheckEndpoint } from "./endpoints/rootHealthCheckEndpoint";
import { addRegisterSteuernummerEndpoint } from "./endpoints/registerSteuernummerEndpoint";
import { addRegisterGewerbeEndpoint } from "./endpoints/registerGewerbeEndpoint";
import { getFitConnectClient } from "./clients/fitconnectClient";

const app: OpenAPIHono<Env> = new OpenAPIHono();

export type HonoAppType = typeof app;

// add routes/endpoints
addHealthCheckEndpoint(app);
addRegisterSteuernummerEndpoint(app);
addRegisterGewerbeEndpoint(app);

app.openapi(getEventsRoute, async (c) => {
  try {
    // submissionId is automatically extracted and validated as a string/uuid
    const { submissionId } = c.req.valid("param");

    const fitConnectClient = getFitConnectClient();
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
