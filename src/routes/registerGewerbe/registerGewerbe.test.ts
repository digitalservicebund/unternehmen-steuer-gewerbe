import { describe, test, expect, vi, afterEach, beforeAll } from "vitest";
import app from "../../app";
import * as eric from "../../private/eric/eric";

const registerGewerbeRequestData = {
  persönlicheDaten: {
    vorname: "Erika",
    nachname: "Mustermann",
    geburtsdatum: "1988-09-10",
    geburtsort: "Musterstadt",
    geburtsland: "Deutschland",
    staatsangehörigkeitDeutsch: true,
    adresse: {
      strasseUndHausnummer: "Musterstraße 1",
      postleitzahl: "12345",
      ort: "Musterstadt",
    },
    telefon: "+49 234 121314",
    email: "e.mustermann@example.org",
  },
  unternehmensDaten: {
    tätigkeitsbeschreibung: "Vertrieb von Vertriebsmustern",
    tätigkeitsbereich: "handwerk",
    tätigkeitsbeginn: "2026-04-17",
    gewerbeart: "hauptgewerbe",
    istReisegewerbe: false,
    adresseAbweichend: {
      strasseUndHausnummer: "Musterstraße 2",
      postleitzahl: "67890",
      ort: "Musterstadt",
    },
  },
};

describe("Route /api/v1/register-gewerbe", () => {
  afterEach(() => vi.restoreAllMocks());

  test("Returns 200 with success=true for both services on POST", async () => {
    const response = await app.request("/api/v1/register-gewerbe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerGewerbeRequestData),
    });
    const json = await response.json();
    expect(response.status).toEqual(200);
    expect(json.gewerbeanmeldung.success).toBe(true);
    expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
    expect(json.steuernummer.success).toBe(true);
  });

  test("Returns 200 with gewerbeanmeldung upstream_error when FIT-Connect fails, steuernummer still succeeds", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Server Down" }), { status: 500 }),
    );

    const response = await app.request("/api/v1/register-gewerbe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerGewerbeRequestData),
    });
    const json = await response.json();
    expect(response.status).toEqual(200);
    expect(json.gewerbeanmeldung.success).toBe(false);
    expect(json.gewerbeanmeldung.errorType).toBe("upstream_error");
    expect(json.steuernummer.success).toBe(true);
  });

  test("Returns 200 with steuernummer validation_error when FsE validation fails, gewerbeanmeldung still succeeds", async () => {
    vi.spyOn(eric, "validateFsE").mockReturnValue({
      isValid: false,
      returnCode: 1,
      info: "FsE validation failed",
    });

    const response = await app.request("/api/v1/register-gewerbe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerGewerbeRequestData),
    });
    const json = await response.json();
    expect(response.status).toEqual(200);
    expect(json.steuernummer.success).toBe(false);
    expect(json.steuernummer.errorType).toBe("validation_error");
    expect(json.gewerbeanmeldung.success).toBe(true);
    expect(json.gewerbeanmeldung.submissionId).toBeTruthy();
  });
});

describe("Route /api/v1/register-gewerbe/:submissionId/events", () => {
  let submissionId: string;

  beforeAll(async () => {
    const response = await app.request("/api/v1/register-gewerbe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerGewerbeRequestData),
    });
    expect(response.status).toEqual(200);
    submissionId = (await response.json()).gewerbeanmeldung.submissionId;
    expect(submissionId).toBeDefined();
  });

  test("Returns 200 OK on GET with /:submissionId/events", async () => {
    const response = await app.request(`/api/v1/register-gewerbe/${submissionId}/events`);
    expect(response.status).toEqual(200);
  });
});
