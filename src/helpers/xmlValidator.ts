import { log } from "node:console";
import fs from "node:fs/promises";
import path from "node:path";

import { validateXML } from "xmllint-wasm";

export async function isValidXml(xml: string): Promise<boolean> {
  const schemaDir = "./src/resources/xml/xsd/xgewerbeordnung-1.6";

  // pre-loading all XSD files to be able to present to xmllint-wasm
  const files = await fs.readdir(schemaDir);
  const preload = await Promise.all(
    files
      .filter((fileName) => fileName.endsWith(".xsd"))
      .map(async (fileName) => ({
        fileName,
        contents: await fs.readFile(path.join(schemaDir, fileName), "utf8"),
      })),
  );
  const mainXsd = await fs.readFile(
    path.join(schemaDir, "xgewerbeordnung-gewerbeanzeige.xsd"),
    "utf8",
  );

  const result = await validateXML({
    xml,
    schema: [mainXsd],
    preload: preload,
  });

  // result

  if (result.valid) {
    return true;
  } else {
    // TODO: decide what to do with errors
    log(result.errors);
    return false;
  }
}
