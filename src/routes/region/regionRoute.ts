import { createRoute } from "@hono/zod-openapi";
import { RegionParamsSchema, RegionQuerySchema, RegionResponseSchema } from "./regionInterfaces";

export const regionRoute = createRoute({
  method: "get",
  path: "/api/v1/region/{plz}",
  request: {
    params: RegionParamsSchema,
    query: RegionQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: RegionResponseSchema,
        },
      },
      description:
        "Lookup successful (the PLZ may still be unsupported by Schneller Gründen). Returns the " +
        "responsible Finanzämter and Gewerbeämter for the given location; arrays may be empty if " +
        "it was not possible to find a Finanz- and/or Gewerbeamt for the given location.",
    },
    400: {
      description: "Invalid PLZ format — must be a 5-digit number",
    },
  },
  tags: ["Active Development"],
  summary:
    "Get whether a region with the given PLZ is supported, plus the responsible Finanzämter and Gewerbeämter",
});
