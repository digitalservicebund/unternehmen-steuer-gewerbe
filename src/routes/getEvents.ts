import { z, createRoute } from "@hono/zod-openapi";

// Schema for the submissionId in the URL
const EventsRequestSchema = z.object({
  submissionId: z
    .uuid() // FIT-Connect IDs are typically UUIDs
    .openapi({
      param: {
        name: "submissionId",
        in: "path",
      },
      example: "dbc4efa5-58e7-4527-8898-00d58450c68e",
    }),
});

// Schema for the FIT-Connect event log response
const EventsResponseSchema = z
  .object({
    events: z.array(
      z.object({
        eventId: z.string(),
        eventType: z.string().openapi({ example: "accept-submission" }),
        timestamp: z.iso.datetime(),
      }),
    ),
  })
  .openapi("SubmissionEvents");

export const getEventsRoute = createRoute({
  method: "get",
  path: "/api/v1/register-gewerbe/{submissionId}/events", // Use {} for path params in OpenAPI
  request: {
    params: EventsRequestSchema,
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
});
