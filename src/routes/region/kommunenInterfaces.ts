import { z } from "@hono/zod-openapi";

export const KommunenResponseSchema = z
  .object({
    kommunen: z.array(z.string()).openapi({
      example: ["Dresden"],
      description: "Names of the Kommunen supported by Schneller Gründen",
    }),
  })
  .openapi("KommunenResponse");
