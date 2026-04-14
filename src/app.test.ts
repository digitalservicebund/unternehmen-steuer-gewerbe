import { describe, test, expect } from "vitest";
// import supertest from "supertest";

import app from "./app";

// const request = supertest(app);

describe("API tests", () => {
  test("Returns 404 NOT FOUND on unsupported route", async () => {
    const response = await app.request("/unsupported-url");
    expect(response.status).toEqual(404);
  });

  describe("Route /", () => {
    test("Returns 200 OK and status JSON on GET (kubernetes health check)", async () => {
      const response = await app.request("/");
      expect(response.status).toEqual(200);
      expect(response.headers.get("content-type")).toMatch(/json/);
      expect(await response.json()).toEqual({ status: "ok" });
    });

    test("Returns fitConnectEnvironment on GET to /?verbose=true", async () => {
      const response = await app.request("/?verbose=true");
      expect(response.status).toEqual(200);
      expect(await response.json()).toEqual({
        status: "ok",
        fitConnectEnvironment: expect.any(String),
      });
    });
  });

  describe("Route /api/v1/register-steuernummer", () => {
    test("Returns 200 OK and JSON on POST", async () => {
      const response = await app.request("/api/v1/register-steuernummer", {
        method: "POST",
      });
      expect(response.status).toEqual(200);
      expect(response.headers.get("content-type")).toMatch(/json/);
    });
  });

  describe("Route /api/v1/register-gewerbe", () => {
    test("Returns 200 OK and JSON on POST", async () => {
      const testData = {
        antragsteller: {
          vorname: "Erika",
          nachname: "Mustermann",
          geburtsdatum: "1985-08-12",
          adresse: {
            strasseHausnummer: "Musterstraße 1",
            plz: "12345",
            ort: "Musterstadt",
          },
        },
        antrag: "Hello FIT-Connect",
      };
      const response = await app.request("/api/v1/register-gewerbe", {
        method: "POST",
        body: JSON.stringify(testData),
      });
      expect(response.status).toEqual(200);
      expect(response.headers.get("content-type")).toMatch(/json/);
    });
  });

  test("Returns 200 OK on GET with /:submissionId/events", async () => {
    const response = await app.request(
      "/api/v1/register-gewerbe/0b0dd73c-2379-4ba6-a02b-385f7c23102c/events",
    );
    expect(response.status).toEqual(200);
  });
});
