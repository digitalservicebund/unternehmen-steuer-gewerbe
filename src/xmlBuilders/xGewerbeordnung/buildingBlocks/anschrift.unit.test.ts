import { describe, expect, it } from "vitest";
import { createAnschrift } from "./anschrift";

describe("createAnschrift", () => {
  it("returns an empty string when strassenanschriftInland is undefined", () => {
    expect(createAnschrift(undefined)).toBe("");
  });
});
