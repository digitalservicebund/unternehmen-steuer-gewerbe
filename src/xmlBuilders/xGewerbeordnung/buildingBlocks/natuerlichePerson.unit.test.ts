import { describe, expect, it } from "vitest";
import { createNatuerlichePerson } from "./natuerlichePerson";

describe("createNatuerlichePerson", () => {
  it("returns an empty string when natuerlichePerson is undefined", () => {
    expect(createNatuerlichePerson(undefined)).toBe("");
  });

  it("omits name and geburt tags when they are undefined", () => {
    const result = createNatuerlichePerson({ id: "person-1" });

    expect(result).toContain("<xga:natuerlichePerson>");
    expect(result).not.toContain("<np:name>");
    expect(result).not.toContain("<bk:geburt>");
  });
});
