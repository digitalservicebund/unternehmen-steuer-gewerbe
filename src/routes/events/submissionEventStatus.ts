import { type JWTPayload } from "jose";
import { type TransportReportEvent } from "../../clients/osciClient/osciClient";

// Unified event status shared by the FIT-Connect and OSCI
const SUBMISSION_EVENT_STATUS = {
  created: "created", // FIT-Connect only
  submitted: "submitted",
  notify: "notify",
  accepted: "accepted",
  rejected: "rejected", // FIT-Connect only
} as const;

export type SubmissionEventStatus = keyof typeof SUBMISSION_EVENT_STATUS;

// The abstracted set of states we expose to clients, unified over both
// transports (FIT-Connect and OSCI); used as the response schema enum.
export const SUBMISSION_EVENT_STATUS_KEYS = Object.keys(
  SUBMISSION_EVENT_STATUS,
) as SubmissionEventStatus[];

// Maps FIT-Connect submission events to the unified SUBMISSION_EVENT_STATUS.
// see https://docs.fitko.de/fit-connect/docs/getting-started/event-log/events#submission-events for details
const FIT_CONNECT_EVENT_STATUS: Record<string, SubmissionEventStatus> = {
  "create-submission": SUBMISSION_EVENT_STATUS.created,
  "submit-submission": SUBMISSION_EVENT_STATUS.submitted,
  "notify-submission": SUBMISSION_EVENT_STATUS.notify,
  "accept-submission": SUBMISSION_EVENT_STATUS.accepted,
  "reject-submission": SUBMISSION_EVENT_STATUS.rejected,
};

// OSCI transport report (Laufzettel) events:
// - creation: the message was placed in the recipient's intermediär -> submitted
// - forwarding: the receiving client fetched the message but has not acknowledged it yet
//   -> notify
// - reception: the recipient acknowledged (quittiert) the message -> accepted
// OSCI has no equivalent of the created or rejected statuses.
const OSCI_EVENT_STATUS: Record<string, SubmissionEventStatus> = {
  creation: SUBMISSION_EVENT_STATUS.submitted,
  forwarding: SUBMISSION_EVENT_STATUS.notify,
  reception: SUBMISSION_EVENT_STATUS.accepted,
};

export interface SubmissionEvent {
  timestamp: string;
  status: SubmissionEventStatus;
}

// FIT-Connect event keys are URIs like
// "https://schema.fitko.de/fit-connect/events/accept-submission";
// we only need the last path segment ("accept-submission").
function getEventName(payload: JWTPayload): string | undefined {
  const events = payload.events as Record<string, unknown> | undefined;
  // The object `events` contains exactly one event
  // see https://docs.fitko.de/fit-connect/docs/getting-started/event-log/set-validation#cryptoRequirements
  return Object.keys(events ?? {})[0]
    ?.split("/")
    .pop();
}

export function toSubmissionEventFromFitConnectPayload(
  payload: JWTPayload | null,
): SubmissionEvent | undefined {
  if (payload === null) return undefined;

  const eventName = getEventName(payload);
  const { iat: timestamtWithoutMs } = payload;

  if (eventName === undefined || timestamtWithoutMs === undefined) {
    return undefined;
  }

  const status = FIT_CONNECT_EVENT_STATUS[eventName];

  if (status === undefined) {
    return undefined;
  }

  return { timestamp: new Date(timestamtWithoutMs * 1000).toISOString(), status };
}

export function toSubmissionEventFromOsciEvent(
  event: TransportReportEvent,
): SubmissionEvent | undefined {
  const status = OSCI_EVENT_STATUS[event.type];

  if (status === undefined) {
    return undefined;
  }

  return { timestamp: event.timestamp, status };
}
