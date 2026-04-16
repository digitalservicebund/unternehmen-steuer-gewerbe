import { describe, test, expect, vi } from "vitest";
import app from "../../app";

describe("Route /api/v1/register-gewerbe", () => {
  const requestData = {
    persönlicheDaten: {
      vorname: "Erika",
      nachname: "Mustermann",
      geburtsdatum: "1985-08-12",
      adresse: {
        strasseUndHausnummer: "Musterstraße 1",
        postleitzahl: "12345",
        ort: "Musterstadt",
      },
      telefon: "007",
      email: "e.mustermann@example.org",
    },
    unternehmensDaten: {
      tätigkeitsbeschreibung: "Vertrieb von Vertriebsmustern",
      artDesUnternehmens: "Handwerksbetrieb",
      adresseAbweichend: {
        strasseUndHausnummer: "Musterstraße 2",
        postleitzahl: "67890",
        ort: "Musterstadt",
      },
    },
  };

  test("Returns 200 OK and JSON with success=true and non-empty submissionId on POST", async () => {
    const response = await app.request("/api/v1/register-gewerbe", {
      method: "POST",
      body: JSON.stringify(requestData),
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
        headers: { "Content-Type": "application/json" },
      }),
    );

    const response = await app.request("/api/v1/register-gewerbe", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
    const json = await response.json();
    expect(response.status).toEqual(500);
    expect(response.headers.get("content-type")).toMatch(/json/);
    expect(json.success).to.equal(false);
    expect(json.info).to.equal("Internal Server Error");

    fetchMock.mockRestore();
  });
});

describe("Route /api/v1/register-gewerbe/:submissionId/events", () => {
  test("Returns 200 OK on GET with /:submissionId/events", async () => {
    const response = await app.request(
      "/api/v1/register-gewerbe/0b0dd73c-2379-4ba6-a02b-385f7c23102c/events",
    );
    expect(response.status).toEqual(200);
  });
});
