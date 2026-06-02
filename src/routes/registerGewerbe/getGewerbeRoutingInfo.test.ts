import { describe, it, expect, vi } from "vitest";

const { mockGetAGSandARS, mockGetRoutes } = vi.hoisted(() => ({
  mockGetAGSandARS: vi.fn().mockResolvedValue({ ags: "03046001", ars: "030460014004" }),
  mockGetRoutes: vi.fn(),
}));

vi.mock("../../clients/pvogClient/pvogClient", () => ({
  getAGSandARS: mockGetAGSandARS,
}));

vi.mock("../../clients/fitConnectClient/fitConnectClient", () => ({
  getFitConnectClient: () => ({ getRoutes: mockGetRoutes }),
}));

import { getGewerbeRoutingInfo } from "./getGewerbeRoutingInfo";
import { registerGewerbeCompleteRequest } from "./testHelpers";

const requestWithFitConnectSupport = {
  ...registerGewerbeCompleteRequest,
  persönlicheDaten: {
    ...registerGewerbeCompleteRequest.persönlicheDaten,
    adresse: {
      ...registerGewerbeCompleteRequest.persönlicheDaten.adresse,
      postleitzahl: "00000",
    },
  },
  unternehmensDaten: {
    ...registerGewerbeCompleteRequest.unternehmensDaten,
    adresseAbweichend: undefined,
  },
};

describe("getGewerbeRoutingInfo", () => {
  describe("AGS (Amtlicher Gemeindeschlüssel)", () => {
    it("uses persönlicheDaten.adresse.postleitzahl when no adresseAbweichend", async () => {
      await getGewerbeRoutingInfo({
        ...registerGewerbeCompleteRequest,
        unternehmensDaten: {
          ...registerGewerbeCompleteRequest.unternehmensDaten,
          adresseAbweichend: undefined,
        },
      });

      expect(mockGetAGSandARS).toHaveBeenCalledWith(
        registerGewerbeCompleteRequest.persönlicheDaten.adresse.postleitzahl,
      );
    });

    it("uses adresseAbweichend.postleitzahl when provided", async () => {
      await getGewerbeRoutingInfo({
        ...registerGewerbeCompleteRequest,
        unternehmensDaten: {
          ...registerGewerbeCompleteRequest.unternehmensDaten,
          adresseAbweichend: {
            ...registerGewerbeCompleteRequest.unternehmensDaten.adresseAbweichend!,
            postleitzahl: "10969",
          },
        },
      });

      expect(mockGetAGSandARS).toHaveBeenCalledWith("10969");
    });
  });

  describe("FIT-Connect routing", () => {
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
