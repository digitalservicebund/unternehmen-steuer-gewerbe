// Disclaimer:
// This is considered throw-away code until we have proper specs
// Also: The PDF is far from "official". It's our home-made translation of the XGewerbeordnung-Anmeldung XML into something human-readable.

import { XMLParser } from "fast-xml-parser";
import PDFDocument from "pdfkit";
import { loadDomainTerms } from "./xGewerbeordnungGlossary";

interface Leaf {
  pfad: string[];
  wert: string;
}

interface EnteredField {
  domainTerm: string;
  wert: string;
  xmlPfad: string;
}

// Wrapper elements that carry no domain meaning of their own; the meaning
// belongs to their parent (e.g. `grundAnmeldungSchluessel > code`).
const GENERIC_WRAPPER_TAGS = new Set(["code"]);

const parser = new XMLParser({ ignoreAttributes: true, parseTagValue: false });

export async function generatePdfReceipt(xml: string): Promise<string> {
  const domainTerms = await loadDomainTerms();
  const fields = extractEnteredFields(xml).map((leaf) => describeField(leaf, domainTerms));
  const pdf = await renderFieldsToPdf(fields);
  return pdf.toString("base64");
}

function extractEnteredFields(xml: string): Leaf[] {
  return collectLeaves(parser.parse(xml), []);
}

function collectLeaves(node: unknown, pfad: string[]): Leaf[] {
  if (Array.isArray(node)) {
    return node.flatMap((eintrag) => collectLeaves(eintrag, pfad));
  }
  if (node !== null && typeof node === "object") {
    return Object.entries(node).flatMap(([tag, wert]) =>
      collectLeaves(wert, [...pfad, localName(tag)]),
    );
  }
  const wert = String(node).trim();
  return wert === "" ? [] : [{ pfad, wert }];
}

function localName(tag: string): string {
  const lastColon = tag.lastIndexOf(":");
  return lastColon === -1 ? tag : tag.slice(lastColon + 1);
}

function describeField(leaf: Leaf, domainTerms: Map<string, string>): EnteredField {
  const tag = meaningfulTag(leaf.pfad);
  return {
    domainTerm: domainTerms.get(tag) ?? tag,
    wert: leaf.wert,
    xmlPfad: leaf.pfad.join(" > "),
  };
}

function meaningfulTag(pfad: string[]): string {
  return pfad.findLast((segment) => !GENERIC_WRAPPER_TAGS.has(segment)) ?? pfad.at(-1) ?? "";
}

function renderFieldsToPdf(fields: EnteredField[]): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(16).text("Gewerbeanmeldung – erfasste Daten", { underline: true });
  doc.moveDown();
  doc
    .fontSize(10)
    .text(
      "Disclaimer: This PDF is a simple representation of the data sent as XGewerbeordnung. " +
        'It\'s by no means an "official" receipt by any Gewerbeamt. ' +
        "Also, it has not been styled, yet.",
    );
  doc.moveDown();
  doc.fontSize(10);
  for (const { domainTerm, wert, xmlPfad } of fields) {
    doc.text(`${domainTerm}: ${wert} (${xmlPfad})`);
  }
  doc.end();

  return new Promise((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));
}
