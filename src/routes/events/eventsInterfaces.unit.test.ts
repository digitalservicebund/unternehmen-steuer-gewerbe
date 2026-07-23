import { describe, it, expect } from "vitest";
import { EventsRequestSchema, EventsResponseSchema } from "./eventsInterfaces";

function validRequest() {
  return {
    submissionId: "d33e871b-57e9-4567-b906-5022c45bf191",
    ars: "066310009009",
  };
}

describe("EventsRequestSchema", () => {
  it("parses a request with only the required fields", () => {
    const result = EventsRequestSchema.safeParse(validRequest());

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fitConnectDestinationId).toBeUndefined();
    }
  });

  it("fails when submissionId is missing or empty", () => {
    expect(EventsRequestSchema.safeParse({ ars: "066310009009" }).success).toBe(false);
    expect(
      EventsRequestSchema.safeParse({ submissionId: "", ars: "066310009009" }).success,
    ).toBe(false);
  });

  it("requires ars to be exactly 12 digits", () => {
    const request = validRequest();
    expect(EventsRequestSchema.safeParse(request).success).toBe(true);

    expect(EventsRequestSchema.safeParse({ ...request, ars: "123" }).success).toBe(false);
    expect(EventsRequestSchema.safeParse({ ...request, ars: "abcdefghijkl" }).success).toBe(
      false,
    );
  });

  it("accepts an optional fitConnectDestinationId", () => {
    const result = EventsRequestSchema.safeParse({
      ...validRequest(),
      fitConnectDestinationId: "fa63ede0-0ef6-4ca6-abd2-6bd16729ddc1",
    });

    expect(result.success).toBe(true);
  });
});

describe("EventsResponseSchema", () => {
  it("accepts a known status value", () => {
    const result = EventsResponseSchema.safeParse({
      events: [{ timestamp: "2026-04-17T12:00:00.000Z", status: "accepted" }],
    });

    expect(result.success).toBe(true);
  });

  it("rejects an unknown status value", () => {
    const result = EventsResponseSchema.safeParse({
      events: [{ timestamp: "2026-04-17T12:00:00.000Z", status: "not-a-real-status" }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a malformed timestamp", () => {
    const result = EventsResponseSchema.safeParse({
      events: [{ timestamp: "17-04-2026", status: "accepted" }],
    });

    expect(result.success).toBe(false);
  });
});
