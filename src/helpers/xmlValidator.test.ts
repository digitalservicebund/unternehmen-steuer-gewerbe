import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { validateXml } from "./xmlValidator";

describe("XML validator", () => {
  it("should return false and a non-empty list of errors for schema-invalid XML", async () => {
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

  it("should return false for rules-invalid XML (schematron check)", async () => {
    const xml = fs.readFileSync(
      `src/resources/xml/xml-samples/xgewerbeordnung-1.6-validator/xgewo-1.6-invalid-sch.xml`,
      "utf8",
    );
    const result = await validateXml(xml);

    expect(result.isValid).to.equal(false);
  });
});
