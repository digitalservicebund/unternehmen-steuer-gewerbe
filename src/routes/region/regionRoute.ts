import { createRoute, z } from "@hono/zod-openapi";
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
      description: "Check whether a region with the given PLZ is currently supported",
    },
    400: {
      description: "Invalid PLZ format — must be a 5-digit number",
    },
  },
  tags: ["Active Development"],
  summary: "Check whether a region with the given PLZ is currently supported",
});
