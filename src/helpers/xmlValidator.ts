import fs from "node:fs/promises";
import path from "node:path";

import { validateXML, XMLValidationResult } from "xmllint-wasm";

export async function isValidXml(xml: string): Promise<XMLValidationResult> {
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
  // reading the main XSD
  const mainXsd = await fs.readFile(
    path.join(schemaDir, "xgewerbeordnung-gewerbeanzeige.xsd"),
    "utf8",
  );

  return await validateXML({
    xml,
    schema: [mainXsd],
    preload: preloadedXsds,
  });
}
