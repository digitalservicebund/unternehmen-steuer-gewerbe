import { createRoute } from "@hono/zod-openapi";
import { GetEventsRequestSchema, GetEventsResponseSchema } from "./getEventsInterfaces";

export const getEventsRoute = createRoute({
  method: "get",
  path: "/api/v1/register-gewerbe/{submissionId}/events", // Use {} for path params in OpenAPI
  request: {
    params: GetEventsRequestSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetEventsResponseSchema,
        },
      },
      description: "The list of lifecycle events for the submission",
    },
    404: {
      description: "Submission not found",
    },
    500: {
      description: "Internal Server Error",
    },
  },
  tags: ["Experimental"],
  summary: "Experimental implementation",
});
