import { describe, it, expect } from "vitest";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import app from "../../app";

interface RegionResponseBody {
  supported: boolean;
  finanzaemter: Record<string, unknown>[];
  gewerbeaemter: Record<string, unknown>[];
}

async function requestRegion(path: string) {
  const response = await app.request(path);
  const body = (await response.json()) as RegionResponseBody;
  return { response, body };
}

describe("Route /api/v1/region/{plz}", () => {
  it("Returns supported:true and the responsible Finanz- & Gewerbeamt for a supported region with the PLZ 25811", async () => {
    const { response, body } = await requestRegion("/api/v1/region/25813");

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.headers.get("content-type")).toMatch(/json/);
    expect(body.supported).toBe(true);
    expect(Array.isArray(body.finanzaemter)).toBe(true);
    expect(Array.isArray(body.gewerbeaemter)).toBe(true);
    expect(body.gewerbeaemter.length).toBeGreaterThanOrEqual(1);
    expect(body.gewerbeaemter[0]).toMatchObject({ name: expect.any(String) });
    expect(body.finanzaemter.length).toBe(1);
    expect(body.finanzaemter[0]).toMatchObject({ name: expect.any(String) });
  });

  it("Returns supported:false and the responsible Finanz- & Gewerbeamt for a unsupported region with the PLZ 89073", async () => {
    const { response, body } = await requestRegion("/api/v1/region/89073");

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.supported).toBe(false);
    expect(body.gewerbeaemter.length).toBeGreaterThanOrEqual(1);
    expect(body.finanzaemter.length).toBeGreaterThanOrEqual(1);
  });

  it("Returns supported:false and empty arrays for the non-existent PLZ 00000", async () => {
    const { response, body } = await requestRegion("/api/v1/region/00000");

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.supported).toBe(false);
    expect(body.gewerbeaemter).toEqual([]);
  });

  it("Returns 4 Gewerbeämter for every municipality a PLZ 25813 spans", async () => {
    const { body } = await requestRegion("/api/v1/region/25813");

    expect(body.gewerbeaemter.length).toEqual(4);
  });

  it("Narrows the Gewerbe- and Finanzamt when street and house number are given", async () => {
    const { response, body } = await requestRegion(
      "/api/v1/region/25813?strasse=Marktstraße&hausnummer=1",
    );
    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.gewerbeaemter.length).toEqual(1);
    expect(body.finanzaemter.length).toBeGreaterThanOrEqual(1);
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
