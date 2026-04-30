import { describe, it, expect } from "vitest";
import { formatDatumDE, splitStrasseHausnummer, splitTelefonnummer } from "./data";

describe("splitStrasseHausnummer", () => {
  it("splits a simple street and number", () => {
    expect(splitStrasseHausnummer("Musterstraße 1")).toEqual({
      strasse: "Musterstraße",
      hausnummer: "1",
    });
  });

  it("splits a hausnummer with a letter suffix", () => {
    expect(splitStrasseHausnummer("Betriebsweg 42a")).toEqual({
      strasse: "Betriebsweg",
      hausnummer: "42a",
    });
  });

  it("splits a multi-word street name", () => {
    expect(splitStrasseHausnummer("Am Stadtpark 5")).toEqual({
      strasse: "Am Stadtpark",
      hausnummer: "5",
    });
  });

  it("splits a hausnummer range into hausnummer and hausnummerBis", () => {
    expect(splitStrasseHausnummer("Prinzessinnenstraße 8-14")).toEqual({
      strasse: "Prinzessinnenstraße",
      hausnummer: "8",
      hausnummerBis: "14",
    });
  });

  it("splits a hausnummer range with spaces around the hyphen", () => {
    expect(splitStrasseHausnummer("Teststr. 4 - 44")).toEqual({
      strasse: "Teststr.",
      hausnummer: "4",
      hausnummerBis: "44",
    });
  });
});

describe("formatDatumDE", () => {
  it("converts an ISO date to German format", () => {
    expect(formatDatumDE("1988-09-10")).toBe("10.09.1988");
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
