import { describe, it, expect } from "vitest";
import {
  STAATSANGEHOERIGKEIT_LABEL,
  UNFALLVERSICHERUNGSTRAEGER_LABEL,
} from "./xGewerbeordnungCodeLabels";
import {
  STAATSANGEHOERIGKEIT,
  STAATSANGEHOERIGKEIT_ICAO,
  UNFALLVERSICHERUNGSTRAEGER,
} from "./xGewerbeordnungCodes";

function codesWithoutLabel(codes: string[], labels: Record<string, string>): string[] {
  return [...new Set(codes)].filter((code) => labels[code] === undefined);
}

describe("XGewerbeordnung code labels", () => {
  it("labels every Staatsangehörigkeit the transformer can send", () => {
    const codes = [
      ...Object.values(STAATSANGEHOERIGKEIT),
      ...Object.values(STAATSANGEHOERIGKEIT_ICAO),
    ];

    expect(codesWithoutLabel(codes, STAATSANGEHOERIGKEIT_LABEL)).toEqual([]);
  });

  it("labels every Unfallversicherungsträger of the code list", () => {
    const codes = Object.values(UNFALLVERSICHERUNGSTRAEGER);

    expect(codesWithoutLabel(codes, UNFALLVERSICHERUNGSTRAEGER_LABEL)).toEqual([]);
  });
});
