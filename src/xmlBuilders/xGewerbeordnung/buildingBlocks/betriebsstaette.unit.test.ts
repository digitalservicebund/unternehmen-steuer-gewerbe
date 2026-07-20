import { describe, expect, it } from "vitest";
import { createBetriebsstaette } from "./betriebsstaette";

describe("createBetriebsstaette", () => {
  it("returns an empty string when betriebsstaette is undefined", () => {
    expect(createBetriebsstaette(undefined)).toBe("");
  });
});
