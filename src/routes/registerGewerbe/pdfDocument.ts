import fs from "node:fs/promises";
import path from "node:path";
import PDFDocument from "pdfkit";
import { getResourcesDir } from "../../helpers/resourcesDir";
import { LINE_GAP, PAGE_MARGIN } from "./pdfTheme";

export const FONT_REGULAR = "BundesSansDTPRegular";
export const FONT_BOLD = "BundesSansDTPBold";

const PDF_VERSION = "1.7";
const PDF_LANGUAGE = "de-DE";
const PDF_CREATOR = "DigitalService GmbH des Bundes";
const PDF_AUTHOR = "Einfach Gründen";
export const BOTTOM_MARGIN = 90;

interface ReceiptFonts {
  regular: Buffer;
  bold: Buffer;
}

let cachedFonts: ReceiptFonts | undefined;

async function getFonts(): Promise<ReceiptFonts> {
  if (cachedFonts) return cachedFonts;
  const fontsDir = path.join(getResourcesDir(), "fonts");
  const [regular, bold] = await Promise.all([
    fs.readFile(path.join(fontsDir, "BundesSans-DTP-Regular.otf")),
    fs.readFile(path.join(fontsDir, "BundesSans-DTP-Bold.otf")),
  ]);
  cachedFonts = { regular, bold };
  return cachedFonts;
}

export async function createReceiptDocument(title: string): Promise<PDFKit.PDFDocument> {
  const document = new PDFDocument({
    bufferPages: true,
    pdfVersion: PDF_VERSION,
    lang: PDF_LANGUAGE,
    tagged: true,
    displayTitle: true,
    size: "A4",
    margins: {
      top: PAGE_MARGIN,
      left: PAGE_MARGIN,
      right: PAGE_MARGIN,
      bottom: BOTTOM_MARGIN,
    },
    fontLayoutCache: true,
    subset: "PDF/UA" as PDFKit.Mixins.PDFSubsets,
  });

  const fonts = await getFonts();
  document.registerFont(FONT_REGULAR, fonts.regular);
  document.registerFont(FONT_BOLD, fonts.bold);
  document.lineGap(LINE_GAP);

  document.info.Title = title;
  document.info.Author = PDF_AUTHOR;
  document.info.Creator = PDF_CREATOR;
  document.info.CreationDate = new Date();

  return document;
}

export function buildDocumentBuffer(
  document: PDFKit.PDFDocument,
  build: () => void,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    document.on("data", (chunk) => chunks.push(chunk));
    document.on("error", (error: Error) => reject(error));
    document.on("end", () => resolve(Buffer.concat(chunks)));

    build();
    document.end();
  });
}
