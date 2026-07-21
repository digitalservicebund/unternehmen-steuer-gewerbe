import { z } from "@hono/zod-openapi";

// Routing context echoed back 1:1 from the registerGewerbe response so the stateless
// events endpoint can locate the submission. The presence of fitConnectDestinationId
// marks a FIT-Connect submission; its absence marks an OSCI submission.
export const GetEventsRequestSchema = z.object({
  submissionId: z
    .string()
    .min(1)
    .openapi({
      param: {
        name: "submissionId",
        in: "query",
      },
      example: "d33e871b-57e9-4567-b906-5022c45bf191",
    }),
  ars: z
    .string()
    .regex(/^\d{12}$/)
    .openapi({
      param: {
        name: "ars",
        in: "query",
      },
      example: "066310009009",
    }),
  fitConnectDestinationId: z
    .string()
    .optional()
    .openapi({
      param: {
        name: "fitConnectDestinationId",
        in: "query",
      },
      description:
        "If set, the events are fetched from FIT-Connect for the given submissionId and destinationId. If omitted, an OSCI transport report (Laufzettel) is fetched for the given submissionId and ars instead. For submissions sent via FIT-Connect the fitConnectDestinationId is mandatory: the OSCI fallback will not work for them and is only meant for submissions that were actually sent via OSCI.",
      example: "fa63ede0-0ef6-4ca6-abd2-6bd16729ddc1",
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
