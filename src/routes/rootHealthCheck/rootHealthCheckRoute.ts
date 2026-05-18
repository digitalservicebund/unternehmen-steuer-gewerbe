import { createRoute, z } from "@hono/zod-openapi";

const HealthCheckResponseSchema = z.object({
  status: z.string().openapi({ example: "ok" }),
  gitCommitSHA: z.string().optional().openapi({
    example: "a1b2c3d",
    description: "Git commit SHA the app was built from",
  }),
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
  tags: ["Experimental"],
  summary: "Experimental implementation",
});
