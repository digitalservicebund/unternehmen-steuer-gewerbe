import { afterEach, describe, expect, it, vi } from "vitest";

const { mockFetchJson } = vi.hoisted(() => ({
  mockFetchJson: vi.fn(),
}));

vi.mock("../../helpers/fetchJson", () => ({
  fetchJson: mockFetchJson,
}));

import { getGewerbeamt } from ".";
import {
  fraureuthPvogResponses,
  ulmPvogResponses,
  unknownArsPvogResponses,
} from "./getGewerbeamt.fixtures";

interface PvogResponses {
  serviceDescriptions: object;
  serviceDescriptionDetail: object;
  organisationUnits: object[];
  organisationUnitDetail: object;
}

// mocks the results of the four PVOG requests getGewerbeamt makes, in call order
function mockPvogApi(responses: PvogResponses) {
  mockFetchJson
    .mockResolvedValueOnce(responses.serviceDescriptions)
    .mockResolvedValueOnce(responses.serviceDescriptionDetail)
    .mockResolvedValueOnce(responses.organisationUnits)
    .mockResolvedValueOnce(responses.organisationUnitDetail);
}

// Mocked counterpart of getGewerbeamt.contract.test.ts - same scenarios and assertions,
// against fixtures recorded from the real PVOG API instead of a live call.
describe("getGewerbeamt with mocked PVOG responses", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns the Gewerbeamt Ulm with address, contact details and online service links for ARS 084210000000", async () => {
    mockPvogApi(ulmPvogResponses);

    const gewerbeamt = await getGewerbeamt("084210000000");
    expect(gewerbeamt!.name).toEqual(expect.any(String));
    expect(gewerbeamt).toMatchObject({
      adresse: {
        strasse: "Olgastraße",
        hausnummer: "66",
        postleitzahl: "89073",
        ort: "Ulm",
      },
      telefon: "+49 731 161 3216",
      email: "gewerbe@ulm.de",
    });
    expect(gewerbeamt!.onlineServices.length).toBeGreaterThan(0);
    for (const link of gewerbeamt!.onlineServices) {
      expect(link).toMatchObject({ uri: expect.any(String) });
    }
  });

  // Drift (see getGewerbeamt.fixtures.ts): PVOG no longer returns a service description for this
  // ARS at all, so fraureuthPvogResponses is now empty and this scenario can't be reproduced -
  // getGewerbeamt would return undefined here, same as the "unknown ARS" case below.
  it.skip("returns an empty onlineServices list for Fraureuth (ARS 146120000000), which has no online services", async () => {
    mockPvogApi(fraureuthPvogResponses);

    const gewerbeamt = await getGewerbeamt("146120000000");
    expect(gewerbeamt!.name).toBe("Gewerbeamt");
    expect(gewerbeamt!.onlineServices).toEqual([]);
  });

  it("returns undefined if no service description was found for ARS 000000000000", async () => {
    mockPvogApi(unknownArsPvogResponses);
    expect(await getGewerbeamt("000000000000")).toBeUndefined();
  });
});
