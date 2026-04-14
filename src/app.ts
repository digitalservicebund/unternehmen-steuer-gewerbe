import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";

import { addHealthCheckEndpoint } from "./routes/rootHealthCheck/rootHealthCheckEndpoint";
import { addRegisterSteuernummerEndpoint } from "./routes/registerSteuernummer/registerSteuernummerEndpoint";
import { addRegisterGewerbeEndpoint } from "./routes/registerGewerbe/registerGewerbeEndpoint";
import { addGetEventsEndpoint } from "./routes/getEvents/getEventsEndpoint";
import { addOpenApiEndpoints } from "./routes/openApiDocs/openApiEndpoints";

const app: OpenAPIHono<Env> = new OpenAPIHono();

export type HonoAppType = typeof app;

// add business routes/endpoints
addHealthCheckEndpoint(app);
addRegisterSteuernummerEndpoint(app);
addRegisterGewerbeEndpoint(app);
addGetEventsEndpoint(app);

// add documentation endpoints
addOpenApiEndpoints(app);

export default app;
