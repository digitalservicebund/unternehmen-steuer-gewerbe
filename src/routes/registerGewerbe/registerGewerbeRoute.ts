import { z, createRoute } from "@hono/zod-openapi";
import {
  RegisterGewerbeRequestSchema,
  RegisterGewerbeResponseSchema,
} from "./registerGewerbeInterfaces";

export const registerGewerbeRoute = createRoute({
  method: "post",
  path: "/api/v1/register-gewerbe",
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterGewerbeRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: RegisterGewerbeResponseSchema,
        },
      },
      description: "Successfully submitted to FIT-Connect",
    },
    500: {
      content: {
        "application/json": {
          schema: RegisterGewerbeResponseSchema,
        },
      },
      description: "Internal Server Error",
    },
  },
  tags: ["Active Development"],
  summary: "Register Gewerbe via FIT-Connect",
});
