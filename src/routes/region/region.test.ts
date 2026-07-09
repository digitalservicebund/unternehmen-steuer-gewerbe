import { describe, it, expect } from "vitest";
import { type z } from "@hono/zod-openapi";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import app from "../../app";
import { type RegionResponseSchema } from "./regionInterfaces";

type RegionResponseBody = z.infer<typeof RegionResponseSchema>;

async function requestRegion(plz: string, queryString = "") {
  const response = await app.request(`/api/v1/region/${plz}${queryString}`);
  const body = (await response.json()) as RegionResponseBody;
  return { response, body };
}

describe("Route /api/v1/region/{plz}", () => {
  it("Returns 200 with supported:true and the names of the responsible Finanz- & Gewerbeämter for the supported PLZ 25813", async () => {
    const { response, body } = await requestRegion("25813", "?getAllOffices=true");

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.supported).toBe(true);
    expect(body.gewerbeaemter).toHaveLength(4);
    expect(body.gewerbeaemter[0]).toMatchObject({ name: expect.any(String) });
    expect(body.finanzaemter).toHaveLength(1);
    expect(body.finanzaemter[0]).toMatchObject({ name: expect.any(String) });
  });

  it("Returns 200 with supported:false and the responsible Finanz- & Gewerbeamt for a unsupported region with the PLZ 89073", async () => {
    const { response, body } = await requestRegion("89073");

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.supported).toBe(false);
    expect(body.gewerbeaemter).toHaveLength(1);
    expect(body.finanzaemter).toHaveLength(1);
  });

  it("Returns 200 with supported:false and empty arrays for the non-existent PLZ 00000", async () => {
    const { response, body } = await requestRegion("00000");

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.supported).toBe(false);
    expect(body.gewerbeaemter).toEqual([]);
  });

  it("Returns 4 Gewerbeämter for every municipality a PLZ 25813 spans when getAllOffices is true", async () => {
    const { body } = await requestRegion("25813", "?getAllOffices=true");

    expect(body.gewerbeaemter).toHaveLength(4);
  });

  it("Returns only one Gewerbeamt for PLZ 25813 by default", async () => {
    const { body } = await requestRegion("25813");

    expect(body.gewerbeaemter).toHaveLength(1);
  });

  it("Returns 200 and only one Gewerbeamt and Finanzamt for PLZ 25813 when street and house number are given", async () => {
    const { response, body } = await requestRegion("25813", "?strasse=Marktstraße&hausnummer=1");
    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.gewerbeaemter).toHaveLength(1);
    expect(body.finanzaemter).toHaveLength(1);
  });

  it("Returns 200 and one Gewerbeamt for Dorfstraße 1 in 25842 when the ort is given", async () => {
    const { response, body } = await requestRegion(
      "25842",
      "?strasse=Dorfstraße&hausnummer=1&ort=Lütjenholm",
    );
    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.gewerbeaemter).toHaveLength(1);
    expect(body.gewerbeaemter[0]).toMatchObject({
      name: "Amt Mittleres Nordfriesland - Ordnungsabteilung",
    });
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
