import { describe, it, expect, beforeAll } from "vitest";
import app from "../../app";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";

function postRegisterGewerbe(data = registerGewerbeSampleRequestAllFieldsFilled) {
  return app.request("/api/v1/register-gewerbe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

describe("Route /api/v1/register-gewerbe/gewerbemeldung/events", () => {
  let eventsQuery: string;

  beforeAll(async () => {
    const response = await postRegisterGewerbe();
    expect(response.status).toEqual(HttpStatusCode.Ok);
    // The client forwards the routing context from the submission response 1:1.
    const { submissionId, ars, fitConnectDestinationId } = (await response.json()).gewerbeanmeldung;
    expect(submissionId).toBeDefined();
    eventsQuery = new URLSearchParams({ submissionId, ars, fitConnectDestinationId }).toString();
  });

  it("Returns 200 OK on GET with the routing context from the submission", async () => {
    const response = await app.request(
      `/api/v1/register-gewerbe/gewerbemeldung/events?${eventsQuery}`,
    );
    expect(response.status).toEqual(HttpStatusCode.Ok);
  });
});
