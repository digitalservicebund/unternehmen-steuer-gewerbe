import { describe, it, expect, vi } from "vitest";

const {
  mockGetLocationsDetails,
  mockGetGewerbeamt,
  mockGetRoutes,
  mockVerifyDestinationSignature,
  mockDestinationIdOverride,
  mockArsOverride,
} = vi.hoisted(() => ({
  mockGetLocationsDetails: vi
    .fn()
    .mockResolvedValue([{ ars: "030460014004", name: "Cottbus, Stadt", plz: "03046" }]),
  mockGetGewerbeamt: vi.fn().mockResolvedValue({
    name: "Stadt Fulda",
    adresse: { strasse: "Schlossstraße", hausnummer: "1", postleitzahl: "36037", ort: "Fulda" },
    telefon: "0661 102-0",
    onlineServices: [],
  }),
  mockGetRoutes: vi.fn().mockResolvedValue({ count: 0, offset: 0, totalCount: 0, routes: [] }),
  mockVerifyDestinationSignature: vi.fn().mockResolvedValue(undefined),
  // unset env vars resolve to an empty string
  mockDestinationIdOverride: vi.fn().mockReturnValue(""),
  mockArsOverride: vi.fn().mockReturnValue(""),
}));

vi.mock("../../clients/pvogClient", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../clients/pvogClient")>()),
  getLocationsDetails: mockGetLocationsDetails,
  getGewerbeamt: mockGetGewerbeamt,
}));

vi.mock("../../clients/fitConnectClient/fitConnectClient", () => ({
  getFitConnectClient: () => ({ getRoutes: mockGetRoutes }),
}));

vi.mock("../../clients/fitConnectClient/destinationSignature", () => ({
  verifyDestinationSignature: mockVerifyDestinationSignature,
}));

// Override only the two test knobs; every other env var still resolves through the real getter.
vi.mock("../../secretsAndEnvironmentVariables", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../secretsAndEnvironmentVariables")>();
  const getEnvironmentVariable: typeof actual.getEnvironmentVariable = (name) => {
    if (name === "TEST_FIT_CONNECT_DESTINATION_ID_OVERRIDE") {
      return mockDestinationIdOverride();
    }
    if (name === "TEST_OSCI_ARS_OVERRIDE") {
      return mockArsOverride();
    }
    return actual.getEnvironmentVariable(name);
  };
  return { ...actual, getEnvironmentVariable };
});

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

    it("returns undefined when no location is found for the address", async () => {
      mockGetLocationsDetails.mockResolvedValueOnce([]);

      expect(
        await getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled),
      ).toBeUndefined();
    });
  });

  describe("Gewerbeamt lookup", () => {
    it("looks up the Gewerbeamt by the resolved ARS and returns it", async () => {
      const result = await getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled);

      expect(mockGetGewerbeamt).toHaveBeenCalledWith("030460014004");
      expect(result!.gewerbeamt).toEqual({
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

    it("returns undefined when no Gewerbeamt is found for the resolved ARS", async () => {
      mockGetGewerbeamt.mockResolvedValueOnce(undefined);

      expect(
        await getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled),
      ).toBeUndefined();
    });
  });

  describe("FIT-Connect routing", () => {
    it("asks the routing service for the Gewerbeanmeldung LEIKA key and the resolved ARS", async () => {
      await getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled);

      expect(mockGetRoutes).toHaveBeenCalledWith("99050012104000", "030460014004");
    });

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

      const result = await getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled);

      expect(result!.fitConnectDestinationInformation!.destinationId).toBe("mock-destination-id");
      expect(result!.ags).toBe("03046004");
    });

    it("returns fitConnectDestinationInformation null when the routing service returns no routes", async () => {
      mockGetRoutes.mockResolvedValueOnce({ count: 0, offset: 0, totalCount: 0, routes: [] });

      const result = await getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled);

      expect(result!.fitConnectDestinationInformation).toBeNull();
    });

    it("verifies the destinationSignature of the used route against the LEIKA key and the resolved ARS", async () => {
      mockGetRoutes.mockResolvedValueOnce({
        count: 1,
        offset: 0,
        totalCount: 1,
        routes: [{ destinationId: "mock-destination-id", destinationSignature: "sig.nat.ure" }],
      });

      await getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled);

      expect(mockVerifyDestinationSignature).toHaveBeenCalledWith({
        destinationSignature: "sig.nat.ure",
        destinationId: "mock-destination-id",
        leikaKey: "99050012104000",
        ars: "030460014004",
      });
    });

    it("throws when the destinationSignature of the used route cannot be verified", async () => {
      mockGetRoutes.mockResolvedValueOnce({
        count: 1,
        offset: 0,
        totalCount: 1,
        routes: [{ destinationId: "mock-destination-id", destinationSignature: "sig.nat.ure" }],
      });
      mockVerifyDestinationSignature.mockRejectedValueOnce(new Error("untrusted issuer"));

      await expect(
        getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled),
      ).rejects.toThrow("untrusted issuer");
    });

    it("prefers the TEST_FIT_CONNECT_DESTINATION_ID_OVERRIDE override over the routing service result", async () => {
      mockDestinationIdOverride.mockReturnValueOnce("override-destination-id");
      mockGetRoutes.mockResolvedValueOnce({ count: 0, offset: 0, totalCount: 0, routes: [] });

      const result = await getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled);

      expect(result!.fitConnectDestinationInformation!.destinationId).toBe(
        "override-destination-id",
      );
    });
  });

  describe("TEST_OSCI_ARS_OVERRIDE", () => {
    it("returns the overridden ars 090000000099 and the ags 09000099 derived from it", async () => {
      mockArsOverride.mockReturnValueOnce("090000000099");

      const result = await getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled);

      expect(result!.ars).toBe("090000000099");
      expect(result!.ags).toBe("09000099");
    });

    it("looks up the Gewerbeamt with the ARS resolved from the address", async () => {
      mockArsOverride.mockReturnValueOnce("090000000099");

      await getGewerbeRoutingInfo(registerGewerbeSampleRequestAllFieldsFilled);

      expect(mockGetGewerbeamt).toHaveBeenCalledWith("030460014004");
    });
  });
});
