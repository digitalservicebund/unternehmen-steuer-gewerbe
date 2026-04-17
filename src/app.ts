import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";
import { logger } from "hono/logger";
import { getConnInfo } from "@hono/node-server/conninfo";

import { addHealthCheckEndpoint } from "./routes/rootHealthCheck/rootHealthCheck";
import { addRegisterSteuernummerEndpoint } from "./routes/registerSteuernummer/registerSteuernummer";
import { addRegisterGewerbeEndpoint } from "./routes/registerGewerbe/registerGewerbe";
import { addGetEventsEndpoint } from "./routes/getEvents/getEvents";
import { addOpenApiEndpoints } from "./routes/openApiDocs/openApi";

const app: OpenAPIHono<Env> = new OpenAPIHono();

export type HonoAppType = typeof app;

// add basic JSON logging
app.use("*", async (c, next) => {
  const start = Date.now();

  // Wait for the actual request to process
  await next();

  // Now we have the response details and the Context 'c'
  const ms = Date.now() - start;
  const now = new Date().toISOString();

  // Get IP
  const info = getConnInfo(c);
  const ip = c.req.header("x-forwarded-for")?.split(",")[0] || info.remote.address; // handle forwanding in kubernetes

  const requestResponseData = {
    isoDatetime: now,
    requestIP: ip,
    requestMethod: c.req.method,
    requestPath: c.req.path,
    responseStatus: c.res.status,
    responseTimeMs: ms,
  };

  console.log(JSON.stringify(requestResponseData));
});

// add business routes/endpoints
addRegisterGewerbeEndpoint(app);
addHealthCheckEndpoint(app);
addRegisterSteuernummerEndpoint(app);
addGetEventsEndpoint(app);

// add documentation endpoints
addOpenApiEndpoints(app);

export default app;
