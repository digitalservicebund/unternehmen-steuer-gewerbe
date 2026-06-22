import { describe, it, expect, vi } from "vitest";

const { mockGetAGSandARS, mockGetGewerbeamt, mockGetRoutes } = vi.hoisted(() => ({
  mockGetAGSandARS: vi.fn().mockResolvedValue({ ags: "03046001", ars: "030460014004" }),
  mockGetGewerbeamt: vi.fn().mockResolvedValue({
    name: "Gewerbeamt Cottbus",
    adresse: { strasse: "Marktplatz", hausnummer: "1", postleitzahl: "03046", ort: "Cottbus" },
    telefon: "0355 612-0",
    onlineServiceLinks: [],
  }),
  mockGetRoutes: vi.fn(),
}));

vi.mock("../../clients/pvogClient", () => ({
  getAGSandARS: mockGetAGSandARS,
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
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          adresseAbweichend: undefined,
        },
      });

      expect(mockGetAGSandARS).toHaveBeenCalledWith(
        registerGewerbeSampleRequestAllFieldsFilled.persönlicheDaten.adresse.postleitzahl,
      );
    });

    it("uses adresseAbweichend.postleitzahl when provided", async () => {
      await getGewerbeRoutingInfo({
        ...registerGewerbeSampleRequestAllFieldsFilled,
        unternehmensDaten: {
          ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten,
          adresseAbweichend: {
            ...registerGewerbeSampleRequestAllFieldsFilled.unternehmensDaten.adresseAbweichend!,
            postleitzahl: "10969",
          },
        },
      });

      expect(mockGetAGSandARS).toHaveBeenCalledWith("10969");
    });
  });

  describe("Gewerbeamt lookup", () => {
    it("looks up the Gewerbeamt by the resolved ARS and returns it", async () => {
      const result = await getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled);

      expect(mockGetGewerbeamt).toHaveBeenCalledWith("030460014004");
      expect(result.gewerbeamt).toEqual({
        name: "Gewerbeamt Cottbus",
        adresse: { strasse: "Marktplatz", hausnummer: "1", postleitzahl: "03046", ort: "Cottbus" },
        telefon: "0355 612-0",
        onlineServiceLinks: [],
      });
    });

    it("propagates errors from the Gewerbeamt lookup", async () => {
      mockGetGewerbeamt.mockRejectedValueOnce(new Error("PVOG unavailable"));

      await expect(
        getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled),
      ).rejects.toThrow("PVOG unavailable");
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
      expect(result.ags).toBe("03046001");
    });

    it("throws when FIT-Connect returns no routes for the AGS", async () => {
      mockGetRoutes.mockResolvedValueOnce({ count: 0, offset: 0, totalCount: 0, routes: [] });

      await expect(getGewerbeRoutingInfo(requestWithFitConnectSupport)).rejects.toThrow(
        "No FIT-Connect destination found for AGS 03046001",
      );
    });
  });
});
