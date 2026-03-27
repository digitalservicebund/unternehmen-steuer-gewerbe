import { describe, test, expect } from "vitest";
import supertest from "supertest";

import app from "./app.js";

let request = supertest(app);

describe("API tests", () => {
  test("Returns 404 NOT FOUND", async () => {
    const response = await request.get("/unsupported-url");
    expect(response.statusCode).toEqual("404");
  });
});
