import { z } from "@hono/zod-openapi";

// Schema for the submissionId in the URL. Either a FIT-Connect submission UUID
// or an OSCI message Id (e.g. "vps_by_..."), depending on which transport was used
export const GetEventsRequestSchema = z.object({
  submissionId: z
    .string()
    .min(1)
    .openapi({
      param: {
        name: "submissionId",
        in: "path",
      },
      example: "dbc4efa5-58e7-4527-8898-00d58450c68e",
    }),
});

// Schema for the event log response, shared by the FIT-Connect and OSCI paths.
// OSCI transport report events have no eventId equivalent, so it is optional.
export const GetEventsResponseSchema = z
  .object({
    events: z.array(
      z.object({
        eventId: z.string().optional(),
        eventType: z.string().openapi({ example: "accept-submission" }),
        timestamp: z.iso.datetime(),
      }),
    ),
  })
  .openapi("SubmissionEvents");
