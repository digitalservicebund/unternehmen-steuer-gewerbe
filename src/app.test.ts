import { describe, test, expect } from "vitest";
import supertest from "supertest";

import app from "./app.js";

let request = supertest(app);

describe("API tests", () => {
  test("Returns OK 200", async () => {
    const response = await request.get("/api/v1/test");
    expect(response.statusCode).toEqual("200");
  });
});
