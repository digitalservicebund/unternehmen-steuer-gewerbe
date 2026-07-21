import { type JWTPayload } from "jose";

// FIT-Connect submission events
// see https://docs.fitko.de/fit-connect/docs/getting-started/event-log/events#submission-events for details
const FIT_CONNECT_EVENT_STATUS: Record<string, SubmissionEventStatus> = {
  "create-submission": "created",
  "submit-submission": "submitted",
  "notify-submission": "received",
  "accept-submission": "accepted",
  "reject-submission": "rejected",
};

// OSCI transport report (Laufzettel) events
// TODO: the exact `event.type` strings the AKDB REST API emits still need to be verified
// against a real transport report response (including the rejection case).
const OSCI_EVENT_STATUS: Record<string, SubmissionEventStatus> = {
  Creation: "created",
  Forwarding: "submitted",
  Reception: "received",
  AcceptDelivery: "accepted",
};

// Unified event status shared by the FIT-Connect and OSCI
export const SUBMISSION_EVENT_STATUS_KEYS = [
  "created",
  "submitted",
  "received",
  "accepted",
  "rejected",
] as const;

export type SubmissionEventStatus = (typeof SUBMISSION_EVENT_STATUS_KEYS)[number];

export interface SubmissionEvent {
  timestamp: string;
  status: SubmissionEventStatus;
}

export function toSubmissionEventFromFitConnectPayload(
  payload: JWTPayload | null,
): SubmissionEvent | undefined {
  if (payload === null) return undefined;

  const events = payload.events as Record<string, unknown> | undefined;
  const eventName = Object.keys(events ?? {})[0]
    ?.split("/")
    .pop();
  const { iat } = payload;
  if (eventName === undefined || iat === undefined) return undefined;

  const status = FIT_CONNECT_EVENT_STATUS[eventName];
  if (status === undefined) return undefined;

  return { timestamp: new Date(iat * 1000).toISOString(), status };
}

export function toSubmissionEventFromOsciEvent(event: {
  type: string;
  timestamp: string;
}): SubmissionEvent | undefined {
  const status = OSCI_EVENT_STATUS[event.type];
  if (status === undefined) return undefined;

  return { timestamp: event.timestamp, status };
}
