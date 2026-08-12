import { describe, it, expect, vi, afterEach } from "vitest";

// getFinanzamtId/getFinanzamtDetailsById run for real (local BZSt lookup table, no network) so we
// verify the actual Finanzamt selection & officeDetails formatting; only the ERiC send path is mocked.
vi.mock("@digitalservicebund/unternehmen-steuer-gewerbe-privat", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("@digitalservicebund/unternehmen-steuer-gewerbe-privat")
  >()),
  validateFsE: vi.fn().mockReturnValue({ valid: true }),
  createElsterFsEEUnXml: vi.fn().mockReturnValue("<xml/>"),
  sendFsE: vi.fn().mockReturnValue({ success: true }),
}));

import app from "../../app";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";

function postFsEOnly(data = registerGewerbeSampleRequestAllFieldsFilled) {
  return app.request("/api/v1/register-gewerbe?only=fseÜbermittlung", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

describe("Route /api/v1/register-gewerbe — Finanzamt officeDetails (real lookup table, ERiC mocked)", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns Finanzamt details for adresseAbweichend in unternehmensDaten (Prinzessinnenstraße 8-14, 10969 Berlin)", async () => {
    const data = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);
    data.unternehmensDaten.adresseAbweichend = {
      postleitzahl: "10969",
      ort: "Berlin",
      strasseUndHausnummer: "Prinzessinnenstraße 8-14",
    };

    const response = await postFsEOnly(data);
    const json = await response.json();

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(json.fseÜbermittlung.officeDetails).toEqual({
      name: "Finanzamt Friedrichshain-Kreuzberg",
      strasseUndHausnummer: "Mehringdamm 22",
      postleitzahl: "10961",
      ort: "Berlin",
      telefon: "030 9024-14 0",
    });
  });

  it("returns Finanzamt details for adresse in unternehmensDaten (Prinzessinnenstraße 8-14, 10969 Berlin)", async () => {
    const data = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);
    data.unternehmensDaten.adresse = {
      strasse: "Prinzessinnenstraße",
      hausnummer: "8-14",
      postleitzahl: "10969",
      ort: "Berlin",
    };

    const response = await postFsEOnly(data);
    const json = await response.json();

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(json.fseÜbermittlung.officeDetails).toEqual({
      name: "Finanzamt Friedrichshain-Kreuzberg",
      strasseUndHausnummer: "Mehringdamm 22",
      postleitzahl: "10961",
      ort: "Berlin",
      telefon: "030 9024-14 0",
    });
  });

  it("returns Finanzamt details for persönlicheDaten address (Musterstraße 1, 03046 Cottbus)", async () => {
    const data = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);
    data.unternehmensDaten.adresseAbweichend = undefined;

    const response = await postFsEOnly(data);
    const json = await response.json();

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(json.fseÜbermittlung.officeDetails).toEqual({
      name: "Finanzamt Cottbus",
      strasseUndHausnummer: "Vom-Stein-Straße 29",
      postleitzahl: "03050",
      ort: "Cottbus",
      telefon: "0355 4991-4100",
    });
  });
});
