import { describe, test, expect } from "vitest";
import supertest from "supertest";

import app from "./app";

const request = supertest(app);

describe("API tests", () => {
  test("Returns 404 NOT FOUND on unsupported route", async () => {
    const response = await request.get("/unsupported-url").send();
    expect(response.statusCode).toEqual(404);
  });

  test("Returns 200 OK and JSON on POST to /register-steuernummer", async () => {
    const response = await request.post("/api/v1/register-steuernummer").send();
    expect(response.statusCode).toEqual(200);
    expect(response.header["content-type"]).toMatch(/json/);
  });

  test("Returns 200 OK and JSON on POST to /register-gewerbe", async () => {
    const response = await request.post("/api/v1/register-gewerbe").send();
    expect(response.statusCode).toEqual(200);
    expect(response.header["content-type"]).toMatch(/json/);
  });
});
