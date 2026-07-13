import { describe, expect, it } from "vitest";
import { isSupportedRegion, rangeOfPLZs } from "./supportedRegions";

describe("rangeOfPLZs", () => {
  it("defaults to a step of 1 when none is given", () => {
    expect(rangeOfPLZs("40210", "40213")).toEqual({ from: "40210", to: "40213", step: 1 });
  });

  it("carries a custom step", () => {
    expect(rangeOfPLZs("40215", "40239", 2)).toEqual({ from: "40215", to: "40239", step: 2 });
  });
});

describe("isSupportedRegion", () => {
  it("returns true for a PLZ inside a supported range (52070 within Aachen's 52062-52080)", () => {
    expect(isSupportedRegion(52070)).toBe(true);
  });

  it("returns true for a PLZ at the lower bound of a supported range (52062, Aachen's 52062-52080)", () => {
    expect(isSupportedRegion(52062)).toBe(true);
  });

  it("returns true for a PLZ at the upper bound of a supported range (52080, Aachen's 52062-52080)", () => {
    expect(isSupportedRegion(52080)).toBe(true);
  });

  it("returns true for a supported single PLZ (27499, Hamburg's Helgoland exclave)", () => {
    expect(isSupportedRegion(27499)).toBe(true);
  });

  it("returns false for a PLZ outside all supported regions (99999)", () => {
    expect(isSupportedRegion(99999)).toBe(false);
  });

  describe("stepped ranges (Düsseldorf's non-contiguous PLZ blocks)", () => {
    it("returns true for the bounds and every PLZ landing on the step (40215-40239, step 2)", () => {
      expect(isSupportedRegion(40215)).toBe(true);
      expect(isSupportedRegion(40217)).toBe(true);
      expect(isSupportedRegion(40239)).toBe(true);
    });

    it("returns false for PLZs within the bounds that don't land on the step (40215-40239, step 2)", () => {
      expect(isSupportedRegion(40216)).toBe(false);
      expect(isSupportedRegion(40218)).toBe(false);
      expect(isSupportedRegion(40238)).toBe(false);
    });

    it("returns false just outside the bounds of a stepped range, even though it would land on the step (40241, just past 40215-40239 step 2)", () => {
      expect(isSupportedRegion(40241)).toBe(false);
    });
  });
});
