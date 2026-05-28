import { describe, it, expect, vi } from "vitest";

vi.mock("../../clients/pvogClient/pvogClient", () => ({
  getAGSandARS: vi.fn().mockResolvedValue({ ags: "03046001", ars: "030460014004" }),
}));

const mockGetRoutes = vi.fn();

vi.mock("../../clients/fitConnectClient/fitConnectClient", () => ({
  getFitConnectClient: () => ({ getRoutes: mockGetRoutes }),
}));

import { lookupRequestContext } from "./lookupRequestContext";
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

describe("lookupRequestContext (routing)", () => {
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

    const result = await lookupRequestContext(requestWithFitConnectSupport);

    expect(result.fitConnect!.destinationId).toBe("mock-destination-id");
    expect(result.ags).toBe("03046001");
  });

  it("throws when FIT-Connect returns no routes for the AGS", async () => {
    mockGetRoutes.mockResolvedValueOnce({ count: 0, offset: 0, totalCount: 0, routes: [] });

    await expect(lookupRequestContext(requestWithFitConnectSupport)).rejects.toThrow(
      "No FIT-Connect destination found for AGS 03046001",
    );
  });
});
