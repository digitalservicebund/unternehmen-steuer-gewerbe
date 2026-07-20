import { describe, expect, it } from "vitest";
import { createBehoerde } from "./behoerde";

describe("createBehoerde", () => {
  it("returns an empty string when behoerde is undefined", () => {
    expect(createBehoerde(undefined)).toBe("");
  });
});
