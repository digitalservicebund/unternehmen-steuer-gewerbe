import { z } from "@hono/zod-openapi";
import { SUBMISSION_EVENT_STATUS_KEYS } from "./submissionEventStatus";

export const EventsRequestSchema = z.object({
  submissionId: z
    .string()
    .min(1)
    .openapi({
      param: {
        name: "submissionId",
        in: "query",
      },
      example:
        "d33e871b-57e9-4567-b906-5022c45bf191 or vps_by_17842013120809f692473-5539-462e-be09-3fc1d1d5d6a2",
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
        'If set, the events are fetched from FIT-Connect for the given submissionId and destinationId. If omitted, an OSCI transport report (Laufzettel) is fetched for the given submissionId ("messageId" in OSCI lingo) and ars instead. For submissions sent via FIT-Connect the fitConnectDestinationId is mandatory: the OSCI fallback will not work for them and is only meant for submissions that were actually sent via OSCI.',
      example: "fa63ede0-0ef6-4ca6-abd2-6bd16729ddc1",
    }),
});

// Unified event log response, shared by the FIT-Connect and OSCI paths. Both transports
// are normalized to the same lifecycle status; transport-specific raw fields are dropped.
export const EventsResponseSchema = z
  .object({
    events: z.array(
      z.object({
        timestamp: z.iso.datetime(),
        status: z.enum(SUBMISSION_EVENT_STATUS_KEYS).openapi({
          example: "accepted",
          description:
            "Lifecycle status of the submission.  \nMeanings:  \n- `created`: the submission was created by the online service (FIT-Connect only).  \n- `submitted`: the submission has been sent to the recipient (FIT-Connect: dispatched to the Destination; OSCI: placed in the recipient's intermediär).  \n- `notify`: the receiving Fachverfahren has fetched the submission but not yet acknowledged it.  \n- `accepted`: the submission was technically accepted/acknowledged by the Fachverfahren (OSCI: quittiert). This only confirms technical acceptance of the data, NOT that the application itself has been approved.  \n- `rejected`: the submission was technically rejected by the Fachverfahren (FIT-Connect only).",
        }),
      }),
    ),
  })
  .openapi("GewerbemeldungSubmissionEvents");
