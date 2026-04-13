import { describe, test, expect } from "vitest";
import supertest from "supertest";

import app from "./app";

const request = supertest(app);

describe("API tests", () => {
  test("Returns 404 NOT FOUND on unsupported route", async () => {
    const response = await request.get("/unsupported-url").send();
    expect(response.statusCode).toEqual(404);
  });

  test("Returns 200 OK and status JSON on GET to /", async () => {
    const response = await request.get("/").send();
    expect(response.statusCode).toEqual(200);
    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({ status: "ok" });
  });

  test("Returns fitConnectEnvironment on GET to /?verbose=true", async () => {
    const response = await request.get("/?verbose=true").send();
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      status: "ok",
      fitConnectEnvironment: expect.any(String),
    });
  });

  test("Returns 200 OK and JSON on POST to /register-steuernummer", async () => {
    const response = await request.post("/api/v1/register-steuernummer").send();
    expect(response.statusCode).toEqual(200);
    expect(response.header["content-type"]).toMatch(/json/);
  });

  test("Returns 200 OK and JSON on POST to /register-gewerbe", async () => {
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
    const response = await request.post("/api/v1/register-gewerbe").send(testData);
    expect(response.statusCode).toEqual(200);
    expect(response.header["content-type"]).toMatch(/json/);
  });
});

test("Returns 200 OK on GET to /api/v1/register-gewerbe/:submissionId/events", async () => {
  const response = await request
    .get("/api/v1/register-gewerbe/0b0dd73c-2379-4ba6-a02b-385f7c23102c/events")
    .send();
  expect(response.statusCode).toEqual(200);
});
