import { describe, it, expect, vi } from "vitest";

const { mockGetLocationsDetails, mockGetGewerbeamt, mockGetRoutes } = vi.hoisted(() => ({
  mockGetLocationsDetails: vi
    .fn()
    .mockResolvedValue([{ ars: "030460014004", name: "Cottbus, Stadt", plz: "03046" }]),
  mockGetGewerbeamt: vi.fn().mockResolvedValue({
    name: "Stadt Fulda",
    adresse: { strasse: "Schlossstraße", hausnummer: "1", postleitzahl: "36037", ort: "Fulda" },
    telefon: "0661 102-0",
    onlineServices: [],
  }),
  mockGetRoutes: vi.fn(),
}));

vi.mock("../../clients/pvogClient", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../clients/pvogClient")>()),
  getLocationsDetails: mockGetLocationsDetails,
  getGewerbeamt: mockGetGewerbeamt,
}));

vi.mock("../../clients/fitConnectClient/fitConnectClient", () => ({
  getFitConnectClient: () => ({ getRoutes: mockGetRoutes }),
}));

import { getGewerbeRoutingInfo } from "./getGewerbeRoutingInfo";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";

describe("getGewerbeRoutingInfo", () => {
  describe("AGS (Amtlicher Gemeindeschlüssel)", () => {
    it("uses persönlicheDaten.adresse.postleitzahl when no adresseAbweichend", async () => {
      await getGewerbeRoutingInfo({
        ...registerGewerbeSampleRequestAllFieldsFilled,
        persönlicheDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.persönlicheDaten,
          adresse: { strasseUndHausnummer: "Marktstraße 1", postleitzahl: "25813", ort: "Husum" },
        },
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          adresseAbweichend: undefined,
        },
      });

      expect(mockGetLocationsDetails).toHaveBeenCalledWith({
        plz: "25813",
        ort: "Husum",
        strasse: "Marktstraße",
        hausnummer: "1",
      });
    });

    it("uses adresseAbweichend.postleitzahl when provided", async () => {
      await getGewerbeRoutingInfo({
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          adresseAbweichend: {
            strasseUndHausnummer: "Dorfstraße 1",
            postleitzahl: "25842",
            ort: "Lütjenholm",
          },
        },
      });

      expect(mockGetLocationsDetails).toHaveBeenCalledWith({
        plz: "25842",
        ort: "Lütjenholm",
        strasse: "Dorfstraße",
        hausnummer: "1",
      });
    });

    it("throws when no location is found for the address", async () => {
      mockGetLocationsDetails.mockResolvedValueOnce([]);

      await expect(
        getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled),
      ).rejects.toThrow("No location found for zip code");
    });
  });

  describe("Gewerbeamt lookup", () => {
    it("looks up the Gewerbeamt by the resolved ARS and returns it", async () => {
      const result = await getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled);

      expect(mockGetGewerbeamt).toHaveBeenCalledWith("030460014004");
      expect(result.gewerbeamt).toEqual({
        name: "Stadt Fulda",
        adresse: { strasse: "Schlossstraße", hausnummer: "1", postleitzahl: "36037", ort: "Fulda" },
        telefon: "0661 102-0",
        onlineServices: [],
      });
    });

    it("propagates any error from the Gewerbeamt lookup", async () => {
      mockGetGewerbeamt.mockRejectedValueOnce(new Error("Gewerbeamt lookup failed"));

      await expect(
        getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled),
      ).rejects.toThrow("Gewerbeamt lookup failed");
    });
  });

  describe("FIT-Connect routing", () => {
    const requestWithFitConnectSupport = {
      ...registerGewerbeSampleRequestAllFieldsFilled,
      persönlicheDaten: {
        ...registerGewerbeSampleRequestAllFieldsFilled.persönlicheDaten,
        adresse: {
          ...registerGewerbeSampleRequestAllFieldsFilled.persönlicheDaten.adresse,
          postleitzahl: "00000",
        },
      },
      unternehmensDaten: {
        ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
        adresseAbweichend: undefined,
      },
    };

    it("returns destinationId from the first route when FIT-Connect is supported", async () => {
      mockGetRoutes.mockResolvedValueOnce({
        count: 1,
        offset: 0,
        totalCount: 1,
        routes: [
          { destinationId: "mock-destination-id", destinationSignature: "sig.nat.ure" },
          { destinationId: "mock-destination-id2", destinationSignature: "sig.nat.ure" },
        ],
      });

      const result = await getGewerbeRoutingInfo(requestWithFitConnectSupport);

      expect(result.fitConnectDestinationInformation!.destinationId).toBe("mock-destination-id");
      expect(result.ags).toBe("03046004");
    });

    it("throws when FIT-Connect returns no routes for the AGS", async () => {
      mockGetRoutes.mockResolvedValueOnce({ count: 0, offset: 0, totalCount: 0, routes: [] });

      await expect(getGewerbeRoutingInfo(requestWithFitConnectSupport)).rejects.toThrow(
        "No FIT-Connect destination found for AGS 03046004",
      );
    });
  });
});
