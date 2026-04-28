import { describe, expect, it } from "vitest";
import { clearObjectValues } from "./clearObjectValues";

describe("clearObjectValues", () => {
  it("throws when called with a primitive or null", () => {
    expect(() => clearObjectValues("hello" as never)).toThrow();
    expect(() => clearObjectValues(42 as never)).toThrow();
    expect(() => clearObjectValues(null as never)).toThrow();
  });

  it("preserves structure and replaces all leaves with the given value", () => {
    const input = { a: "foo", b: { c: 1, d: "bar" } };
    expect(clearObjectValues(input)).toEqual({ a: undefined, b: { c: undefined, d: undefined } });
    expect(clearObjectValues(input, null)).toEqual({ a: null, b: { c: null, d: null } });
    expect(clearObjectValues(input, "")).toEqual({ a: "", b: { c: "", d: "" } });
    expect(clearObjectValues(input, {})).toEqual({ a: {}, b: { c: {}, d: {} } });
  });

  it("preserves arrays and recurses into their elements", () => {
    const input = { tel: [{ rufNr: "123" }, { rufNr: "456" }] };
    expect(clearObjectValues(input)).toEqual({ tel: [{ rufNr: undefined }, { rufNr: undefined }] });
    expect(clearObjectValues(input, null)).toEqual({ tel: [{ rufNr: null }, { rufNr: null }] });
  });
});
