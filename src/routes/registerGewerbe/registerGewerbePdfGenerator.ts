import { XMLParser } from "fast-xml-parser";
import PDFDocument from "pdfkit";

interface EnteredField {
  feld: string;
  wert: string;
}

const parser = new XMLParser({ ignoreAttributes: true, parseTagValue: false });

export async function generatePdfReceipt(xml: string): Promise<string> {
  const pdf = await renderFieldsToPdf(extractEnteredFields(xml));
  return pdf.toString("base64");
}

function extractEnteredFields(xml: string): EnteredField[] {
  const parsed = parser.parse(xml) as Record<string, unknown>;
  return Object.values(parsed).flatMap((root) => collectLeaves(root, []));
}

function collectLeaves(node: unknown, pfad: string[]): EnteredField[] {
  if (Array.isArray(node)) {
    return node.flatMap((eintrag) => collectLeaves(eintrag, pfad));
  }
  if (node !== null && typeof node === "object") {
    return Object.entries(node).flatMap(([tag, wert]) =>
      collectLeaves(wert, [...pfad, localName(tag)]),
    );
  }
  const wert = String(node).trim();
  return wert === "" ? [] : [{ feld: pfad.join(" > "), wert }];
}

function localName(tag: string): string {
  const lastColon = tag.lastIndexOf(":");
  return lastColon === -1 ? tag : tag.slice(lastColon + 1);
}

function renderFieldsToPdf(fields: EnteredField[]): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(16).text("Gewerbeanmeldung – erfasste Daten", { underline: true });
  doc.moveDown();
  doc.fontSize(10);
  for (const { feld, wert } of fields) {
    doc.text(`${feld}: ${wert}`);
  }
  doc.end();

  return new Promise((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));
}
