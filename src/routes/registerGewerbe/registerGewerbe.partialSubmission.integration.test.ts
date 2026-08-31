import { describe, it, expect, vi, afterEach } from "vitest";

import {
  mockSubmitData,
  mockGetGewerbeRoutingInfo,
  postRegisterGewerbe,
} from "./registerGewerbeIntegrationTestSetup";
import {
  getFinanzamtId as mockGetFinanzamtId,
  sendFsE as mockSendFsE,
} from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import * as gewerbeanmeldung from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";

import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";
import { ErrorTypeSchema } from "./registerGewerbeInterfaces";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import { EricErrorFachlicheAblehnung } from "./registerGewerbeEndpoint";

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

    it("Returns 400 BAD REQUEST when the requested FsE fails because sendFsE reports a fachliche Ablehnung (returnCode 610001002)", async () => {
      vi.mocked(mockSendFsE).mockReturnValueOnce({
        success: false,
        returnCode: EricErrorFachlicheAblehnung,
        info: "Fachliche Ablehnung",
      });

      const response = await postRegisterGewerbe(
        registerGewerbeSampleRequestAllFieldsFilled,
        "?only=fseÜbermittlung",
      );
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.BadRequest);
      expect(json.fseÜbermittlung.success).toBe(false);
      expect(json.fseÜbermittlung.errorType).toBe(ErrorTypeSchema.enum.validation_error);
    });

    it("Returns 500 INTERNAL SERVER ERROR when sending returns a 'Fehler im Transferheader'", async () => {
      vi.mocked(mockSendFsE).mockReturnValueOnce({
        success: false,
        returnCode: 610101210,
        info: "Fachliche Ablehnung",
      });

      const response = await postRegisterGewerbe(
        registerGewerbeSampleRequestAllFieldsFilled,
        "?only=fseÜbermittlung",
      );
      const json = await response.json();

      expect(response.status).toEqual(HttpStatusCode.InternalServerError);
      expect(json.fseÜbermittlung.success).toBe(false);
      expect(json.fseÜbermittlung.errorType).toBe(ErrorTypeSchema.enum.upstream_error);
    });
  });
});
