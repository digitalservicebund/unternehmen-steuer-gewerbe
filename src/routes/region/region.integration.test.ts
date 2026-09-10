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

async function requestRegionForPostleitzahl36037() {
  const response = await app.request("/api/v1/region/36037");
  const body = (await response.json()) as RegionResponseBody;
  return { response, body };
}

async function requestRegion36037ForAllMatches() {
  const response = await app.request("/api/v1/region/36037?getAllOffices=true");
  const body = (await response.json()) as RegionResponseBody;
  return { response, body };
}

async function requestRegionResolvingTo(plz: string, arsValues: string[]) {
  mockGetLocationsDetails.mockResolvedValue(
    arsValues.map((ars) => ({ ars, name: "Kommune", plz })),
  );

  const response = await app.request(`/api/v1/region/${plz}`);
  const body = (await response.json()) as RegionResponseBody;
  return { response, body };
}

describe("Route /api/v1/region/{plz} with mocked upstreams", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockGetLocationsDetails.mockResolvedValue([
      { ars: "066310009009", name: "Fulda, Stadt", plz: "36037" },
      { ars: "066310010010", name: "Petersberg", plz: "36037" },
    ]);
    mockGetGewerbeamt.mockResolvedValue(GEWERBEAMT);
    mockGetFinanzamtId.mockReturnValue(["FA1"]);
    mockGetFinanzamtDetailsById.mockReturnValue(FINANZAMT_DETAILS);
  });

  describe("returning only the single best match by default", () => {
    it("returns only the single best matching Gewerbeamt", async () => {
      const { body } = await requestRegionForPostleitzahl36037();

      expect(body.gewerbeaemter).toHaveLength(1);
    });

    it("returns only the single best matching Finanzamt", async () => {
      mockGetFinanzamtId.mockReturnValue(["FA1", "FA2"]);

      const { body } = await requestRegionForPostleitzahl36037();

      expect(body.finanzaemter).toHaveLength(1);
      expect(mockGetFinanzamtDetailsById).toHaveBeenCalledTimes(1);
      expect(mockGetFinanzamtDetailsById).toHaveBeenCalledWith("FA1");
    });

    it("returns 200 with empty gewerbeaemter, without logging an error, when the Gewerbeamt lookup returns undefined", async () => {
      mockGetGewerbeamt.mockResolvedValue(undefined);
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const { response, body } = await requestRegionForPostleitzahl36037();

      expect(response.status).toEqual(HttpStatusCode.Ok);
      expect(body.gewerbeaemter).toEqual([]);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  it("returns all Gewerbeaemter when getAllOffices is true", async () => {
    mockGetLocationsDetails.mockResolvedValue([
      { ars: "066310009009", name: "Fulda, Stadt", plz: "36037" },
      { ars: "066310010010", name: "Petersberg", plz: "36037" },
    ]);

    const { body } = await requestRegion36037ForAllMatches();

    expect(body.gewerbeaemter).toHaveLength(2);
  });

  it("returns all Finanzaemter when getAllOffices is true", async () => {
    mockGetFinanzamtId.mockReturnValue(["FA1", "FA2"]);

    const { body } = await requestRegion36037ForAllMatches();

    expect(body.finanzaemter).toHaveLength(2);
  });

  it("returns 200 with empty gewerbeaemter but still all finanzaemter when the PVOG location lookup returns an empty array", async () => {
    mockGetLocationsDetails.mockResolvedValue([]);

    const { response, body } = await requestRegion36037ForAllMatches();

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.gewerbeaemter).toEqual([]);
    expect(body.finanzaemter.length).toBeGreaterThanOrEqual(1);
  });

  it("returns 200 with empty finanzaemter but still all gewerbeaemter when the Finanzamt lookup returns an empty array", async () => {
    mockGetFinanzamtId.mockReturnValue([]);

    const { response, body } = await requestRegion36037ForAllMatches();

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.finanzaemter).toEqual([]);
    expect(body.gewerbeaemter.length).toBeGreaterThanOrEqual(1);
  });

  it("still returns the other Gewerbeamt when one of two Gewerbeamt lookups returns undefined", async () => {
    mockGetLocationsDetails.mockResolvedValue([
      { ars: "066310009009", name: "Gewerbeamt Nr. 1", plz: "36037" },
      { ars: "066310010010", name: "Gewerbeamt Nr. 2", plz: "36037" },
    ]);
    mockGetGewerbeamt
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ ...GEWERBEAMT, name: "Gewerbeamt Nr. 2" });

    const { body } = await requestRegion36037ForAllMatches();

    expect(body.gewerbeaemter).toHaveLength(1);
    expect(body.gewerbeaemter[0]).toMatchObject({ name: "Gewerbeamt Nr. 2" });
  });

  it("returns all Gewerbeamt fields, joining street and house number", async () => {
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

  describe("determining whether the resolved Kommune is supported", () => {
    it("returns supported:true for Dresden 146120000000", async () => {
      const { body } = await requestRegionResolvingTo("01067", ["146120000000"]);

      expect(body.supported).toBe(true);
    });

    // A PLZ can span several Kommunen, so a supported Kommune only counts on an unambiguous
    // address. No Dresden PLZ overlaps, hence the constructed match list.
    it("returns supported:false when the address resolves to Dresden 146120000000 and a second Kommune", async () => {
      const { body } = await requestRegionResolvingTo("01067", ["146120000000", "146270210210"]);

      expect(body.supported).toBe(false);
    });

    it("returns supported:false for Fulda 066310009009", async () => {
      const { body } = await requestRegionResolvingTo("36037", ["066310009009"]);

      expect(body.supported).toBe(false);
    });

    it("returns supported:false for Ulm 084210000000", async () => {
      const { body } = await requestRegionResolvingTo("89073", ["084210000000"]);

      expect(body.supported).toBe(false);
    });

    it("returns supported:true for Am Ende 3 in 01277 Dresden", async () => {
      // PVOG resolves this address to two ARS: Dresden and, spuriously, Delligsen in Niedersachsen
      mockGetLocationsDetails.mockResolvedValue([
        {
          ars: "146120000000",
          arsFederalstate: "14",
          name: "Dresden 'Gruna'",
          gemeinde: "Stadt Dresden",
          plz: "01277",
          strasse: "Am Ende",
          koordinaten: ["13.79163", "51.033696"],
        },
        {
          ars: "032550008008",
          arsFederalstate: "03",
          name: "Delligsen 'Ammensen'",
          gemeinde: "Delligsen, Flecken",
          plz: "31073",
          strasse: "Am Ende",
          hausnummer: "3",
          koordinaten: ["9.854299", "51.908625"],
        },
      ]);
      mockGetGewerbeamt.mockImplementation(async (ars: string) => {
        if (ars === "146120000000") {
          return {
            name: "Abteilung Gewerbeangelegenheiten",
            adresse: {
              strasse: "Augsburger Straße",
              hausnummer: "3",
              postleitzahl: "01309",
              ort: "Dresden",
            },
            telefon: "+49 351 4885811",
            email: "gewerbeangelegenheiten@dresden.de",
          };
        }
        return {
          name: "Flecken Delligsen - Fachbereich 1 Bürger-Service",
          adresse: {
            strasse: "Schulstraße",
            hausnummer: "2",
            postleitzahl: "31073",
            ort: "Delligsen",
          },
          onlineServices: [
            {
              title: "SEPA-Lastschriftmandat",
              description:
                "Haben Sie ein Servicekonto Niedersachsen eingerichtet, können Sie den gesamten Vorgang Online einreichen. Die Einrichtung eines Servicekontos Niedersachsen ist kostenlos.\nSollte dieses nicht der Fall sein, können Sie Online Ihr SEPA-Lastschriftmandat ausfüllen, müssen dieses aber ausdrucken und anschließend unterschrieben bei uns einreichen. Eine Unterschrift ist zwingend erforderlich.",
              uri: "https://www.delligsen.de/buergerservice/online/angebot/sepa-lastschriftmandat-900000003-25601.html",
            },
            {
              title:
                "Netzwerk Einheitlicher Ansprechpartner der EU-DLR für die Unterstützung der einfachen Abwicklung von Verwaltungsverfahren nutzen",
              uri: "https://bcl.efa.niedersachsen.de/?verfahrenId=3998&startAPI=https%253A%252F%252Fwww.navo.niedersachsen.de%252Fnavo2%252Fportal%252Fa3start%252F242060%252Fapi1#/intro",
            },
            {
              title: "Gewerbean-, um- und abmeldung",
              description: "Gewerbe anmelden, ummelden oder abmelden",
              uri: "https://www.delligsen.de/buergerservice/online/angebot/gewerbean-um-und-abmeldung-900000031-25601.html",
            },
          ],
        };
      });
      mockGetFinanzamtId.mockReturnValue(["FA-DD-SUED"]);
      mockGetFinanzamtDetailsById.mockReturnValue({
        name: "Finanzamt Dresden-Süd",
        hausanschrift: {
          strasse: "Rabenerstraße",
          hausnummer: "1",
          postleitzahl: "01069",
          ort: "Dresden",
        },
        telefonnummer: "0351 4691-0",
      });

      const response = await app.request(
        "/api/v1/region/01277?ort=Dresden&strasse=Am+Ende&hausnummer=3&getAllOffices=true",
      );
      const body = (await response.json()) as RegionResponseBody;

      expect(body.supported).toBe(true);
    });

    it("returns supported:true for Wiesenstr. 1 in 01277 Dresden", async () => {
      // "Name" is not plain "Dresden", but "Dresden 'Gruna'"
      mockGetLocationsDetails.mockResolvedValue([
        {
          ars: "146120000000",
          arsFederalstate: "14",
          name: "Dresden 'Gruna'",
          gemeinde: "Stadt Dresden",
          plz: "01277",
          strasse: "Wiesenstraße",
          hausnummer: "1",
          koordinaten: ["13.778885", "51.035315"],
        },
      ]);
      mockGetGewerbeamt.mockResolvedValue({
        name: "Abteilung Gewerbeangelegenheiten",
        adresse: {
          strasse: "Augsburger Straße",
          hausnummer: "3",
          postleitzahl: "01309",
          ort: "Dresden",
        },
        telefon: "+49 351 4885811",
        email: "gewerbeangelegenheiten@dresden.de",
      });
      mockGetFinanzamtId.mockReturnValue(["FA-DD-SUED"]);
      mockGetFinanzamtDetailsById.mockReturnValue({
        name: "Finanzamt Dresden-Süd",
        hausanschrift: {
          strasse: "Rabenerstraße",
          hausnummer: "1",
          postleitzahl: "01069",
          ort: "Dresden",
        },
        telefonnummer: "0351 4691-0",
      });

      const response = await app.request(
        "/api/v1/region/01277?ort=Dresden&strasse=Wiesenstr.&hausnummer=1",
      );
      const body = (await response.json()) as RegionResponseBody;

      expect(body.supported).toBe(true);
    });

    it("returns the responsible Gewerbeamt and Finanzamt for an unsupported Kommune", async () => {
      const { body } = await requestRegionResolvingTo("89073", ["084210000000"]);

      expect(body.gewerbeaemter).toHaveLength(1);
      expect(body.finanzaemter).toHaveLength(1);
    });
  });

  it("returns supported:false and empty arrays when neither lookup finds a match", async () => {
    mockGetLocationsDetails.mockResolvedValue([]);
    mockGetFinanzamtId.mockReturnValue([]);

    const response = await app.request("/api/v1/region/00000");
    const body = (await response.json()) as RegionResponseBody;

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(body.supported).toBe(false);
    expect(body.gewerbeaemter).toEqual([]);
    expect(body.finanzaemter).toEqual([]);
  });

  it('returns 400 for an invalid PLZ "abc"', async () => {
    const response = await app.request("/api/v1/region/abc");
    expect(response.status).toEqual(HttpStatusCode.BadRequest);
  });

  it("returns 400 for PLZ 1234 (too short)", async () => {
    const response = await app.request("/api/v1/region/1234");
    expect(response.status).toEqual(HttpStatusCode.BadRequest);
  });
});
