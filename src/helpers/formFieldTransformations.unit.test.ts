import { describe, it, expect } from "vitest";
import {
  joinStrasseUndHausnummer,
  formatDatumDE,
  splitHausnummer,
  splitStrasseHausnummer,
  splitTelefonnummer,
} from "./formFieldTransformations";

describe("splitStrasseHausnummer", () => {
  it.each([
    ["Musterstraße 1", "Musterstraße", "1", undefined, undefined],
    ["Betriebsweg 42a", "Betriebsweg", "42", undefined, "a"],
    ["Betriebsweg 22 A", "Betriebsweg", "22", undefined, " A"],
    ["Am Stadtpark 5", "Am Stadtpark", "5", undefined, undefined],
    ["Prinzessinnenstraße 8-14", "Prinzessinnenstraße", "8", "14", undefined],
    ["straße des 17 juni 135", "straße des 17 juni", "135", undefined, undefined],
    ["straße des 17 juni 1 2/5 b", "straße des 17 juni", "1", undefined, " 2/5 b"],
    ["straße des 17. juni 1-3", "straße des 17. juni", "1", "3", undefined],
    ["Teststr. 4 - 44", "Teststr.", "4", "44", undefined],
  ])("splits '%s' correctly", (input, strasse, hausnummer, hausnummerBis, hausnummerZusatz) => {
    expect(splitStrasseHausnummer(input)).toEqual({
      strasse,
      hausnummer,
      hausnummerBis,
      hausnummerZusatz,
    });
  });

  it("throws for an address without a house number", () => {
    expect(() => splitStrasseHausnummer("Musterstraße")).toThrow(
      "The given address format is not supported",
    );
  });
});

describe("splitHausnummer", () => {
  it.each([
    ["8", "8", undefined, undefined],
    ["8-14", "8", "14", undefined],
    ["8 - 14", "8", "14", undefined],
    ["8/14", "8", "14", undefined],
    ["42a", "42", undefined, "a"],
    ["42 a", "42", undefined, "a"],
    ["8a-14b", "8", "14b", "a"],
    ["8-14-16", "8", "14-16", undefined],
    ["a", "a", undefined, undefined],
  ])("splits '%s' correctly", (input, hausnummer, hausnummerBis, hausnummerZusatz) => {
    expect(splitHausnummer(input)).toEqual({ hausnummer, hausnummerBis, hausnummerZusatz });
  });
});

describe("joinStrasseUndHausnummer", () => {
  it.each([
    ["Musterstraße", "1", "Musterstraße 1"],
    ["Musterstraße", undefined, "Musterstraße"],
    [undefined, "1", "1"],
    [undefined, undefined, undefined],
  ])("joins the Strasse '%s' and Hausnummer '%s' to '%s'", (strasse, hausnummer, expected) => {
    expect(joinStrasseUndHausnummer(strasse, hausnummer)).toBe(expected);
  });
});

describe("formatDatumDE", () => {
  it("converts an ISO date to German format", () => {
    expect(formatDatumDE("1988-09-10")).toBe("10.09.1988");
  });

  it("throws for a non-ISO date string", () => {
    expect(() => formatDatumDE("kein-datum")).toThrow("The given date format is not supported");
  });
});

describe("splitTelefonnummer", () => {
  it("splits the phonenumber +49 30 123456-123 corretly", () => {
    const parts = splitTelefonnummer("+49 30 123456-123");

    expect(parts.intVorw).toBe("+49");
    expect(parts.natVorw).toBe("30");
    expect(parts.rufNr).toBe("123456");
    expect(parts.durchwahl).toBe("123");
  });

  it("splits the number for a phone number +49 30 123456 without a durchwahl", () => {
    const parts = splitTelefonnummer("+49 30 123456");

    expect(parts.intVorw).toBe("+49");
    expect(parts.natVorw).toBe("30");
    expect(parts.rufNr).toBe("123456");
    expect(parts.durchwahl).toBeUndefined();
  });

  it("throws an Error for an unsupported phone number 030 123455", () => {
    expect(() => splitTelefonnummer("030 123455")).toThrow(
      "The given Phone number format is not supported",
    );
  });
});
