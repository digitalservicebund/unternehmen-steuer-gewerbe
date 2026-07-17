import { describe, expect, it } from "vitest";
import { getGewerbeamt } from ".";
import {
  FRAUREUTH_ARS,
  fraureuthGewerbeamt,
  ULM_ARS,
  UNKNOWN_ARS,
  ulmGewerbeamt,
} from "./getGewerbeamt.fixtures";

describe("getGewerbeamt", () => {
  it("returns the Gewerbeamt Ulm with address, contact details and online service links for ARS 084210000000", async () => {
    expect(await getGewerbeamt(ULM_ARS)).toEqual(ulmGewerbeamt);
  });

  // Drift (observed 2026-07-17): PVOG no longer returns any service description for this ARS,
  // so getGewerbeamt now resolves to undefined here - same as the "unknown ARS" case below.
  // See getGewerbeamt.fixtures.ts for the recorded (now-empty) response.
  it.skip("returns an empty onlineServices list for Fraureuth (ARS 146120000000), which has no online services", async () => {
    expect(await getGewerbeamt(FRAUREUTH_ARS)).toEqual(fraureuthGewerbeamt);
  });

  it("returns undefined if no service description was found for ARS 000000000000", async () => {
    expect(await getGewerbeamt(UNKNOWN_ARS)).toBeUndefined();
  });
});
