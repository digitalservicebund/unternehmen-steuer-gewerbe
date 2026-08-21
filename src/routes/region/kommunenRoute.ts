import { createRoute } from "@hono/zod-openapi";
import { KommunenResponseSchema } from "./kommunenInterfaces";

export const kommunenRoute = createRoute({
  method: "get",
  path: "/api/v1/kommunen",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: KommunenResponseSchema,
        },
      },
      description: "The Kommunen supported by Schneller Gründen",
    },
  },
  tags: ["Active Development"],
  summary: "Get the names of the Kommunen supported by Schneller Gründen",
});
