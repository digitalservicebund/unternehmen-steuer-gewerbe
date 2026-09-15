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
    ["Domstraße 1C-1E", "Domstraße", "1", "1E", "C"],
    ["Musterstraße 1/a", "Musterstraße", "1", undefined, "/a"],
    ["Hauptstr. 1 a.", "Hauptstr.", "1", undefined, " a."],
  ])("splits '%s' correctly", (input, strasse, hausnummer, hausnummerBis, hausnummerZusatz) => {
    expect(splitStrasseHausnummer(input)).toEqual({
      strasse,
      hausnummer,
      hausnummerBis,
      hausnummerZusatz,
    });
  });

  it("splits 'Musterstraße 1 / 2' into strasse Musterstraße and hausnummer 1", () => {
    expect(splitStrasseHausnummer("Musterstraße 1 / 2")).toEqual({
      strasse: "Musterstraße",
      hausnummer: "1",
      hausnummerBis: undefined,
      hausnummerZusatz: " / 2",
    });
  });

  it("throws for an address without a house number", () => {
    expect(() => splitStrasseHausnummer("Musterstraße")).toThrow(
      "The given address format is not supported",
    );
  });

  it("throws for a Strasse longer than 72 characters", () => {
    expect(() => splitStrasseHausnummer(`${"M".repeat(73)} 1`)).toThrow(
      "The given address format is not supported",
    );
  });

  it("splits a Strasse of exactly 72 characters", () => {
    expect(splitStrasseHausnummer(`${"M".repeat(72)} 1`)).toEqual({
      strasse: "M".repeat(72),
      hausnummer: "1",
      hausnummerBis: undefined,
      hausnummerZusatz: undefined,
    });
  });

  it("throws for a Hausnummer with more than four digits", () => {
    expect(() => splitStrasseHausnummer("Musterstraße 12345")).toThrow(
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
    ["1C-1E", "1", "1E", "C"],
    ["8-14-16", "8", "14-16", undefined],
    ["a", "a", undefined, undefined],
  ])(
    "splits '%s' into von, bis and Zusatz",
    (input, hausnummer, hausnummerBis, hausnummerZusatz) => {
      expect(splitHausnummer(input)).toEqual({ hausnummer, hausnummerBis, hausnummerZusatz });
    },
  );
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
  it("splits the E.164 number +4930123456 into intVorw (+49), natVorw (30) and rufNr (123456)", () => {
    const parts = splitTelefonnummer("+4930123456");

    expect(parts.intVorw).toBe("+49");
    expect(parts.natVorw).toBe("30");
    expect(parts.rufNr).toBe("123456");
  });

  it("splits the E.164 number +14155552671 into intVorw (+1), natVorw (415) and rufNr (5552671", () => {
    const parts = splitTelefonnummer("+14155552671");

    expect(parts.intVorw).toBe("+1");
    expect(parts.natVorw).toBe("415");
    expect(parts.rufNr).toBe("5552671");
  });

  it("throws an Error for an unsupported phone number 030 123455", () => {
    expect(() => splitTelefonnummer("030 123455")).toThrow(
      "The given Phone number format is not supported",
    );
  });
});
