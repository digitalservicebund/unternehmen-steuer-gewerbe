import { describe, expect, it } from "vitest";
import { createTaetigkeiten } from "./taetigkeiten";

describe("createTaetigkeiten", () => {
  it("returns an empty string when taetigkeitenGesamt is undefined", () => {
    expect(createTaetigkeiten(undefined)).toBe("");
  });

  it("omits schwerpunkt and weitereTaetigkeiten tags when they are undefined", () => {
    const result = createTaetigkeiten({});

    expect(result).toContain("<xga:taetigkeitenGesamt>");
    expect(result).not.toContain("<xga:schwerpunkt>");
    expect(result).not.toContain("<xga:weitereTaetigkeiten>");
  });

  it("renders an empty taetigkeit list when weitereTaetigkeiten.taetigkeit is undefined", () => {
    const result = createTaetigkeiten({ weitereTaetigkeiten: {} });

    expect(result).toContain("<xga:weitereTaetigkeiten>");
    expect(result).not.toContain("<xga:taetigkeit>");
  });

  it("renders each entry of weitereTaetigkeiten.taetigkeit", () => {
    const result = createTaetigkeiten({
      weitereTaetigkeiten: {
        taetigkeit: [{ taetigkeitEinzeln: "Handel", wirtschaftszweigschluessel: "47" }],
      },
    });

    expect(result).toContain("<xga:taetigkeit>");
    expect(result).toContain("Handel");
  });
});
