import { describe, test, expect } from "vitest";
import app from "../../app";

describe("Route /api/v1/register-gewerbe", () => {
  test("Returns 200 OK and JSON with non-empty submissionId on POST", async () => {
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
    const json = await response.json();
    expect(response.status).toEqual(200);
    expect(response.headers.get("content-type")).toMatch(/json/);
    expect(json.submissionId).toBeTruthy();
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
