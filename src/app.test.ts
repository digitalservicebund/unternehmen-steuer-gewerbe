import { describe, test, expect } from "vitest";

import app from "./app";

describe("App tests", () => {
  test("Returns 404 NOT FOUND on unsupported route", async () => {
    const response = await app.request("/unsupported-url");
    expect(response.status).toEqual(404);
  });
});
