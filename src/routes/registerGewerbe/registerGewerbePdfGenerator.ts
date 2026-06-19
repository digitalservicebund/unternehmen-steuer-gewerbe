// Disclaimer:
// This is considered throw-away code until we have proper specs
// Also: The PDF is far from "official". It's our home-made translation of the XGewerbeordnung-Anmeldung XML into something human-readable.

import { XMLParser } from "fast-xml-parser";
import PDFDocument from "pdfkit";

interface EnteredField {
  leafName: string;
  wert: string;
  xmlPfad: string;
}

const parser = new XMLParser({ ignoreAttributes: true, parseTagValue: false });

export async function generatePdfReceipt(xml: string): Promise<string> {
  const pdf = await renderFieldsToPdf(extractEnteredFields(xml));
  return pdf.toString("base64");
}

function extractEnteredFields(xml: string): EnteredField[] {
  return collectLeaves(parser.parse(xml), []);
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
  return wert === "" ? [] : [{ leafName: pfad.at(-1) ?? "", wert, xmlPfad: pfad.join(" > ") }];
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
  doc
    .fontSize(10)
    .text(
      "Disclaimer: This PDF is a simple representation of the data sent as XGewerbeordnung. " +
        'It\'s by no means an "official" receipt by any Gewerbeamt. ' +
        "Also, it has not been styled, yet.",
    );
  doc.moveDown();
  doc.fontSize(10);

  // Three columns: leafName | value | (path)
  // Page is 595pt wide, 50pt margins → 495pt usable starting at x=50
  const COL = { name: 50, value: 170, path: 340 };
  const COL_W = { name: 115, value: 165, path: 595 - 50 - 340 };

  for (const { leafName, wert, xmlPfad } of fields) {
    const y = doc.y;
    doc.text(leafName, COL.name, y, { width: COL_W.name, lineBreak: false });
    doc.text(wert, COL.value, y, { width: COL_W.value, lineBreak: false });
    doc.text(`(${xmlPfad})`, COL.path, y, { width: COL_W.path });
  }
  doc.end();

  return new Promise((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));
}
