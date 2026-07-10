import { describe, expect, it } from "vitest";
import { getGewerbeamt } from ".";

describe("getGewerbeamt", () => {
  it("returns the Gewerbeamt Ulm with address, contact details and online service links for ARS 084210000000", async () => {
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

  // temporarily skipped because of unstable API - proper fix (separate contract and unit tests) is in our backlog
  it.skip("returns an empty onlineServices list for Fraureuth (ARS 146120000000), which has no online services", async () => {
    const gewerbeamt = await getGewerbeamt("146120000000");

    expect(gewerbeamt!.name).toBe("Gewerbeamt");
    expect(gewerbeamt!.onlineServices).toEqual([]);
  });

  it("returns undefined if no service description was found for ARS 000000000000", async () => {
    expect(await getGewerbeamt("000000000000")).toBeUndefined();
  });
});
