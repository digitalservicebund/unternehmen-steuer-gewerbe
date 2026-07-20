import { describe, expect, it } from "vitest";
import { createReferenzierteSubjekte } from "./referenzierteSubjekte";

describe("createReferenzierteSubjekte", () => {
  it("returns an empty string when referenzierteSubjekte is undefined", () => {
    expect(createReferenzierteSubjekte(undefined)).toBe("");
  });

  it("renders an empty list when natuerlichePerson is undefined", () => {
    const result = createReferenzierteSubjekte({});

    expect(result).toContain("<xga:referenzierteSubjekte>");
    expect(result).not.toContain("<xga:natuerlichePerson>");
  });
});
