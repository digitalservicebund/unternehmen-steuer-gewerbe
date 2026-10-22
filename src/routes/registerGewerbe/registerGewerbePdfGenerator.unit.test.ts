import { describe, it, expect, vi } from "vitest";
import { extractText, getDocumentProxy } from "unpdf";
import { generatePdfReceipt } from "./registerGewerbePdfGenerator";
import { buildReceipt } from "./receiptFields";
import { gewerbeanmeldungFixture, gewerbeRoutingInfoFixture } from "./testHelpers";
import { type CreateGewerbeanmeldungXmlData } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";

const LONG_AMT_NAME =
  "Amt Arensharde - Fachbereich Bürgerservice und Öffentliche Sicherheit - Sachgebiet Allg. Ordnungswesen, Brandschutz";
const LONG_TAETIGKEIT =
  "Herstellung, Vertrieb und Reparatur von Möbeln aller Art, Elektroinstallationen, " +
  "Großhandel mit Lebensmitteln, Betrieb eines Onlineshops für Textilien sowie Beratung " +
  "von Unternehmen bei der Auswahl von Büroausstattung und deren Montage vor Ort.";

async function renderPdf(
  anmeldung: CreateGewerbeanmeldungXmlData = gewerbeanmeldungFixture(),
  routingInfo = gewerbeRoutingInfoFixture(),
): Promise<Uint8Array> {
  const base64 = await generatePdfReceipt(anmeldung, routingInfo);
  return new Uint8Array(Buffer.from(base64, "base64"));
}

async function pdfPages(bytes: Uint8Array): Promise<string[]> {
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const { text } = await extractText(bytes, { mergePages: false });
  warnSpy.mockRestore();
  return text;
}

async function pdfText(bytes: Uint8Array): Promise<string> {
  return (await pdfPages(bytes)).join("\n");
}

// ISO 32000-1:2008, 14.8.4
const STANDARD_STRUCTURE_TYPES = [
  "Root",
  "Document",
  "Part",
  "Art",
  "Sect",
  "Div",
  "BlockQuote",
  "Caption",
  "TOC",
  "TOCI",
  "Index",
  "NonStruct",
  "Private",
  "P",
  "H",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "L",
  "LI",
  "Lbl",
  "LBody",
  "Table",
  "TR",
  "TH",
  "TD",
  "THead",
  "TBody",
  "TFoot",
  "Span",
  "Quote",
  "Note",
  "Reference",
  "BibEntry",
  "Code",
  "Link",
  "Annot",
  "Figure",
  "Formula",
  "Form",
];

interface TextItem {
  text: string;
  baseline: number;
}

async function firstPageItems(bytes: Uint8Array): Promise<TextItem[]> {
  const pdf = await getDocumentProxy(bytes);
  const content = await (await pdf.getPage(1)).getTextContent();
  return content.items
    .filter((item) => "str" in item && item.str.trim().length > 0)
    .map((item) => ({
      text: "str" in item ? item.str : "",
      baseline: "transform" in item ? (item.transform[5] ?? 0) : 0,
    }));
}

interface StructNode {
  role?: string;
  children?: unknown[];
}

function structRoles(node: unknown): string[] {
  if (node === null || typeof node !== "object") return [];
  const { role, children } = node as StructNode;
  const childRoles = (children ?? []).flatMap((child) => structRoles(child));
  return [role, ...childRoles].filter((candidate) => candidate !== undefined);
}

async function allStructRoles(
  pdf: Awaited<ReturnType<typeof getDocumentProxy>>,
): Promise<string[]> {
  const roles: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    roles.push(...structRoles(await (await pdf.getPage(pageNumber)).getStructTree()));
  }
  return roles;
}

describe("generatePdfReceipt", () => {
  it("returns a base64-encoded PDF", async () => {
    const base64 = await generatePdfReceipt(gewerbeanmeldungFixture(), gewerbeRoutingInfoFixture());

    expect(base64).toMatch(/^JVBERi0/);
  });

  it("renders A4 pages", async () => {
    const pdf = await getDocumentProxy(await renderPdf());
    const viewport = (await pdf.getPage(1)).getViewport({ scale: 1 });

    expect(viewport.width).toBeCloseTo(595.28, 1);
    expect(viewport.height).toBeCloseTo(841.89, 1);
  });

  it("shows the issuing authority, Gemeindekennzahl and sender in the header", async () => {
    const text = await pdfText(await renderPdf());

    expect(text).toContain("Name der ausstellenden Behörde");
    expect(text).toContain("Ordnungsamt Musterstadt");
    expect(text).toContain("Gemeindekennzahl");
    expect(text).toContain("11000000");
    expect(text).toContain("Übermittelt durch");
    expect(text).toContain("Einfach Gründen");
  });

  it("states that the document is not a Gewerbeschein", async () => {
    const text = await pdfText(await renderPdf());

    expect(text).toContain("Hinweis: Dieses Dokument ist kein Gewerbeschein");
    expect(text).toContain("Den Gewerbeschein bekommen");
  });

  it("shows title, GewA 1 reference and all section headings", async () => {
    const text = await pdfText(await renderPdf());

    expect(text).toContain("Bestätigung über den Eingang der Gewerbeanmeldung");
    expect(text).toContain("Feldnummern entsprechen dem amtlichen Vordruck GewA 1");
    expect(text).toContain("Angaben zur Gewerbeanmeldung");
    expect(text).toContain("Angaben zur Person");
    expect(text).toContain("Angaben zum Betrieb");
    expect(text).toContain("Erlaubnisse und Nachweise");
    expect(text).toContain("Weitere Felder der Gewerbeanmeldung");
  });

  it("renders the transmitted values in human-readable form", async () => {
    const text = await pdfText(await renderPdf());

    expect(text).toContain("Mustermann");
    expect(text).toContain("26. August 2020");
    expect(text).toContain("Neugründung");
    expect(text).toContain("Einzelunternehmen");
    expect(text).toContain("deutsch");
    expect(text).toContain("Musterstraße 1, 12345 Musterstadt");
    expect(text).toContain("Mustertätigkeit");
    expect(text).toContain("1 / 0");
  });

  it("marks every field without a transmitted value with an em dash", async () => {
    const text = await pdfText(await renderPdf());
    const emptyRows = buildReceipt(gewerbeanmeldungFixture(), gewerbeRoutingInfoFixture())
      .sections.flatMap((section) => section.rows)
      .filter((row) => row.value === undefined);

    expect(emptyRows.length).toBeGreaterThan(0);
    expect(text.match(/—/g) ?? []).toHaveLength(emptyRows.length);
  });

  it("contains no XML paths or internal identifiers", async () => {
    const anmeldung = gewerbeanmeldungFixture();
    const text = await pdfText(await renderPdf(anmeldung));

    expect(text).not.toContain("np:");
    expect(text).not.toContain("xga:");
    expect(text).not.toContain(anmeldung.gewerbebetrieb?.gewerbebetriebID ?? "gewerbebetriebID");
    expect(text).not.toContain(anmeldung.anzeigerenderId ?? "anzeigerenderId");
  });

  it("footers every page with creation date, page number and the Gewerbeanzeige uuid", async () => {
    const pages = await pdfPages(await renderPdf());

    expect(pages.length).toBeGreaterThan(1);
    pages.forEach((page, index) => {
      expect(page).toContain("Erstellt:");
      expect(page).toContain(`Seite ${index + 1} von ${pages.length}`);
      expect(page).toContain("ID: dcfb0861-396d-4551-a995-9fedbed0e68b");
    });
  });

  it("wraps long authority names and long Tätigkeiten instead of dropping them", async () => {
    const anmeldung = gewerbeanmeldungFixture();
    anmeldung.gewerbebetrieb!.taetigkeitenGesamt = {
      schwerpunkt: { taetigkeitSchwerpunkt: LONG_TAETIGKEIT },
    };
    const routingInfo = gewerbeRoutingInfoFixture();
    routingInfo.gewerbeamt = { name: LONG_AMT_NAME };

    const bytes = await renderPdf(anmeldung, routingInfo);
    // pdf.js detaches the buffer it reads, so parse a copy first.
    const text = (await pdfText(bytes.slice())).replace(/\s+/g, " ");

    expect(text).toContain(LONG_AMT_NAME);
    expect(text).toContain(LONG_TAETIGKEIT);

    const items = await firstPageItems(bytes);
    const headerBottom = Math.min(
      ...items
        .filter((item) => LONG_AMT_NAME.includes(item.text.trim()))
        .map((item) => item.baseline),
    );
    const notice = items.find((item) => item.text.startsWith("Hinweis:"));

    // Baselines grow upwards, so a smaller one means the notice sits below the header.
    expect(notice?.baseline).toBeLessThan(headerBottom);
  });

  it("repeats the section heading when a section continues on the next page", async () => {
    const anmeldung = gewerbeanmeldungFixture();
    anmeldung.gewerbebetrieb!.taetigkeitenGesamt = {
      schwerpunkt: { taetigkeitSchwerpunkt: LONG_TAETIGKEIT.repeat(8) },
    };
    anmeldung.gewerbebetrieb!.geschaeftsbezeichnung = LONG_TAETIGKEIT.repeat(6);

    const text = await pdfText(await renderPdf(anmeldung));

    expect(text).toContain("(Fortsetzung)");
  });

  it("marks the PDF as tagged and declares title and language", async () => {
    const bytes = await renderPdf();
    const pdf = await getDocumentProxy(bytes);
    const markInfo = await pdf.getMarkInfo();
    const metadata = await pdf.getMetadata();

    // pdf.js returns a Map here, despite its declared object type.
    expect(markInfo).toEqual(
      new Map([
        ["Marked", true],
        ["UserProperties", false],
        ["Suspects", false],
      ]),
    );
    expect(metadata.info).toMatchObject({
      Title: "Bestätigung über den Eingang der Gewerbeanmeldung",
      Language: "de-DE",
    });
  });

  // PDF/UA-1 7.1-5: non-standard types would need a role map, which we do not write.
  it("uses only standard PDF 1.7 structure types", async () => {
    const pdf = await getDocumentProxy(await renderPdf());
    const roles = new Set(await allStructRoles(pdf));

    expect([...roles].filter((role) => !STANDARD_STRUCTURE_TYPES.includes(role))).toEqual([]);
  });

  // PDF/UA-1 7.5-1: without Scope, a value cell has no resolvable header.
  it("scopes every header cell to its row", async () => {
    const bytes = await renderPdf();
    const scopes =
      Buffer.from(bytes)
        .toString("latin1")
        .match(/\/Scope \/Row/g) ?? [];
    const pdf = await getDocumentProxy(bytes);
    const headerCells = (await allStructRoles(pdf)).filter((role) => role === "TH");

    expect(headerCells.length).toBeGreaterThan(0);
    expect(scopes).toHaveLength(headerCells.length);
  });

  it("tags headings and label/value pairs as a table", async () => {
    const pdf = await getDocumentProxy(await renderPdf());
    const roles = await structRoles(await (await pdf.getPage(1)).getStructTree());

    expect(roles).toEqual(
      expect.arrayContaining(["Document", "H1", "H2", "Table", "TR", "TH", "TD"]),
    );
  });
});
