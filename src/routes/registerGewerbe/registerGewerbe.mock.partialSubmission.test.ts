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
import { getFinanzamtId as mockGetFinanzamtId } from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import * as gewerbeanmeldung from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";

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

  describe("partial submission via ?only=gewerbeanmeldung or ?only=fseÜbermittlung", () => {
    it("submits only the Gewerbeanmeldung and skips the FsE with ?only=gewerbeanmeldung", async () => {
      mockGetGewerbeRoutingInfo.mockClear();
      vi.mocked(mockGetFinanzamtId).mockClear();

      const response = await postRegisterGewerbe(
        registerGewerbeSampleRequestAllFieldsFilled,
        "?only=gewerbeanmeldung",
      );
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.gewerbeanmeldung.success).toBe(true);
      expect(json.fseÜbermittlung).toBeUndefined();
      expect(mockGetGewerbeRoutingInfo).toHaveBeenCalledOnce();
      expect(mockGetFinanzamtId).not.toHaveBeenCalled();
    });

    it("submits only the FsE and skips the Gewerbeanmeldung with ?only=fseÜbermittlung", async () => {
      mockGetGewerbeRoutingInfo.mockClear();
      vi.mocked(mockGetFinanzamtId).mockClear();

      const response = await postRegisterGewerbe(
        registerGewerbeSampleRequestAllFieldsFilled,
        "?only=fseÜbermittlung",
      );
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.fseÜbermittlung.success).toBe(true);
      expect(json.gewerbeanmeldung).toBeUndefined();
      expect(mockGetFinanzamtId).toHaveBeenCalledOnce();
      expect(mockGetGewerbeRoutingInfo).not.toHaveBeenCalled();
    });

    it("Returns 400 BAD REQUEST when the only requested part fails with a validation_error", async () => {
      vi.mocked(mockGetFinanzamtId).mockClear();
      vi.spyOn(gewerbeanmeldung, "createGewerbeanmeldungXml").mockRejectedValue(
        new Error("XML not valid"),
      );

      const response = await postRegisterGewerbe(
        registerGewerbeSampleRequestAllFieldsFilled,
        "?only=gewerbeanmeldung",
      );
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.BadRequest);
      expect(json.gewerbeanmeldung.success).toBe(false);
      expect(json.gewerbeanmeldung.errorType).toBe(ErrorTypeSchema.enum.validation_error);
      expect(mockGetFinanzamtId).not.toHaveBeenCalled();
    });

    it("Returns 500 INTERNAL SERVER ERROR when the only requested part fails upstream_error", async () => {
      vi.mocked(mockGetFinanzamtId).mockClear();
      mockSubmitData.mockRejectedValueOnce(new Error("Timeout"));

      const response = await postRegisterGewerbe(
        registerGewerbeSampleRequestAllFieldsFilled,
        "?only=gewerbeanmeldung",
      );
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.InternalServerError);
      expect(json.gewerbeanmeldung.success).toBe(false);
      expect(json.gewerbeanmeldung.errorType).toBe(ErrorTypeSchema.enum.upstream_error);
      expect(mockGetFinanzamtId).not.toHaveBeenCalled();
    });
  });
});
