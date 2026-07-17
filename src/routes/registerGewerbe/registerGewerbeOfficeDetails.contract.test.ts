import { describe, it, expect } from "vitest";
import app from "../../app";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";
import { ErrorTypeSchema } from "./registerGewerbeInterfaces";

function postRegisterGewerbe(data = registerGewerbeSampleRequestAllFieldsFilled) {
  return app.request("/api/v1/register-gewerbe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

describe(
  "Route /api/v1/register-gewerbe (full Kombiantrag) — Finanzamt and Gewerbeamt details",
  { timeout: 15_000 },
  () => {
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
      expect(json.gewerbeanmeldung.officeDetails!.strasseUndHausnummer).toEqual("Schlossstraße 1");
      expect(json.gewerbeanmeldung.officeDetails!.postleitzahl).toEqual("36037");
      expect(json.gewerbeanmeldung.officeDetails!.ort).toEqual("Fulda");
      expect(json.gewerbeanmeldung.officeDetails!.telefon).toEqual("0661 102-0");
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
  },
);
