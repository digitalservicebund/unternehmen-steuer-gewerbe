import { describe, it, expect, vi, afterEach } from "vitest";

// Note 1: mocking is "global" on file level, therefore we have separate files for tests that mock and those that don't.
// Note 2: We need to mock here, such that the private library correctly initializes their internal libraries before the tests are run.
vi.mock("@digitalservicebund/unternehmen-steuer-gewerbe-privat", () => ({
  validateFsE: vi.fn().mockReturnValue({ valid: true }),
  createElsterFsEEUnXml: vi.fn().mockReturnValue("<xml/>"),
  sendFsE: vi.fn().mockReturnValue({ success: true }),
  getFinanzamtId: vi.fn().mockReturnValue(["mock-finanzamt-id"]),
  getFinanzamtDetailsById: vi.fn().mockReturnValue({
    name: "Finanzamt Mock",
    hausanschrift: {
      strasse: "Mockstraße",
      hausnummer: "1",
      postleitzahl: "00000",
      ort: "Mockstadt",
    },
    telefonnummer: "0000 000-0",
  }),
}));

const { mockSubmitData, mockGetGewerbeRoutingInfo } = vi.hoisted(() => ({
  mockSubmitData: vi.fn().mockResolvedValue({ submissionId: "mock-submission-id" }),
  mockGetGewerbeRoutingInfo: vi.fn().mockResolvedValue({
    ags: "03046001",
    ars: "084210000000",
    gewerbeamt: {
      name: "Stadt Fulda",
      adresse: { strasse: "Schlossstraße", hausnummer: "1", postleitzahl: "36037", ort: "Fulda" },
      telefon: "0661 102-0",
      onlineServices: [],
    },
    fitConnectDestinationInformation: { destinationId: "mock-destination-id" },
  }),
}));

vi.mock("../../clients/fitConnectClient/fitConnectClient", () => ({
  getFitConnectClient: () => ({ submitData: mockSubmitData }),
}));

vi.mock("./getGewerbeRoutingInfo", () => ({
  getGewerbeRoutingInfo: mockGetGewerbeRoutingInfo,
}));

import app from "../../app";
import {
  validateFsE as mockValidateFsE,
  sendFsE as mockSendFsE,
  getFinanzamtId as mockGetFinanzamtId,
} from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import * as gewerbeanmeldung from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import * as pdfGenerator from "./registerGewerbePdfGenerator";

import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";
import { ErrorTypeSchema } from "./registerGewerbeInterfaces";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";

function postRegisterGewerbe(data = registerGewerbeSampleRequestAllFieldsFilled, queryString = "") {
  return app.request(`/api/v1/register-gewerbe${queryString}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

describe("Route /api/v1/register-gewerbe (with ERiC mocked)", () => {
  afterEach(() => vi.restoreAllMocks());

  describe("in case of partial success", () => {
    it("Returns 207 MULTI-STATUS with gewerbeanmeldung upstream_error when FIT-Connect fails, fseÜbermittlung still succeeds", async () => {
      mockGetGewerbeRoutingInfo.mockRejectedValueOnce(
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

    it("Returns 207 MULTI-STATUS with fseÜbermittlung invalid_data when no Finanzamt is found for the address, gewerbeanmeldung still succeeds", async () => {
      vi.mocked(mockGetFinanzamtId).mockReturnValueOnce([]);

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.MultiStatus);
      expect(json.fseÜbermittlung.success).toBe(false);
      expect(json.fseÜbermittlung.errorType).toBe(ErrorTypeSchema.enum.invalid_data);
      expect(json.gewerbeanmeldung.success).toBe(true);
    });

    it.each([
      {
        label: "upstream_error when ERiC service is unavailable",
        setup: () =>
          vi.mocked(mockSendFsE).mockImplementationOnce(() => {
            throw new Error("ERiC unavailable");
          }),
        errorType: ErrorTypeSchema.enum.upstream_error,
      },
      {
        label: "upstream_error when sendFsE reports failure",
        setup: () =>
          vi.mocked(mockSendFsE).mockReturnValueOnce({
            success: false,
            info: "ERiC rejected submission",
          }),
        errorType: ErrorTypeSchema.enum.upstream_error,
      },
      {
        label: "validation_error when FsE validation fails",
        setup: () =>
          vi.mocked(mockValidateFsE).mockReturnValueOnce({
            valid: false,
            errors: "FsE validation failed",
          }),
        errorType: ErrorTypeSchema.enum.validation_error,
      },
    ])(
      "Returns 207 MULTI-STATUS with fseÜbermittlung $label, gewerbeanmeldung still succeeds",
      async ({ setup, errorType }) => {
        setup();

        const response = await postRegisterGewerbe();
        const json = await response.json();
        expect(response.status).toEqual(HttpStatusCode.MultiStatus);
        expect(json.fseÜbermittlung.success).toBe(false);
        expect(json.fseÜbermittlung.errorType).toBe(errorType);
        expect(json.gewerbeanmeldung.success).toBe(true);
        expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
      },
    );
  });

  describe("in case of error", () => {
    it("Returns 400 BAD REQUEST when both submissions fail with validation errors", async () => {
      vi.spyOn(gewerbeanmeldung, "createGewerbeanmeldungXml").mockRejectedValue(
        new Error("XML schema mismatch"),
      );
      vi.mocked(mockValidateFsE).mockReturnValueOnce({
        valid: false,
        errors: "FsE validation failed",
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
      vi.mocked(mockSendFsE).mockImplementationOnce(() => {
        throw new Error("ERiC unavailable");
      });

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.InternalServerError);
      expect(json.gewerbeanmeldung.success).toBe(false);
      expect(json.fseÜbermittlung.success).toBe(false);
    });

    it("Returns 500 INTERNAL SERVER ERROR when an unexpected error is thrown outside of submission error handling", async () => {
      vi.spyOn(pdfGenerator, "generatePdfReceipt").mockRejectedValueOnce(
        new Error("PDF generation crashed"),
      );

      const response = await postRegisterGewerbe();
      const json = await response.json();
      expect(response.status).toEqual(HttpStatusCode.InternalServerError);
      expect(json.gewerbeanmeldung.success).toBe(false);
      expect(json.gewerbeanmeldung.info).toBe("Internal Server Error");
      expect(json.fseÜbermittlung.success).toBe(false);
      expect(json.fseÜbermittlung.info).toBe("Internal Server Error");
    });

    it("Returns 400 BAD REQUEST when sollIstVersteuerung is 'istVersteuerung' but istVersteuerungGrund is missing", async () => {
      const response = await postRegisterGewerbe({
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          sollIstVersteuerung: "istVersteuerung",
        },
      });
      expect(response.status).toEqual(HttpStatusCode.BadRequest);
    });

    it("Returns 400 BAD REQUEST when istVersteuerungGrund is set but sollIstVersteuerung is not 'istVersteuerung'", async () => {
      const response = await postRegisterGewerbe({
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          sollIstVersteuerung: "sollVersteuerung",
          istVersteuerungGrund: "unterschreitungUmsatzgrenze",
        },
      });
      expect(response.status).toEqual(HttpStatusCode.BadRequest);
    });
  });
});
