import { describe, expect, it } from "vitest";
import { getAGS } from "./getAgs";

describe("getAGS", () => {
  it("returns the AGS (Amtlicher Gemeindeschlüssel) 01054080 for the ARS (Amtlicher Regionalschlüssel) 010545494080, dropping the Gemeindeverband digits 5494", () => {
    expect(getAGS("010545494080")).toBe("01054080");
  });

  it("throws if ARS is not 12 digits long", () => {
    expect(() => getAGS("0842100")).toThrow('Cannot derive an AGS from invalid ARS "0842100"');
  });
});
