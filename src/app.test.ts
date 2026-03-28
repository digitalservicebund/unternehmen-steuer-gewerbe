import { describe, test, expect } from "vitest";
import supertest from "supertest";

import app from "./app.js";

let request = supertest(app);

describe("API tests", () => {
  test("Returns 404 NOT FOUND on unsupported route", async () => {
    const response = await request.get("/unsupported-url").send();
    expect(response.statusCode).toEqual(404);
  });

  test("Returns 200 OK on POST to /register-steuernummer", async () => {
    const response = await request.post("/register-steuernummer").send();
    expect(response.statusCode).toEqual(200);
  });
});
