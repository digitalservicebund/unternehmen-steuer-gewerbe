import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { createValidationErrorSummary, validateXml } from "./xmlValidator";

describe("XML validator", () => {
  it("should return false and a non-empty list of schema errors for schema-invalid XML", async () => {
    const xml = fs.readFileSync(
      `src/resources/xml/xml-samples/xgewerbeordnung-1.6-validator/xgewo-1.6-invalid.xml`,
      "utf8",
    );
    const result = await validateXml(xml);

    expect(result.isValid).to.equal(false);
    expect(result.schemaValidationResult.errors.length).toBeGreaterThan(0);
  });

  it("should return true for valid XML", async () => {
    const xml = fs.readFileSync(
      "src/resources/xml/xml-samples/xgewerbeordnung-1.6-validator/xgewo-1.6-valid.xml",
      "utf8",
    );
    const result = await validateXml(xml);

    expect(result.isValid).to.equal(true);
  });

  it("should return false and rules errors for schematron-invalid XML", async () => {
    const xml = fs.readFileSync(
      `src/resources/xml/xml-samples/xgewerbeordnung-1.6-validator/xgewo-1.6-invalid-sch.xml`,
      "utf8",
    );
    const result = await validateXml(xml);

    expect(result.isValid).to.equal(false);
    expect(result.schematronValidationResult.principalResult).toContain("svrl:failed-assert");
  });

  it("should return false for completely broken XML", async () => {
    const xml = fs.readFileSync(
      `src/resources/xml/xml-samples/xgewerbeordnung-1.6-validator/xy-unknown.xml`,
      "utf8",
    );
    const result = await validateXml(xml);

    expect(result.isValid).to.equal(false);
  });

  describe("createValidationErrorSummary", () => {
    it("names the XML line 78 of the schema error", async () => {
      const xml = fs.readFileSync(
        `src/resources/xml/xml-samples/xgewerbeordnung-1.6-validator/xgewo-1.6-invalid.xml`,
        "utf8",
      );
      const result = await validateXml(xml);

      expect(createValidationErrorSummary(result)).toEqual(
        "1 schema error(s) in XML line(s) 78; failed schematron rule(s): none",
      );
    });

    it("omits the XML line for schematron-only failures", async () => {
      const xml = fs.readFileSync(
        `src/resources/xml/xml-samples/xgewerbeordnung-1.6-validator/xgewo-1.6-invalid-sch.xml`,
        "utf8",
      );
      const result = await validateXml(xml);

      expect(createValidationErrorSummary(result)).toEqual(
        "0 schema error(s); failed schematron rule(s): SCH-0212, SCH-0230, SCH-0231",
      );
    });
  });
});
