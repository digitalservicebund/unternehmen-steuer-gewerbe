import { describe, it, expect, vi, afterEach, beforeAll } from "vitest";
import app from "../../app";
import * as eric from "unternehmen-steuer-gewerbe-privat";
import * as gewerbeanmeldung from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { registerGewerbeCompleteRequest } from "./testHelpers";
import { ErrorTypeSchema } from "./registerGewerbeInterfaces";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import { existsSync } from "node:fs";

function postRegisterGewerbe(data = registerGewerbeCompleteRequest) {
  return app.request("/api/v1/register-gewerbe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

describe("Route /api/v1/register-gewerbe", () => {
  afterEach(() => vi.restoreAllMocks());

  describe("in case of success", () => {
    it("Returns 200 OK with success=true for gewerbe and steuer on POST", async () => {
      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.gewerbeanmeldung.success).toBe(true);
      expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
      expect(json.steuernummer.success).toBe(true);
    });

    it("does write the eric log to /tmp", async () => {
      const response = await postRegisterGewerbe();
      expect(response.status).toEqual(HttpStatusCode.Ok);

      expect(existsSync("/tmp/eric.log")).toBe(true);
    });
  });

  describe("in case of partial success", () => {
    it("Returns 207 MULTI-STATUS with gewerbeanmeldung upstream_error when FIT-Connect fails, steuernummer still succeeds", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify({ message: "Server Down" }), {
          status: HttpStatusCode.InternalServerError,
        }),
      );

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.MultiStatus);
      expect(json.gewerbeanmeldung.success).toBe(false);
      expect(json.gewerbeanmeldung.errorType).toBe(ErrorTypeSchema.enum.upstream_error);
      expect(json.steuernummer.success).toBe(true);
    });

    it("Returns 207 MULTI-STATUS with gewerbeanmeldung validation_error when XML creation throws, steuernummer still succeeds", async () => {
      vi.spyOn(gewerbeanmeldung, "createGewerbeanmeldungXml").mockRejectedValue(
        new Error("XML schema mismatch"),
      );

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.MultiStatus);
      expect(json.gewerbeanmeldung.success).toBe(false);
      expect(json.gewerbeanmeldung.errorType).toBe(ErrorTypeSchema.enum.validation_error);
      expect(json.steuernummer.success).toBe(true);
    });

    // TODO: fix or remove
    it("Returns 207 MULTI-STATUS with steuernummer upstream_error when ERiC service is unavailable, gewerbeanmeldung still succeeds", async () => {
      vi.spyOn(eric, "validateFsE").mockReturnValue({
        isValid: undefined,
        returnCode: undefined,
        info: undefined,
      });

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.MultiStatus);
      expect(json.steuernummer.success).toBe(false);
      expect(json.steuernummer.errorType).toBe(ErrorTypeSchema.enum.upstream_error);
      expect(json.gewerbeanmeldung.success).toBe(true);
      expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
    });

    // TODO: fix or remove
    it.skip("Returns 207 MULTI-STATUS with steuernummer validation_error when FsE validation fails, gewerbeanmeldung still succeeds", async () => {
      vi.spyOn(eric, "validateFsE").mockReturnValue({
        isValid: false,
        returnCode: 1,
        info: "FsE validation failed",
      });

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.MultiStatus);
      expect(json.steuernummer.success).toBe(false);
      expect(json.steuernummer.errorType).toBe(ErrorTypeSchema.enum.validation_error);
      expect(json.gewerbeanmeldung.success).toBe(true);
      expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
    });
  });

  describe("in case of error", () => {
    // TODO: fix or remove
    it.skip("Returns 400 BAD REQUEST when both submissions fail with validation errors", async () => {
      vi.spyOn(gewerbeanmeldung, "createGewerbeanmeldungXml").mockRejectedValue(
        new Error("XML schema mismatch"),
      );
      vi.spyOn(eric, "validateFsE").mockReturnValue({
        isValid: false,
        returnCode: 1,
        info: "FsE validation failed",
      });

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.BadRequest);
      expect(json.gewerbeanmeldung.success).toBe(false);
      expect(json.gewerbeanmeldung.errorType).toBe(ErrorTypeSchema.enum.validation_error);
      expect(json.steuernummer.success).toBe(false);
      expect(json.steuernummer.errorType).toBe(ErrorTypeSchema.enum.validation_error);
    });

    // TODO: fix or remove
    it.skip("Returns 500 INTERNAL SERVER ERROR when both submissions fail", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify({ message: "Server Down" }), { status: 500 }),
      );
      vi.spyOn(eric, "validateFsE").mockReturnValue({
        isValid: undefined,
        returnCode: undefined,
        info: undefined,
      });

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.InternalServerError);
      expect(json.gewerbeanmeldung.success).toBe(false);
      expect(json.steuernummer.success).toBe(false);
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
