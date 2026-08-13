import { type CreateGewerbeanmeldungXmlData } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { type GewerbeRoutingInfo } from "./getGewerbeRoutingInfo";
import {
  BOTTOM_MARGIN,
  createReceiptDocument,
  FONT_BOLD,
  FONT_REGULAR,
  buildDocumentBuffer,
} from "./pdfDocument";
import {
  buildReceipt,
  RECEIPT_NOTICE_TEXT,
  RECEIPT_NOTICE_TITLE,
  RECEIPT_SUBLINE,
  RECEIPT_TITLE,
  type Receipt,
  type ReceiptRow,
  type ReceiptSection,
} from "./receiptFields";
import {
  COLORS,
  CONTENT_TOP_FOLLOWING_PAGES,
  CONTENT_WIDTH,
  EMPTY_VALUE,
  FONT_SIZES,
  FOOTER,
  HEADER,
  LINE_GAP,
  NOTICE,
  PAGE_HEIGHT,
  PAGE_MARGIN,
  ROW,
  ROW_VALUE_WIDTH,
  SECTION,
  TITLE,
} from "./pdfTheme";

const CONTENT_BOTTOM = PAGE_HEIGHT - BOTTOM_MARGIN;
const MIN_ROWS_WITH_HEADING = 3;

export async function generatePdfReceipt(
  anmeldung: CreateGewerbeanmeldungXmlData,
  routingInfo: GewerbeRoutingInfo,
): Promise<string> {
  const receipt = buildReceipt(anmeldung, routingInfo);
  const document = await createReceiptDocument(RECEIPT_TITLE);

  const pdf = await buildDocumentBuffer(document, () => {
    const documentStruct = document.struct("Document");
    document.addStructure(documentStruct);

    renderHeader(document, documentStruct, receipt);
    renderNotice(document, documentStruct);
    renderTitle(document, documentStruct);
    receipt.sections.forEach((section) => renderSection(document, documentStruct, section));
    renderFooters(document, receipt);

    documentStruct.end();
  });

  return pdf.toString("base64");
}

function renderHeader(
  document: PDFKit.PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  receipt: Receipt,
): void {
  const headerStruct = document.struct("Sect");

  const cells: {
    label: string;
    value: string;
    x: number;
    width: number;
    align: "left" | "right";
  }[] = [
    {
      label: "Name der ausstellenden Behörde",
      value: receipt.behoerdenName,
      x: PAGE_MARGIN,
      width: HEADER.columnWidth,
      align: "left",
    },
    {
      label: "Gemeindekennzahl",
      value: receipt.gemeindekennzahl,
      x: PAGE_MARGIN + HEADER.gemeindekennzahlOffset,
      width: HEADER.columnWidth,
      align: "left",
    },
    {
      label: "Übermittelt durch",
      value: receipt.submittedBy,
      x: PAGE_MARGIN + CONTENT_WIDTH - HEADER.uebermitteltColumnWidth,
      width: HEADER.uebermitteltColumnWidth,
      align: "right",
    },
  ];

  const valueTop = HEADER.valueBaseline - FONT_SIZES.metaValue;
  const headerBottom = cells.reduce<number>((bottom, cell) => {
    const height = document
      .font(FONT_BOLD)
      .fontSize(FONT_SIZES.metaValue)
      .heightOfString(cell.value, { width: cell.width });
    return Math.max(bottom, valueTop + height + 4);
  }, HEADER.ruleFromTop);

  cells.forEach((cell) => {
    const cellStruct = document.struct("P", {}, () => {
      document
        .font(FONT_REGULAR)
        .fontSize(FONT_SIZES.metaLabel)
        .fillColor(COLORS.label)
        .text(cell.label, cell.x, HEADER.labelBaseline - FONT_SIZES.metaLabel, {
          width: cell.width,
          align: cell.align,
        });

      document
        .font(FONT_BOLD)
        .fontSize(FONT_SIZES.metaValue)
        .fillColor(COLORS.text)
        .text(cell.value, cell.x, HEADER.valueBaseline - FONT_SIZES.metaValue, {
          width: cell.width,
          align: cell.align,
        });
    });
    headerStruct.add(cellStruct);
  });

  headerStruct.end();
  documentStruct.add(headerStruct);

  document.markContent("Artifact", { type: "Layout" });
  document
    .moveTo(PAGE_MARGIN, headerBottom)
    .lineTo(PAGE_MARGIN + CONTENT_WIDTH, headerBottom)
    .lineWidth(FOOTER.ruleWidth)
    .strokeColor(COLORS.rule)
    .stroke();
  document.endMarkedContent();

  document.y = Math.max(NOTICE.top, headerBottom + 13);
}

function renderNotice(
  document: PDFKit.PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
): void {
  const top = document.y;
  const textX = PAGE_MARGIN + NOTICE.accentBarWidth + NOTICE.paddingHorizontal;
  const textWidth = CONTENT_WIDTH - 2 * NOTICE.paddingHorizontal - NOTICE.accentBarWidth;

  const titleHeight = document
    .font(FONT_BOLD)
    .fontSize(FONT_SIZES.body)
    .heightOfString(RECEIPT_NOTICE_TITLE, { width: textWidth });
  const textHeight = document
    .font(FONT_REGULAR)
    .fontSize(FONT_SIZES.body)
    .heightOfString(RECEIPT_NOTICE_TEXT, { width: textWidth });
  const boxHeight = NOTICE.paddingVertical * 2 + titleHeight + textHeight + 6;

  document.markContent("Artifact", { type: "Layout" });
  document.rect(PAGE_MARGIN, top, CONTENT_WIDTH, boxHeight).fill(COLORS.noticeBackground);
  document.rect(PAGE_MARGIN, top, NOTICE.accentBarWidth, boxHeight).fill(COLORS.accent);
  document.endMarkedContent();

  const noticeStruct = document.struct("Sect");
  noticeStruct.add(
    document.struct("P", {}, () => {
      document
        .font(FONT_BOLD)
        .fontSize(FONT_SIZES.body)
        .fillColor(COLORS.text)
        .text(RECEIPT_NOTICE_TITLE, textX, top + NOTICE.paddingVertical, {
          width: textWidth,
        });
    }),
  );
  noticeStruct.add(
    document.struct("P", {}, () => {
      document
        .font(FONT_REGULAR)
        .fontSize(FONT_SIZES.body)
        .fillColor(COLORS.text)
        .text(RECEIPT_NOTICE_TEXT, textX, document.y + 6, { width: textWidth });
    }),
  );
  noticeStruct.end();
  documentStruct.add(noticeStruct);

  document.y = top + boxHeight + NOTICE.spaceAfter;
}

function renderTitle(
  document: PDFKit.PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
): void {
  const titleStruct = document.struct("H1", {}, () => {
    document
      .font(FONT_BOLD)
      .fontSize(FONT_SIZES.title)
      .fillColor(COLORS.text)
      .text(RECEIPT_TITLE, PAGE_MARGIN, document.y, { width: CONTENT_WIDTH });
  });
  titleStruct.end();
  documentStruct.add(titleStruct);

  const sublineStruct = document.struct("P", {}, () => {
    document
      .font(FONT_REGULAR)
      .fontSize(FONT_SIZES.body)
      .fillColor(COLORS.label)
      .text(RECEIPT_SUBLINE, PAGE_MARGIN, document.y + TITLE.sublineSpace, {
        width: CONTENT_WIDTH,
      });
  });
  sublineStruct.end();
  documentStruct.add(sublineStruct);

  document.y += TITLE.spaceAfter;
}

function renderSection(
  document: PDFKit.PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  section: ReceiptSection,
): void {
  const sectionStruct = document.struct("Sect");
  documentStruct.add(sectionStruct);

  const headingHeight =
    FONT_SIZES.sectionHeading + SECTION.underlineOffset + SECTION.spaceAfterHeading;
  const sectionHeight = section.rows.reduce(
    (height, row) => height + rowHeight(document, row),
    headingHeight,
  );
  const keptTogetherHeight =
    sectionHeight <= CONTENT_BOTTOM - CONTENT_TOP_FOLLOWING_PAGES
      ? sectionHeight
      : section.rows
          .slice(0, MIN_ROWS_WITH_HEADING)
          .reduce((height, row) => height + rowHeight(document, row), headingHeight);

  if (document.y + SECTION.spaceBefore + keptTogetherHeight > CONTENT_BOTTOM) {
    addPage(document);
  } else {
    document.y += SECTION.spaceBefore;
  }

  renderSectionHeading(document, sectionStruct, section.title);

  const tableStruct = document.struct("Table");
  sectionStruct.add(tableStruct);
  section.rows.forEach((row) => renderRow(document, tableStruct, row, section.title));
  tableStruct.end();

  sectionStruct.end();
}

function headingText(document: PDFKit.PDFDocument, title: string): void {
  document
    .font(FONT_BOLD)
    .fontSize(FONT_SIZES.sectionHeading)
    .fillColor(COLORS.accent)
    .text(title, PAGE_MARGIN, document.y, { width: CONTENT_WIDTH });
}

function headingUnderline(document: PDFKit.PDFDocument): void {
  const underlineY = document.y + SECTION.underlineOffset - FONT_SIZES.sectionHeading;
  document
    .moveTo(PAGE_MARGIN, underlineY)
    .lineTo(PAGE_MARGIN + CONTENT_WIDTH, underlineY)
    .lineWidth(SECTION.underlineWidth)
    .strokeColor(COLORS.accent)
    .stroke();

  document.y = underlineY + SECTION.spaceAfterHeading;
}

function renderSectionHeading(
  document: PDFKit.PDFDocument,
  sectionStruct: PDFKit.PDFStructureElement,
  title: string,
): void {
  sectionStruct.add(document.struct("H2", {}, () => headingText(document, title)));

  document.markContent("Artifact", { type: "Layout" });
  headingUnderline(document);
  document.endMarkedContent();
}

function rowHeight(document: PDFKit.PDFDocument, row: ReceiptRow): number {
  const labelHeight = document
    .font(FONT_REGULAR)
    .fontSize(FONT_SIZES.body)
    .heightOfString(row.label, { width: ROW.labelWidth, lineGap: LINE_GAP });
  const valueHeight = document
    .font(FONT_BOLD)
    .fontSize(FONT_SIZES.body)
    .heightOfString(row.value ?? EMPTY_VALUE, {
      width: ROW_VALUE_WIDTH,
      lineGap: LINE_GAP,
    });
  return Math.max(labelHeight, valueHeight) + ROW.gap;
}

function renderRow(
  document: PDFKit.PDFDocument,
  tableStruct: PDFKit.PDFStructureElement,
  row: ReceiptRow,
  sectionTitle: string,
): void {
  const height = rowHeight(document, row);
  if (document.y + height > CONTENT_BOTTOM) {
    addPage(document);
    renderContinuedHeading(document, sectionTitle);
  }

  const top = document.y;
  const pagesBefore = document.bufferedPageRange().count;

  // PDF/UA-1 7.5-1: without Scope the TD has no resolvable header.
  const labelCell = document.struct("TH", { scope: "Row" }, () => {
    document.font(FONT_REGULAR).fillColor(COLORS.label);
    if (row.gewaNumber !== undefined) {
      document.fontSize(FONT_SIZES.gewaNumber).text(row.gewaNumber, PAGE_MARGIN, top + 1.5, {
        width: ROW.gewaNumberWidth,
        align: "right",
        lineBreak: false,
      });
    }
    document.fontSize(FONT_SIZES.body).text(row.label, PAGE_MARGIN + ROW.labelOffset, top, {
      width: ROW.labelWidth,
      lineGap: LINE_GAP,
    });
  });

  const valueCell = document.struct("TD", {}, () => {
    document
      .font(FONT_BOLD)
      .fontSize(FONT_SIZES.body)
      .fillColor(row.value === undefined ? COLORS.label : COLORS.text)
      .text(row.value ?? EMPTY_VALUE, PAGE_MARGIN + ROW.valueOffset, top, {
        width: ROW_VALUE_WIDTH,
        lineGap: LINE_GAP,
      });
  });

  tableStruct.add(document.struct("TR", {}, [labelCell, valueCell]));

  const valueSpilledOverPage = document.bufferedPageRange().count !== pagesBefore;
  document.y = valueSpilledOverPage ? document.y + ROW.gap : top + height;
}

function renderContinuedHeading(document: PDFKit.PDFDocument, sectionTitle: string): void {
  // The section is tagged once, so the repeat stays an artifact.
  document.markContent("Artifact", { type: "Pagination" });
  headingText(document, `${sectionTitle} (Fortsetzung)`);
  headingUnderline(document);
  document.endMarkedContent();
}

function addPage(document: PDFKit.PDFDocument): void {
  document.addPage();
  document.y = CONTENT_TOP_FOLLOWING_PAGES;
}

function renderFooters(document: PDFKit.PDFDocument, receipt: Receipt): void {
  const { count } = document.bufferedPageRange();

  for (let pageIndex = 0; pageIndex < count; pageIndex++) {
    document.switchToPage(pageIndex);
    document.page.margins.bottom = 0;

    const ruleY = PAGE_HEIGHT - FOOTER.ruleFromBottom;
    const textY = PAGE_HEIGHT - FOOTER.baselineFromBottom - FONT_SIZES.footer;

    document.markContent("Artifact", { type: "Pagination" });
    document
      .moveTo(PAGE_MARGIN, ruleY)
      .lineTo(PAGE_MARGIN + CONTENT_WIDTH, ruleY)
      .lineWidth(FOOTER.ruleWidth)
      .strokeColor(COLORS.rule)
      .stroke();

    document.font(FONT_REGULAR).fontSize(FONT_SIZES.footer).fillColor(COLORS.label);
    document.text(`Erstellt: ${receipt.createdAt}`, PAGE_MARGIN, textY, {
      width: CONTENT_WIDTH,
      align: "left",
      lineBreak: false,
    });
    document.text(`Seite ${pageIndex + 1} von ${count}`, PAGE_MARGIN, textY, {
      width: CONTENT_WIDTH,
      align: "center",
      lineBreak: false,
    });
    document.text(`ID: ${receipt.anzeigeId}`, PAGE_MARGIN, textY, {
      width: CONTENT_WIDTH,
      align: "right",
      lineBreak: false,
    });
    document.endMarkedContent();
  }
}
