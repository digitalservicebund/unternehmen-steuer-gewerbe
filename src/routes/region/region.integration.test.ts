import { afterEach, describe, expect, it, vi } from "vitest";

const {
  mockGetLocationsDetails,
  mockGetGewerbeamt,
  mockGetFinanzamtId,
  mockGetFinanzamtDetailsById,
} = vi.hoisted(() => ({
  mockGetLocationsDetails: vi.fn(),
  mockGetGewerbeamt: vi.fn(),
  mockGetFinanzamtId: vi.fn(),
  mockGetFinanzamtDetailsById: vi.fn(),
}));

vi.mock("../../clients/pvogClient", () => ({
  getLocationsDetails: mockGetLocationsDetails,
  getGewerbeamt: mockGetGewerbeamt,
}));

vi.mock("@digitalservicebund/unternehmen-steuer-gewerbe-privat", () => ({
  getFinanzamtId: mockGetFinanzamtId,
  getFinanzamtDetailsById: mockGetFinanzamtDetailsById,
  // stubs for the other exports the register-gewerbe endpoint imports at module load time
  createElsterFsEEUnXml: vi.fn(),
  sendFsE: vi.fn(),
  validateFsE: vi.fn(),
}));

import { type z } from "@hono/zod-openapi";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import app from "../../app";
import { type RegionResponseSchema } from "./regionInterfaces";
import {
  amtMittleresNordfrieslandGewerbeamt,
  dorfstrasseLuetjenholmFinanzamtIds,
  dorfstrasseLuetjenholmLocations,
  finanzamtDetailsFor,
  gewerbeamtFor,
  marktstrasse25813FinanzamtIds,
  marktstrasse25813Locations,
  plz25813FinanzamtIds,
  plz25813Locations,
  plz89073FinanzamtIds,
  plz89073Locations,
} from "./region.fixtures";

type RegionResponseBody = z.infer<typeof RegionResponseSchema>;

async function requestRegion(plz: string, queryString = "") {
  const response = await app.request(`/api/v1/region/${plz}${queryString}`);
  const body = (await response.json()) as RegionResponseBody;
  return { response, body };
}

// Mocked counterpart of region.contract.test.ts - same scenarios and assertions, against
// pvogClient/ERiC fixtures instead of a live call. Route orchestration logic in general
// (best-match limiting, error handling, ...) is already covered by region.unit.test.ts.
describe("Route /api/v1/region/{plz}", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Returns 200 with supported:true and the names of the responsible Finanz- & Gewerbeämter for the supported PLZ 25813", async () => {
    mockGetLocationsDetails.mockResolvedValue(plz25813Locations);
    mockGetGewerbeamt.mockResolvedValue(
      gewerbeamtFor("Amt Mittleres Nordfriesland - Ordnungsabteilung"),
    );
    mockGetFinanzamtId.mockReturnValue(plz25813FinanzamtIds);
    mockGetFinanzamtDetailsById.mockReturnValue(finanzamtDetailsFor("Finanzamt Husum"));

    const { response, body } = await requestRegion("25813", "?getAllOffices=true");

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.supported).toBe(true);
    expect(body.gewerbeaemter).toHaveLength(4);
    expect(body.gewerbeaemter[0]).toMatchObject({ name: expect.any(String) });
    expect(body.finanzaemter).toHaveLength(1);
    expect(body.finanzaemter[0]).toMatchObject({ name: expect.any(String) });
  });

  it("Returns 200 with supported:false and the responsible Finanz- & Gewerbeamt for a unsupported region with the PLZ 89073", async () => {
    mockGetLocationsDetails.mockResolvedValue(plz89073Locations);
    mockGetGewerbeamt.mockResolvedValue(gewerbeamtFor("Gewerbeamt Ulm"));
    mockGetFinanzamtId.mockReturnValue(plz89073FinanzamtIds);
    mockGetFinanzamtDetailsById.mockReturnValue(finanzamtDetailsFor("Finanzamt Ulm"));

    const { response, body } = await requestRegion("89073");

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.supported).toBe(false);
    expect(body.gewerbeaemter).toHaveLength(1);
    expect(body.finanzaemter).toHaveLength(1);
  });

  it("Returns 200 with supported:false and empty arrays for the non-existent PLZ 00000", async () => {
    mockGetLocationsDetails.mockResolvedValue([]);
    mockGetFinanzamtId.mockReturnValue([]);

    const { response, body } = await requestRegion("00000");

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.supported).toBe(false);
    expect(body.gewerbeaemter).toEqual([]);
  });

  it("Returns 4 Gewerbeämter for every municipality a PLZ 25813 spans when getAllOffices is true", async () => {
    mockGetLocationsDetails.mockResolvedValue(plz25813Locations);
    mockGetGewerbeamt.mockResolvedValue(
      gewerbeamtFor("Amt Mittleres Nordfriesland - Ordnungsabteilung"),
    );
    mockGetFinanzamtId.mockReturnValue(plz25813FinanzamtIds);
    mockGetFinanzamtDetailsById.mockReturnValue(finanzamtDetailsFor("Finanzamt Husum"));

    const { body } = await requestRegion("25813", "?getAllOffices=true");

    expect(body.gewerbeaemter).toHaveLength(4);
  });

  it("Returns only one Gewerbeamt for PLZ 25813 by default", async () => {
    mockGetLocationsDetails.mockResolvedValue(plz25813Locations);
    mockGetGewerbeamt.mockResolvedValue(
      gewerbeamtFor("Amt Mittleres Nordfriesland - Ordnungsabteilung"),
    );
    mockGetFinanzamtId.mockReturnValue(plz25813FinanzamtIds);
    mockGetFinanzamtDetailsById.mockReturnValue(finanzamtDetailsFor("Finanzamt Husum"));

    const { body } = await requestRegion("25813");

    expect(body.gewerbeaemter).toHaveLength(1);
  });

  it("Returns 200 and only one Gewerbeamt and Finanzamt for PLZ 25813 when street and house number are given", async () => {
    mockGetLocationsDetails.mockResolvedValue(marktstrasse25813Locations);
    mockGetGewerbeamt.mockResolvedValue(gewerbeamtFor("Gewerbeamt Husum"));
    mockGetFinanzamtId.mockReturnValue(marktstrasse25813FinanzamtIds);
    mockGetFinanzamtDetailsById.mockReturnValue(finanzamtDetailsFor("Finanzamt Husum"));

    const { response, body } = await requestRegion("25813", "?strasse=Marktstraße&hausnummer=1");
    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.gewerbeaemter).toHaveLength(1);
    expect(body.finanzaemter).toHaveLength(1);
  });

  it("Returns 200 and one Gewerbeamt for Dorfstraße 1 in 25842 when the ort is given", async () => {
    mockGetLocationsDetails.mockResolvedValue(dorfstrasseLuetjenholmLocations);
    mockGetGewerbeamt.mockResolvedValue(amtMittleresNordfrieslandGewerbeamt);
    mockGetFinanzamtId.mockReturnValue(dorfstrasseLuetjenholmFinanzamtIds);
    mockGetFinanzamtDetailsById.mockReturnValue(finanzamtDetailsFor("Finanzamt Nordfriesland"));

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
