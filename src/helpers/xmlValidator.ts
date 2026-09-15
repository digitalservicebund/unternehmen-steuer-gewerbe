import fs from "node:fs/promises";
import path from "node:path";
// no types exist for saxon-js; we have defined a placeholder in /src/declarations.d.ts, so the compiler does not complain
import SaxonJS from "saxonjs-he";
import { XMLParser } from "fast-xml-parser";
import { validateXML, XMLValidationResult } from "xmllint-wasm";
import { getResourcesDir } from "./resourcesDir";

export interface XmlValidationResult {
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

let cachedXsdFiles:
  | { mainXsd: string; dependencies: { fileName: string; contents: string }[] }
  | undefined;
let cachedStylesheetInternal: object | undefined;

async function getXsdFiles() {
  if (cachedXsdFiles) return cachedXsdFiles;
  const schemaDir = path.join(getResourcesDir(), "xml/schemaXsd/xgewerbeordnung-1.6");
  const mainXsd = await fs.readFile(
    path.join(schemaDir, "xgewerbeordnung-gewerbeanzeige.xsd"),
    "utf8",
  );
  const filesInSchemaDir = await fs.readdir(schemaDir);
  const dependencies = await Promise.all(
    filesInSchemaDir
      .filter((fileName) => fileName.endsWith(".xsd"))
      .map(async (fileName) => ({
        fileName,
        contents: await fs.readFile(path.join(schemaDir, fileName), "utf8"),
      })),
  );
  cachedXsdFiles = { mainXsd, dependencies };
  return cachedXsdFiles;
}

export async function validateXml(xml: string): Promise<XmlValidationResult> {
  const schemaValidationResult = await validateAgainstSchema(xml);

  const schematronRulesSefJsonFile = path.join(
    getResourcesDir(),
    "xml/schematron/xgewerbeordung-1.6/generated.spezifikation.sef.json",
  );
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

const svrlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: (name) => name === "svrl:failed-assert",
});

interface SvrlOutput {
  "svrl:schematron-output"?: {
    "svrl:failed-assert"?: { "@_id"?: string }[];
  };
}

// Rule ids and line numbers only: a schema error message quotes the value it rejected (e.g. a
// malformed geburtsdatum), and that is personal data (see doc/data-protection.md).
export function createValidationErrorSummary({
  schemaValidationResult,
  schematronValidationResult,
}: XmlValidationResult): string {
  const svrl: SvrlOutput = svrlParser.parse(schematronValidationResult.principalResult);
  const failedAsserts = svrl["svrl:schematron-output"]?.["svrl:failed-assert"] ?? [];
  const failedRuleIds = [
    ...new Set(failedAsserts.map((failedAssert) => failedAssert["@_id"] ?? "unknown rule")),
  ];
  const schemaErrorLines = [
    ...new Set(
      schemaValidationResult.errors.map((error) =>
        error.loc === null ? "unknown" : String(error.loc.lineNumber),
      ),
    ),
  ];
  const schemaErrorLocation =
    schemaErrorLines.length === 0 ? "" : ` in XML line(s) ${schemaErrorLines.join(", ")}`;

  return `${schemaValidationResult.errors.length} schema error(s)${schemaErrorLocation}; failed schematron rule(s): ${failedRuleIds.join(", ") || "none"}`;
}

async function validateAgainstSchema(xml: string): Promise<XMLValidationResult> {
  const { mainXsd, dependencies } = await getXsdFiles();
  return validateXML({
    xml,
    schema: [mainXsd],
    preload: dependencies,
  });
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
      ...(cachedStylesheetInternal
        ? { stylesheetInternal: cachedStylesheetInternal }
        : { stylesheetFileName: schematronRulesSefJsonFilePath }),
      sourceText: xml,
      destination: "serialized",
    },
    "async",
  );

  cachedStylesheetInternal = schematronValidationResult.stylesheetInternal;

  const isValid = !schematronValidationResult.principalResult.includes("<svrl:failed-assert");
  return { isValid, result: schematronValidationResult };
}
