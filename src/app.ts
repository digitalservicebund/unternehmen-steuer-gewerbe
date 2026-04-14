import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";

import { addHealthCheckEndpoint } from "./endpoints/rootHealthCheckEndpoint";
import { addRegisterSteuernummerEndpoint } from "./endpoints/registerSteuernummerEndpoint";
import { addRegisterGewerbeEndpoint } from "./endpoints/registerGewerbeEndpoint";
import { addGetEventsEndpoint } from "./endpoints/getEventsEndpoint";
import { addOpenApiEndpoints } from "./endpoints/openApiEndpoints";

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
