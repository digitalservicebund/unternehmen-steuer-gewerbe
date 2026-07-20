import { describe, expect, it } from "vitest";
import { createBetriebArt } from "./betriebArt";

describe("createBetriebArt", () => {
  it("returns an empty string when betriebArt is undefined", () => {
    expect(createBetriebArt(undefined)).toBe("");
  });
});
