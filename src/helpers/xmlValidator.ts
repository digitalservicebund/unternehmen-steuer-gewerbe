import fs from "node:fs/promises";
import path from "node:path";
import SaxonJS from "saxon-js"; // no types provided, relies on /src/declarations.d.ts

import { validateXML, XMLValidationResult } from "xmllint-wasm";

interface SaxonTransformResult {
  /** The serialized SVRL string */
  principalResult: string;

  /** The parsed DOM of your input XML */
  masterDocument: Document;

  /** Map of additional result documents, if any */
  resultDocuments: Record<string, string | Document>;

  /** The internal compiled stylesheet object */
  stylesheetInternal: object;
}

interface XmlValidationResult {
  isValid: boolean;
  schemaValidationResult: XMLValidationResult;
  schematronValidationResult: SaxonTransformResult;
}

export async function validateXml(xml: string): Promise<XmlValidationResult> {
  const schemaDir = "./src/resources/xml/xsd/xgewerbeordnung-1.6";

  // pre-loading all XSD "dependencies"
  const files = await fs.readdir(schemaDir);
  const preloadedXsds = await Promise.all(
    files
      .filter((fileName) => fileName.endsWith(".xsd"))
      .map(async (fileName) => ({
        fileName,
        contents: await fs.readFile(path.join(schemaDir, fileName), "utf8"),
      })),
  );
  // reading the main XSD schema
  const mainXsd = await fs.readFile(
    path.join(schemaDir, "xgewerbeordnung-gewerbeanzeige.xsd"),
    "utf8",
  );
  // validating against schema
  const schemaValidationResult = await validateXML({
    xml,
    schema: [mainXsd],
    preload: preloadedXsds,
  });

  // validating against schematron
  const schematronValidationResult: SaxonTransformResult = SaxonJS.transform(
    {
      stylesheetFileName:
        "src/resources/xml/schematron/xgewerbeordung-1.6/generated.spezifikation.sef.json",
      sourceText: xml,
      destination: "serialized",
    },
    "sync",
  );
  const isValidSchematron =
    !schematronValidationResult.principalResult.includes("<svrl:failed-assert");

  return {
    isValid: schemaValidationResult.valid && isValidSchematron,
    schemaValidationResult,
    schematronValidationResult,
  };
}
