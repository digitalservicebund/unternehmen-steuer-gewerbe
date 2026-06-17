import { describe, it, expect, beforeAll, vi } from "vitest";
import app from "../../app";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import { RegisterGewerbeResponseSchema } from "./registerGewerbeInterfaces";
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

describe("Route /api/v1/register-gewerbe", () => {
  let response: Response;
  let json: z.infer<typeof RegisterGewerbeResponseSchema>;
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

      it("returns Gewerbeanmeldung PDF receipt", async () => {
        expect(json.gewerbeanmeldung.pdfReceiptBase64).toBeTruthy();
        // base64 prefix of '%PDF-'
        expect(json.gewerbeanmeldung.pdfReceiptBase64).toMatch(/^JVBERi0/);
      });
    });

    describe("on returning recipient details", () => {
      it("returns correct Finanzamt details (name, street, zip, city, telephone number) for Postleitzahl 10969", async () => {
        const dataWithPostleitZahl = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);

        dataWithPostleitZahl.unternehmensDaten.adresseAbweichend!.postleitzahl = "10969";

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

      it("returns dummy Gewerbeamt details (name, street, zip, city, telephone number)", () => {
        expect(json.gewerbeanmeldung.officeDetails!.name).toEqual("Gewerbeamt Dummy-Data");
        expect(json.gewerbeanmeldung.officeDetails!.strasseUndHausnummer).toEqual("Dummystraße 2");
        expect(json.gewerbeanmeldung.officeDetails!.postleitzahl).toEqual("22222");
        expect(json.gewerbeanmeldung.officeDetails!.ort).toEqual("Dummy2");
        expect(json.gewerbeanmeldung.officeDetails!.telefon).toEqual("2222-222 222");
      });
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
