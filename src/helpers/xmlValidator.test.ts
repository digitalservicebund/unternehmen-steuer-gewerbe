import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { isValidXml } from "./xmlValidator";

describe("XML validator", () => {
  it("should return false for invalid XML", () => {
    const xml = fs.readFileSync(
      "src/resources/xml/xml-samples/xgewerbeordnung-1.6-validator/xgewo-1.6-invalid.xml",
      "utf8",
    );
    const result = isValidXml(xml);

    expect(result).to.equal(false);
  });

  it("should return true for valid XML", () => {
    const xml = fs.readFileSync(
      "src/resources/xml/xml-samples/xgewerbeordnung-1.6-validator/xgewo-1.6-valid.xml",
      "utf8",
    );
    const result = isValidXml(xml);

    expect(result).to.equal(true);
  });
});
