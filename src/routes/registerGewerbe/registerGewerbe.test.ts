import { describe, test, expect, vi, afterEach, beforeAll } from "vitest";
import app from "../../app";
import { RegisterGewerbeRequest } from "./registerGewerbeInterfaces";

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

  test("Returns 200 OK and JSON with success=true and non-empty submissionId on POST", async () => {
    const response = await app.request("/api/v1/register-gewerbe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerGewerbeRequestData),
    });
    const json = await response.json();
    expect(response.status).toEqual(200);
    expect(response.headers.get("content-type")).toMatch(/json/);
    expect(json.success).to.equal(true);
    expect(json.submissionId).toBeTruthy();
  });

  test("Returns 500 Internal Server Error and JSON with success=false and info 'Internal Server Error' on POST when fetch (to fitconnect) fails", async () => {
    // let internal fetch fail with error 500
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Server Down" }), {
        status: 500,
      }),
    );

    const response = await app.request("/api/v1/register-gewerbe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerGewerbeRequestData),
    });
    const json = await response.json();
    expect(response.status).toEqual(500);
    expect(response.headers.get("content-type")).toMatch(/json/);
    expect(json.success).to.equal(false);
    expect(json.info).to.equal("Internal Server Error");

    fetchMock.mockRestore();
  });

  test("Returns 200 OK if istReisegewerbe is not set", async () => {
    const registerGewerbeRequestData: RegisterGewerbeRequest = {
      persönlicheDaten: {
        vorname: "Erika",
        nachname: "Mustermann",
        geburtsname: "Muster",
        geburtsdatum: "1988-09-10",
        geschlecht: "d",
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
        adresseAbweichend: {
          strasseUndHausnummer: "Musterstraße 2",
          postleitzahl: "67890",
          ort: "Musterstadt",
        },
        tätigkeitsbeschreibung: "Vertrieb von Vertriebsmustern",
        tätigkeitsbereich: "handwerk",
        tätigkeitsbeginn: "2026-04-17",
        gewerbeart: "hauptgewerbe",
      },
    };
    const response = await app.request("/api/v1/register-gewerbe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerGewerbeRequestData),
    });

    expect(response.status).toEqual(200);
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
    submissionId = (await response.json()).submissionId;
    expect(submissionId).toBeDefined();
  });

  test("Returns 200 OK on GET with /:submissionId/events", async () => {
    const response = await app.request(`/api/v1/register-gewerbe/${submissionId}/events`);
    expect(response.status).toEqual(200);
  });
});
