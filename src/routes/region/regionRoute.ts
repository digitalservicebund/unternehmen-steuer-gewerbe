import { createRoute, z } from "@hono/zod-openapi";

const SupportedRegionParamsSchema = z.object({
  plz: z
    .string()
    .regex(/^[0-9]{5}$/, "plz must be a 5-digit number")
    .openapi({
      param: { name: "plz", in: "path" },
      example: "10969",
    }),
});

const SupportedRegionResponseSchema = z
  .object({ supported: z.boolean() })
  .openapi("SupportedRegionResponse");

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
      description: "Check whether a given PLZ is currently supported",
    },
    400: {
      description: "Invalid PLZ format — must be a 5-digit number",
    },
  },
  tags: ["Active Development"],
  summary: "Check whether a given PLZ is currently supported",
});
