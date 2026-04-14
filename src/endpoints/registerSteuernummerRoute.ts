import { z, createRoute } from "@hono/zod-openapi";

const registerSteuernummerResponseSchema = z.object({}).openapi("RegisterSteuernummerResponse");

export const registerSteuernummerRoute = createRoute({
  method: "post",
  path: "/api/v1/register-steuernummer",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: registerSteuernummerResponseSchema,
        },
      },
      description: "Successfully registered Steuernummer",
    },
  },
});
