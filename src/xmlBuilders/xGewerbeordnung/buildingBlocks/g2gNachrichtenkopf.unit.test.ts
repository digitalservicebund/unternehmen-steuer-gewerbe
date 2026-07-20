import { describe, expect, it } from "vitest";
import { createG2gNachrichtenkopf } from "./g2gNachrichtenkopf";

describe("createG2gNachrichtenkopf", () => {
  it("returns an empty string when nachrichtenkopf is undefined", () => {
    expect(createG2gNachrichtenkopf(undefined)).toBe("");
  });

  it("omits leser and autor when they are undefined", () => {
    const result = createG2gNachrichtenkopf({ nachrichtenUUID: "uuid-1" });

    expect(result).not.toContain("bn-g2g:leser");
    expect(result).not.toContain("bn-g2g:autor");
  });
});
