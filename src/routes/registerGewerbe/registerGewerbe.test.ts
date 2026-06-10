import { describe, it, expect, beforeAll } from "vitest";
import app from "../../app";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import { existsSync } from "node:fs";

function postRegisterGewerbe(data = registerGewerbeSampleRequestAllFieldsFilled) {
  return app.request("/api/v1/register-gewerbe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

describe("Route /api/v1/register-gewerbe", () => {
  describe("in case of success", () => {
    it("Returns 200 OK with success=true for gewerbe and steuer and fseÜbermittlung on POST", async () => {
      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.gewerbeanmeldung.success).toBe(true);
      expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
      expect(json.fseÜbermittlung.success).toBe(true);
      expect(json.fseÜbermittlung.submissionId).toBeTruthy();
    });

    it("does write the eric log to /tmp", async () => {
      const response = await postRegisterGewerbe();
      expect(response.status).toEqual(HttpStatusCode.Ok);

      expect(existsSync("/tmp/eric.log")).toBe(true);
    });
  });
});

describe("Route /api/v1/register-gewerbe/:submissionId/events", () => {
  let submissionId: string;

  beforeAll(async () => {
    const response = await postRegisterGewerbe();
    expect(response.status).toEqual(HttpStatusCode.Ok);
    submissionId = (await response.json()).gewerbeanmeldung.submissionId;
    expect(submissionId).toBeDefined();
  });

  it("Returns 200 OK on GET with /:submissionId/events", async () => {
    const response = await app.request(`/api/v1/register-gewerbe/${submissionId}/events`);
    expect(response.status).toEqual(HttpStatusCode.Ok);
  });
});
