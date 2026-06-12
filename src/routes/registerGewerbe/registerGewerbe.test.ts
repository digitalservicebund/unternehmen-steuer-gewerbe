import { describe, it, expect, beforeAll } from "vitest";
import app from "../../app";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import { RegisterGewerbeResponseSchema } from "./registerGewerbeInterfaces";
import { existsSync } from "node:fs";
import { z } from "@hono/zod-openapi";

function postRegisterGewerbe(data = registerGewerbeSampleRequestAllFieldsFilled) {
  return app.request("/api/v1/register-gewerbe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

describe("Route /api/v1/register-gewerbe", () => {
  let response: Response;
  let json: z.infer<typeof RegisterGewerbeResponseSchema>;
  beforeAll(async () => {
    response = await postRegisterGewerbe();
    json = await response.json();
  });

  describe("in case of success on POST", () => {
    it("Returns 200 OK with success=true for gewerbe and steuer", async () => {
      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.gewerbeanmeldung.success).toBe(true);
      expect(json.fseÜbermittlung.success).toBe(true);
    });

    it("submissionIds for gewerbe and steuer", async () => {
      expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
      expect(json.fseÜbermittlung.submissionId).toBeTruthy();
    });

    it("PDF receipt in base64", async () => {
      expect(json.fseÜbermittlung.pdfReceiptBase64).toBeTruthy();
      // base64 prefix is '%PDF-'
      expect(json.fseÜbermittlung.pdfReceiptBase64).toMatch(/^JVBERi0/);
    });

    it("does write the eric log to /tmp", async () => {
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
