import { describe, it, expect } from "vitest";
import app from "../../app";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";

function postRegisterGewerbe(data = registerGewerbeSampleRequestAllFieldsFilled) {
  return app.request("/api/v1/register-gewerbe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

describe(
  "Route /api/v1/register-gewerbe (full Kombiantrag) — Gewerbeamt details",
  { timeout: 15_000 },
  () => {
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
  },
);
