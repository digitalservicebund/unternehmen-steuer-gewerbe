import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";

import { addHealthCheckEndpoint } from "./routes/rootHealthCheck/rootHealthCheck";
import { addRegionEndpoint } from "./routes/region/region";
import { addRegisterSteuernummerEndpoint } from "./routes/registerSteuernummer/registerSteuernummer";
import { addRegisterGewerbeEndpoint } from "./routes/registerGewerbe/registerGewerbe";
import { addGetEventsEndpoint } from "./routes/getEvents/getEvents";
import { addOpenApiEndpoints } from "./routes/openApiDocs/openApi";
import { addRequestLogging } from "./routes/logging/requestLogging";

const app: OpenAPIHono<Env> = new OpenAPIHono();

export type HonoAppType = typeof app;

// add simple logging in JSON format
addRequestLogging(app);

// add business routes/endpoints
addRegionEndpoint(app);
addRegisterGewerbeEndpoint(app);
addHealthCheckEndpoint(app);
addRegisterSteuernummerEndpoint(app);
addGetEventsEndpoint(app);

// add documentation endpoints
addOpenApiEndpoints(app);

export default app;
