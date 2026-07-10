import { describe, it, expect } from "vitest";
import { isDefinedInput } from "./isDefinedInput";

describe("isDefinedInput", () => {
  it("treats undefined as absent", () => {
    expect(isDefinedInput(undefined)).toBe(false);
  });

  it.each([
    ["string", "value"],
    ["number", 42],
    ["true", true],
    // falsy-but-present values must still count as defined
    ["empty string", ""],
    ["0 (number)", 0],
    ["false", false],
  ])("treats %s as present", (_label, value) => {
    expect(isDefinedInput(value)).toBe(true);
  });
});
