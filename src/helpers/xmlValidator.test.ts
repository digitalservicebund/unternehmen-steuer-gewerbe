import fs from "node:fs";
import { describe, expect, it, test } from "vitest";
import { isValidXml } from "./xmlValidator";

describe("XML validator", () => {
  const invalidXmlFilenames = [
    "xgewo-1.6-invalid.xml",
    // "xgewo-1.6-invalid-sch.xml" // requires schematron check
  ];
  test.each(invalidXmlFilenames)(
    "should return false and a non-empty list of errors for invalid XML",
    async (invalidXmlFilename) => {
      const xml = fs.readFileSync(
        `src/resources/xml/xml-samples/xgewerbeordnung-1.6-validator/${invalidXmlFilename}`,
        "utf8",
      );
      const result = await isValidXml(xml);

      expect(result.valid).to.equal(false);
      expect(result.errors.length).toBeGreaterThan(0);
    },
  );

  it("should return true for valid XML", async () => {
    const xml = fs.readFileSync(
      "src/resources/xml/xml-samples/xgewerbeordnung-1.6-validator/xgewo-1.6-valid.xml",
      "utf8",
    );
    const result = await isValidXml(xml);

    expect(result.valid).to.equal(true);
  });
});
