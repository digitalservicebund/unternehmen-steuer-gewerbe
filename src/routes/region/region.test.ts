import { describe, it, expect } from "vitest";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import app from "../../app";

describe("Route /api/v1/region/{plz}", () => {
  it("Returns supported:true for a supported PLZ", async () => {
    const response = await app.request("/api/v1/region/52062");
    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.headers.get("content-type")).toMatch(/json/);
    expect(await response.json()).toEqual({ supported: true });
  });

  it("Returns supported:false for unsupported 00000 PLZ", async () => {
    const response = await app.request("/api/v1/region/00000");
    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(await response.json()).toEqual({ supported: false });
  });

  it('Returns 400 for an invalid PLZ "abc"', async () => {
    const response = await app.request("/api/v1/region/abc");
    expect(response.status).toEqual(HttpStatusCode.BadRequest);
  });

  it("Returns 400 for PLZ 1234 (too short)", async () => {
    const response = await app.request("/api/v1/region/1234");
    expect(response.status).toEqual(HttpStatusCode.BadRequest);
  });
});
