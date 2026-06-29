import { createRoute, z } from "@hono/zod-openapi";
import {
  RegisterGewerbeRequestSchema,
  RegisterGewerbeResponseSchema,
} from "./registerGewerbeInterfaces";

const RegisterGewerbeQuerySchema = z.object({
  only: z
    .enum(["gewerbeanmeldung", "fseÜbermittlung"])
    .optional()
    .openapi({
      param: { name: "only", in: "query" },
      // example: "gewerbeanmeldung",
      description:
        "Nur einen Teil des Kombiantrags absenden. Ohne Angabe werden beide Teile gesendet.",
    }),
});

export const registerGewerbeRoute = createRoute({
  method: "post",
  path: "/api/v1/register-gewerbe",
  request: {
    query: RegisterGewerbeQuerySchema,
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
      description: "Successfully submitted the Gewerbeanmeldung and fseÜbermittlung request",
    },
    207: {
      content: {
        "application/json": {
          schema: RegisterGewerbeResponseSchema,
        },
      },
      description: "Partial success: one of the two submissions failed",
    },
    400: {
      content: {
        "application/json": {
          schema: RegisterGewerbeResponseSchema,
        },
      },
      description: "Both submissions failed due to invalid request data",
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
  summary: 'Submit a "Kombiantrag" (Gewerbeanmeldung + FsE)',
});
