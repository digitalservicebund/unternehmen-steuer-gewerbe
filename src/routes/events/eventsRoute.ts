import { createRoute } from "@hono/zod-openapi";
import { EventsRequestSchema, EventsResponseSchema } from "./eventsInterfaces";

export const eventsRoute = createRoute({
  method: "get",
  path: "/api/v1/register-gewerbe/gewerbemeldung/events",
  request: {
    query: EventsRequestSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: EventsResponseSchema,
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
