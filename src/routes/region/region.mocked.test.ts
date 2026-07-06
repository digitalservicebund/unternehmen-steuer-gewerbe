import { beforeEach, describe, expect, it, vi } from "vitest";

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

const FINANZAMT_DETAILS = {
  name: "Finanzamt Fulda",
  hausanschrift: { strasse: "Eurostraße", hausnummer: "2", postleitzahl: "36037", ort: "Fulda" },
  telefonnummer: "0661 1234",
};

const GEWERBEAMT = {
  name: "Gewerbeamt Fulda",
  adresse: { strasse: "Amtstraße", hausnummer: "1", postleitzahl: "36037", ort: "Fulda" },
  telefon: "0661 102-0",
  email: "amt@fulda.de",
  onlineServices: [{ uri: "https://example.org" }],
};

type RegionResponseBody = z.infer<typeof RegionResponseSchema>;

async function requestRegionForPostleitzahl36037(path = "/api/v1/region/36037") {
  const response = await app.request(path);
  const body = (await response.json()) as RegionResponseBody;
  return { response, body };
}

describe("Route /api/v1/region/{plz} with mocked upstreams", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockGetLocationsDetails.mockResolvedValue([
      { ars: "066310009009", name: "Fulda, Stadt", plz: "36037" },
    ]);
    mockGetGewerbeamt.mockResolvedValue(GEWERBEAMT);
    mockGetFinanzamtId.mockReturnValue(["FA1"]);
    mockGetFinanzamtDetailsById.mockReturnValue(FINANZAMT_DETAILS);
  });

  it("returns 200 with empty gewerbeaemter but still all finanzaemter when the PVOG location lookup fails", async () => {
    mockGetLocationsDetails.mockRejectedValue(new Error("PVOG unavailable"));

    const { response, body } = await requestRegionForPostleitzahl36037();

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.gewerbeaemter).toEqual([]);
    expect(body.finanzaemter.length).toBeGreaterThanOrEqual(1);
  });

  it("returns 200 with empty finanzaemter but still all gewerbeaemter when the Finanzamt lookup throws", async () => {
    mockGetFinanzamtId.mockImplementation(() => {
      throw new Error("Finanzamt data error");
    });

    const { response, body } = await requestRegionForPostleitzahl36037();

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.finanzaemter).toEqual([]);
    expect(body.gewerbeaemter.length).toBeGreaterThanOrEqual(1);
  });

  it("still returns the other Gewerbeamt when one of two Gewerbeamt lookups fails", async () => {
    mockGetLocationsDetails.mockResolvedValue([
      { ars: "066310009009", name: "Gewerbeamt Nr. 1", plz: "36037" },
      { ars: "066310010010", name: "Gewerbeamt Nr. 2", plz: "36037" },
    ]);
    mockGetGewerbeamt
      .mockRejectedValueOnce(new Error("first Gewerbeamt lookup failed"))
      .mockResolvedValueOnce({ ...GEWERBEAMT, name: "Gewerbeamt Nr. 2" });

    const { body } = await requestRegionForPostleitzahl36037();

    expect(body.gewerbeaemter).toHaveLength(1);
    expect(body.gewerbeaemter[0]).toMatchObject({ name: "Gewerbeamt Nr. 2" });
  });

  it("includes email and online service links and joins street with house number for Gewerbeämter", async () => {
    const { body } = await requestRegionForPostleitzahl36037();

    expect(body.gewerbeaemter[0]).toEqual({
      name: "Gewerbeamt Fulda",
      strasseUndHausnummer: "Amtstraße 1",
      postleitzahl: "36037",
      ort: "Fulda",
      telefon: "0661 102-0",
      email: "amt@fulda.de",
      onlineServices: [{ uri: "https://example.org" }],
    });
  });
});
