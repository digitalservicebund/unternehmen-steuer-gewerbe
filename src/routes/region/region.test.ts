import { describe, test, expect } from "vitest";
import app from "../../app";

describe("Route /api/v1/region/{plz}", () => {
  test("Returns supported:true for a supported PLZ", async () => {
    const response = await app.request("/api/v1/region/10969");
    expect(response.status).toEqual(200);
    expect(response.headers.get("content-type")).toMatch(/json/);
    expect(await response.json()).toEqual({ supported: true });
  });

  test("Returns supported:false for an unsupported 5-digit PLZ", async () => {
    const response = await app.request("/api/v1/region/99999");
    expect(response.status).toEqual(200);
    expect(await response.json()).toEqual({ supported: false });
  });

  test("Returns 400 for an invalid PLZ format", async () => {
    const response = await app.request("/api/v1/region/abc");
    expect(response.status).toEqual(400);
  });

  test("Returns 400 for a 4-digit PLZ (too short)", async () => {
    const response = await app.request("/api/v1/region/1234");
    expect(response.status).toEqual(400);
  });
});
