import { describe, it, expect, vi, afterEach } from "vitest";

// Note 1: mocking is "global" on file level, therefore we have separate files for tests that mock and those that don't.
// Note 2: We need to mock here, such that the private library correctly initializes their internal libraries before the tests are run.
vi.mock("unternehmen-steuer-gewerbe-privat", () => ({
  validateFsE: vi.fn().mockReturnValue({ isValid: true, returnCode: 0, info: undefined }),
  createElsterFsEEUnXml: vi.fn().mockReturnValue("<xml/>"),
}));

const mockSubmitData = vi.fn().mockResolvedValue({ submissionId: "mock-submission-id" });

vi.mock("../../clients/fitConnectClient/fitConnectClient", () => ({
  getFitConnectClient: () => ({ submitData: mockSubmitData }),
}));

const mockLookupRequestContext = vi.fn().mockResolvedValue({
  ags: "03046001",
  destinationId: "mock-destination-id",
});

vi.mock("./lookupRequestContext", () => ({
  lookupRequestContext: mockLookupRequestContext,
}));

import app from "../../app";
import * as eric from "unternehmen-steuer-gewerbe-privat";
import * as gewerbeanmeldung from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";

import { registerGewerbeCompleteRequest } from "./testHelpers";
import { ErrorTypeSchema } from "./registerGewerbeInterfaces";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";

function postRegisterGewerbe(data = registerGewerbeCompleteRequest) {
  return app.request("/api/v1/register-gewerbe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

describe("Route /api/v1/register-gewerbe (with ERiC mocked)", () => {
  afterEach(() => vi.restoreAllMocks());

  describe("in case of partial success", () => {
    it("Returns 207 MULTI-STATUS with gewerbeanmeldung upstream_error when FIT-Connect fails, fseÜbermittlung still succeeds", async () => {
      mockLookupRequestContext.mockRejectedValueOnce(
        new Error("No FIT-Connect destination found for AGS 03046001"),
      );

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.MultiStatus);
      expect(json.gewerbeanmeldung.success).toBe(false);
      expect(json.gewerbeanmeldung.errorType).toBe(ErrorTypeSchema.enum.upstream_error);
      expect(json.fseÜbermittlung.success).toBe(true);
    });

    it("Returns 207 MULTI-STATUS with gewerbeanmeldung validation_error when XML creation throws, fseÜbermittlung still succeeds", async () => {
      vi.spyOn(gewerbeanmeldung, "createGewerbeanmeldungXml").mockRejectedValue(
        new Error("XML schema mismatch"),
      );

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.MultiStatus);
      expect(json.gewerbeanmeldung.success).toBe(false);
      expect(json.gewerbeanmeldung.errorType).toBe(ErrorTypeSchema.enum.validation_error);
      expect(json.fseÜbermittlung.success).toBe(true);
    });

    it("Returns 207 MULTI-STATUS with fseÜbermittlung upstream_error when ERiC service is unavailable, gewerbeanmeldung still succeeds", async () => {
      vi.spyOn(eric, "validateFsE").mockReturnValue({
        isValid: undefined,
        returnCode: undefined,
        info: undefined,
      });

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.MultiStatus);
      expect(json.fseÜbermittlung.success).toBe(false);
      expect(json.fseÜbermittlung.errorType).toBe(ErrorTypeSchema.enum.upstream_error);
      expect(json.gewerbeanmeldung.success).toBe(true);
      expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
    });

    it("Returns 207 MULTI-STATUS with fseÜbermittlung validation_error when FsE validation fails, gewerbeanmeldung still succeeds", async () => {
      vi.spyOn(eric, "validateFsE").mockReturnValue({
        isValid: false,
        returnCode: 1,
        info: "FsE validation failed",
      });

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.MultiStatus);
      expect(json.fseÜbermittlung.success).toBe(false);
      expect(json.fseÜbermittlung.errorType).toBe(ErrorTypeSchema.enum.validation_error);
      expect(json.gewerbeanmeldung.success).toBe(true);
      expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
    });
  });

  describe("in case of error", () => {
    it("Returns 400 BAD REQUEST when both submissions fail with validation errors", async () => {
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
      expect(json.fseÜbermittlung.success).toBe(false);
      expect(json.fseÜbermittlung.errorType).toBe(ErrorTypeSchema.enum.validation_error);
    });

    it("Returns 500 INTERNAL SERVER ERROR when both submissions fail", async () => {
      mockSubmitData.mockRejectedValueOnce(new Error("Server Down"));
      vi.spyOn(eric, "validateFsE").mockReturnValue({
        isValid: undefined,
        returnCode: undefined,
        info: undefined,
      });

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.InternalServerError);
      expect(json.gewerbeanmeldung.success).toBe(false);
      expect(json.fseÜbermittlung.success).toBe(false);
    });
  });
});
