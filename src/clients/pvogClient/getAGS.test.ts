import { describe, expect, it } from "vitest";
import { getAGS } from "./getAGS";

describe("getAGS", () => {
  it("returns the AGS (Amtlicher Gemeindeschlüssel) 08421000 for the ARS (Amtlicher Regionalschlüssel) 084210000000", () => {
    expect(getAGS("084210000000")).toBe("08421000");
  });

  it("throws for an invalid ARS", () => {
    expect(() => getAGS("0842100")).toThrow('Cannot derive an AGS from invalid ARS "0842100"');
  });
});
