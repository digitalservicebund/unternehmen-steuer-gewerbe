import { describe, it, expect, beforeAll, vi } from "vitest";
import app from "../../app";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import { ErrorTypeSchema, RegisterGewerbeResponseSchema } from "./registerGewerbeInterfaces";
import { existsSync } from "node:fs";
import { z } from "@hono/zod-openapi";
import { extractText } from "unpdf";

function postRegisterGewerbe(data = registerGewerbeSampleRequestAllFieldsFilled) {
  return app.request("/api/v1/register-gewerbe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

describe("Route /api/v1/register-gewerbe (full Kombiantrag)", () => {
  let response: Response;
  let json: Required<z.infer<typeof RegisterGewerbeResponseSchema>>;
  beforeAll(async () => {
    response = await postRegisterGewerbe();
    json = await response.json();
  });

  describe("in case of success on POST", () => {
    it("returns 200 OK with success=true for gewerbe and steuer", async () => {
      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(json.gewerbeanmeldung.success).toBe(true);
      expect(json.fseÜbermittlung.success).toBe(true);
    });

    it("returns submissionIds for gewerbe and steuer", async () => {
      expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
      expect(json.fseÜbermittlung.submissionId).toBeTruthy();
    });

    describe("on returning PDF receipts", () => {
      it("returns FsE PDF receipt containing user's last name", async () => {
        expect(json.fseÜbermittlung.pdfReceiptBase64).toBeTruthy();
        // base64 prefix of '%PDF-'
        expect(json.fseÜbermittlung.pdfReceiptBase64).toMatch(/^JVBERi0/);
        const pdfBytes = new Uint8Array(
          Buffer.from(json.fseÜbermittlung.pdfReceiptBase64 ?? "", "base64"),
        );
        // suppress irrelevant warnings of PDF -> TXT
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const { text } = await extractText(pdfBytes, { mergePages: true });
        warnSpy.mockRestore();
        expect(text).toContain(
          registerGewerbeSampleRequestAllFieldsFilled.persönlicheDaten.nachname,
        );
      });

      it("returns Gewerbeanmeldung PDF receipt containing user's last name", async () => {
        expect(json.gewerbeanmeldung.pdfReceiptBase64).toBeTruthy();
        // base64 prefix of '%PDF-'
        expect(json.gewerbeanmeldung.pdfReceiptBase64).toMatch(/^JVBERi0/);
        const pdfBytes = new Uint8Array(
          Buffer.from(json.gewerbeanmeldung.pdfReceiptBase64 ?? "", "base64"),
        );
        // suppress irrelevant warnings of PDF -> TXT
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const { text } = await extractText(pdfBytes, { mergePages: true });
        warnSpy.mockRestore();
        expect(text).toContain(
          registerGewerbeSampleRequestAllFieldsFilled.persönlicheDaten.nachname,
        );
      });
    });

    describe("on returning recipient details", () => {
      it("returns Finanzamt details for adresseAbweichend in unternehmensDaten (with Prinzessinnenstraße 8-14, 10969 Berlin)", async () => {
        const dataWithPostleitZahl = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);

        dataWithPostleitZahl.unternehmensDaten.adresseAbweichend = {
          postleitzahl: "10969",
          ort: "Berlin",
          strasseUndHausnummer: "Prinzessinnenstraße 8-14",
        };

        const response = await postRegisterGewerbe(dataWithPostleitZahl);

        const json = await response.json();

        expect(json.fseÜbermittlung.officeDetails!.name).toEqual(
          "Finanzamt Friedrichshain-Kreuzberg",
        );
        expect(json.fseÜbermittlung.officeDetails!.strasseUndHausnummer).toEqual("Mehringdamm 22");
        expect(json.fseÜbermittlung.officeDetails!.postleitzahl).toEqual("10961");
        expect(json.fseÜbermittlung.officeDetails!.ort).toEqual("Berlin");
        expect(json.fseÜbermittlung.officeDetails!.telefon).toEqual("030 9024-14 0");
      });

      it("returns Finanzamt details for persönlicheDaten  (Musterstraße 1, 03046 Cottbus)", async () => {
        const dataWithoutAdresseAbweichend = structuredClone(
          registerGewerbeSampleRequestAllFieldsFilled,
        );

        dataWithoutAdresseAbweichend.unternehmensDaten.adresseAbweichend = undefined;

        const response = await postRegisterGewerbe(dataWithoutAdresseAbweichend);
        const json = await response.json();

        expect(json.fseÜbermittlung.officeDetails!.name).toEqual("Finanzamt Cottbus");
        expect(json.fseÜbermittlung.officeDetails!.strasseUndHausnummer).toEqual(
          "Vom-Stein-Straße 29",
        );
        expect(json.fseÜbermittlung.officeDetails!.postleitzahl).toEqual("03050");
        expect(json.fseÜbermittlung.officeDetails!.ort).toEqual("Cottbus");
        expect(json.fseÜbermittlung.officeDetails!.telefon).toEqual("0355 4991-4100");
      });

      it("returns the appropriate Gewerbeamt details for Fulda", async () => {
        const dataWithFulda = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);
        dataWithFulda.unternehmensDaten.adresseAbweichend = {
          strasseUndHausnummer: "Schlossstraße 2",
          postleitzahl: "36037",
          ort: "Fulda",
        };

        const response = await postRegisterGewerbe(dataWithFulda);
        const json = await response.json();

        expect(json.gewerbeanmeldung.officeDetails!.name).toEqual("Stadt Fulda");
        expect(json.gewerbeanmeldung.officeDetails!.strasseUndHausnummer).toEqual(
          "Schlossstraße 1",
        );
        expect(json.gewerbeanmeldung.officeDetails!.postleitzahl).toEqual("36037");
        expect(json.gewerbeanmeldung.officeDetails!.ort).toEqual("Fulda");
        expect(json.gewerbeanmeldung.officeDetails!.telefon).toEqual("0661 102-0");
      });
    });

    it("returns fseÜbermittlung success=false and 'invalid_data' if no Finanzamt found", async () => {
      const requestDataWithNonExistentAddress = structuredClone(
        registerGewerbeSampleRequestAllFieldsFilled,
      );

      requestDataWithNonExistentAddress.unternehmensDaten.adresseAbweichend = undefined;

      requestDataWithNonExistentAddress.persönlicheDaten.adresse = {
        postleitzahl: "00000",
        ort: "Nonexistent Ort",
        strasseUndHausnummer: "Nonexistent Street 1",
      };

      const response = await postRegisterGewerbe(requestDataWithNonExistentAddress);
      const json = await response.json();

      expect(json.fseÜbermittlung.success).toBe(false);
      expect(json.fseÜbermittlung.errorType).toEqual(ErrorTypeSchema.enum.invalid_data);
      expect(json.fseÜbermittlung.info).toEqual("No Finanzamt found for address");
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
