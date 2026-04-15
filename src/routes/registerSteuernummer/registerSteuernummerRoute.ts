import { createRoute } from "@hono/zod-openapi";

export const registerSteuernummerRoute = createRoute({
  method: "post",
  path: "/api/v1/register-steuernummer",
  responses: {
    501: {
      description: "Not implemented",
    },
  },
  tags: ["Experimental"],
  summary: "Experimental implementation",
});
