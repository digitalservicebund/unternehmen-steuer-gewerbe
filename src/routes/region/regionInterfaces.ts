import { z } from "@hono/zod-openapi";

export const SupportedRegionParamsSchema = z.object({
  plz: z
    .string()
    .regex(/^\d{5}$/, "plz must be a 5-digit number")
    .openapi({
      param: { name: "plz", in: "path" },
      example: "10969",
      type: "number",
    }),
});

export const SupportedRegionResponseSchema = z
  .object({ supported: z.boolean() })
  .openapi("SupportedRegionResponse");
