import { z } from "@hono/zod-openapi";
import { SUBMISSION_EVENT_STATUS_KEYS } from "./submissionEventStatus";

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

// Unified event log response, shared by the FIT-Connect and OSCI paths. Both transports
// are normalized to the same lifecycle status; transport-specific raw fields are dropped.
export const GetEventsResponseSchema = z
  .object({
    events: z.array(
      z.object({
        timestamp: z.iso.datetime(),
        status: z.enum(SUBMISSION_EVENT_STATUS_KEYS).openapi({ example: "accepted" }),
      }),
    ),
  })
  .openapi("SubmissionEvents");
