import { createRoute, z } from "@hono/zod-openapi";

const HealthCheckResponseSchema = z.object({
  status: z.string().openapi({ example: "ok" }),
  fitConnectEnvironment: z.string().optional().openapi({
    example: "testing",
    description: "Only returned if verbose is true",
  }),
});

const HealthCheckQuerySchema = z.object({
  verbose: z
    .string()
    .optional()
    .openapi({
      param: { name: "verbose", in: "query" },
      example: "true",
    }),
});

export const healthCheckRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: HealthCheckQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: HealthCheckResponseSchema,
        },
      },
      description: "Health check",
    },
  },
});
