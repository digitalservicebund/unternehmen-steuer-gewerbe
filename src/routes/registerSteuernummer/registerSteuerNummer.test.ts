import { describe, test, expect } from "vitest";
import app from "../../app";

describe("Route /api/v1/register-steuernummer", () => {
  test("Returns 501 NOT IMPLEMENTED on POST", async () => {
    const response = await app.request("/api/v1/register-steuernummer", {
      method: "POST",
    });
    expect(response.status).toEqual(501);
  });
});
