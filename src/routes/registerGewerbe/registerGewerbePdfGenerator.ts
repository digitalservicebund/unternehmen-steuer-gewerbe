import { readFileSync } from "node:fs";

const gewerbeanmeldungPdfReceiptBase64 = readFileSync(
  new URL("./gewerbeanmeldungPdfReceipt.dummy.pdf", import.meta.url),
).toString("base64");

export function generatePdfReceipt(_xml: string) {
  return gewerbeanmeldungPdfReceiptBase64;
}
