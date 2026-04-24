import { createRoute } from "@hono/zod-openapi";
import { SupportedRegionParamsSchema, SupportedRegionResponseSchema } from "./regionInterfaces";

export const regionRoute = createRoute({
  method: "get",
  path: "/api/v1/region/{plz}",
  request: {
    params: SupportedRegionParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SupportedRegionResponseSchema,
        },
      },
      description: "Lookup successful (may still be unsupported by Schneller Gründen)",
    },
    400: {
      description: "Invalid PLZ format — must be a 5-digit number",
    },
  },
  tags: ["Active Development"],
  summary: "Get information on whether a region with the given PLZ is currently supported",
});
