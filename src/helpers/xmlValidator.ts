import fs from "node:fs/promises";
import path from "node:path";
// no types exist for saxon-js; we have defined a placeholder in /src/declarations.d.ts, so the compiler does not complain
import SaxonJS from "saxonjs-he";
import { validateXML, XMLValidationResult } from "xmllint-wasm";
import { getResourcesDir } from "./resourcesDir";

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
