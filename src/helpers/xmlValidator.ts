import fs from "node:fs/promises";
import path from "node:path";
// no types exist for saxon-js; we have defined a placeholder in /src/declarations.d.ts, so the compiler does not complain
import SaxonJS from "saxonjs-he";
import { validateXML, XMLValidationResult } from "xmllint-wasm";

interface XmlValidationResult {
  isValid: boolean;
  schemaValidationResult: XMLValidationResult;
  schematronValidationResult: SaxonTransformResult;
}
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

export async function validateXml(xml: string): Promise<XmlValidationResult> {
  const schemaDir = "./src/resources/xml/schemaXsd/xgewerbeordnung-1.6";
  const schemaValidationResult = await validateAgainstSchema(xml, schemaDir);

  const schematronRulesSefJsonFile =
    "src/resources/xml/schematron/xgewerbeordung-1.6/generated.spezifikation.sef.json";
  const schematronValidationResult = await validateAgainstSchematronRules(
    xml,
    schematronRulesSefJsonFile,
  );

  return {
    isValid: schemaValidationResult.valid && schematronValidationResult.isValid,
    schemaValidationResult,
    schematronValidationResult: schematronValidationResult.result,
  };
}

async function validateAgainstSchema(xml: string, schemaDir: string): Promise<XMLValidationResult> {
  // reading the main XSD schema
  const mainXsd = await fs.readFile(
    path.join(schemaDir, "xgewerbeordnung-gewerbeanzeige.xsd"),
    "utf8",
  );

  // loading all XSD "dependencies"
  const filesInSchemaDir = await fs.readdir(schemaDir);
  const xsdDependencies = await Promise.all(
    filesInSchemaDir
      .filter((fileName) => fileName.endsWith(".xsd"))
      .map(async (fileName) => ({
        fileName,
        contents: await fs.readFile(path.join(schemaDir, fileName), "utf8"),
      })),
  );

  const schemaValidationResult = await validateXML({
    xml,
    schema: [mainXsd],
    preload: xsdDependencies,
  });
  return schemaValidationResult;
}

async function validateAgainstSchematronRules(
  xml: string,
  schematronRulesSefJsonFilePath: string,
): Promise<{
  isValid: boolean;
  result: SaxonTransformResult;
}> {
  const schematronValidationResult: SaxonTransformResult = await SaxonJS.transform(
    {
      stylesheetFileName: schematronRulesSefJsonFilePath,
      sourceText: xml,
      destination: "serialized",
    },
    "async",
  );
  // valid if no failure reported
  const isValid = !schematronValidationResult.principalResult.includes("<svrl:failed-assert");

  return { isValid, result: schematronValidationResult };
}
