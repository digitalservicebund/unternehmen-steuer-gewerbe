import { describe, it, expect, vi } from "vitest";
import { extractText } from "unpdf";
import { generatePdfReceipt } from "./registerGewerbePdfGenerator";

const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<np:name xmlns:np="urn:example">
  <np:familienname>Mustermann</np:familienname>
  <np:vornamen>Erika</np:vornamen>
  <np:leer></np:leer>
</np:name>`;

async function pdfText(base64: string): Promise<string> {
  const bytes = new Uint8Array(Buffer.from(base64, "base64"));
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const { text } = await extractText(bytes, { mergePages: true });
  warnSpy.mockRestore();
  return text;
}

describe("generatePdfReceipt", () => {
  it("returns a base64-encoded PDF", async () => {
    expect(await generatePdfReceipt(sampleXml)).toMatch(/^JVBERi0/);
  });

  it("labels each value with its leaf node name and (simplified) XML path", async () => {
    const text = await pdfText(await generatePdfReceipt(sampleXml));
    // domain term (from XSD documentation), value, and the XML path
    expect(text).toContain("familienname");
    expect(text).toContain("Mustermann");
    expect(text).toContain("(name > familienname)");
  });

  it("omits fields left empty", async () => {
    const text = await pdfText(await generatePdfReceipt(sampleXml));
    expect(text).not.toContain("leer");
  });
});
