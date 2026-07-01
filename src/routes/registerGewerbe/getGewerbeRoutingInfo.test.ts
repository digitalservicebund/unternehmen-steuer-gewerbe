import { describe, it, expect, vi } from "vitest";

const { mockGetAGSandARS, mockGetGewerbeamt, mockGetRoutes } = vi.hoisted(() => ({
  mockGetAGSandARS: vi.fn().mockResolvedValue({ ags: "03046001", ars: "030460014004" }),
  mockGetGewerbeamt: vi.fn().mockResolvedValue({
    name: "Stadt Fulda",
    adresse: { strasse: "Schlossstraße", hausnummer: "1", postleitzahl: "36037", ort: "Fulda" },
    telefon: "0661 102-0",
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
        "Musterstraße",
        "1",
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

      expect(mockGetAGSandARS).toHaveBeenCalledWith("10969", "Musterstraße", "2");
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
        onlineServiceLinks: [],
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
