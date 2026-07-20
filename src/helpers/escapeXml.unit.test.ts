import { describe, expect, it } from "vitest";
import { escapeXml } from "./escapeXml";

describe("escapeXml", () => {
  it("returns an empty string for undefined", () => {
    expect(escapeXml(undefined)).toBe("");
  });

  it("escapes &, <, >, \" and ' in a string", () => {
    expect(escapeXml(`Tom & Jerry's <shop> "sale"`)).toBe(
      "Tom &amp; Jerry&apos;s &lt;shop&gt; &quot;sale&quot;",
    );
  });

  it("converts a number to its string representation", () => {
    expect(escapeXml(42)).toBe("42");
  });

  it("converts a boolean to its string representation", () => {
    expect(escapeXml(true)).toBe("true");
  });
});
