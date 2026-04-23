import { z } from "@hono/zod-openapi";

// Schema for the submissionId in the URL
export const GetEventsRequestSchema = z.object({
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
export const GetEventsResponseSchema = z
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
