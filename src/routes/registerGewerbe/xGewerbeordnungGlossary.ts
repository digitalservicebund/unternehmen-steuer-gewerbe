import fs from "node:fs/promises";
import path from "node:path";
import { getResourcesDir } from "../../helpers/xmlValidator";

// Captures `<xs:element name="X">…<xs:documentation>the domain term</xs:documentation>`.
const ELEMENT_DOCUMENTATION =
  /<xs:element name="([^"]+)"[^>]*>\s*<xs:annotation>\s*<xs:documentation>([\s\S]*?)<\/xs:documentation>/g;

let cachedTerms: Map<string, string> | undefined;

export async function loadDomainTerms(): Promise<Map<string, string>> {
  if (cachedTerms) return cachedTerms;
  cachedTerms = await readDomainTermsFromSchemas();
  return cachedTerms;
}

async function readDomainTermsFromSchemas(): Promise<Map<string, string>> {
  const schemaDir = path.join(getResourcesDir(), "xml/schemaXsd/xgewerbeordnung-1.6");
  const terms = new Map<string, string>();
  for (const file of await fs.readdir(schemaDir)) {
    if (!file.endsWith(".xsd")) continue;
    const xsd = await fs.readFile(path.join(schemaDir, file), "utf8");
    for (const [, element, documentation] of xsd.matchAll(ELEMENT_DOCUMENTATION)) {
      if (element && documentation && !terms.has(element)) {
        terms.set(element, normalizeWhitespace(documentation));
      }
    }
  }
  return terms;
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}
