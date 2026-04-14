import { xml } from "../escapeXml";

export interface Handwerkskarte {
  /** Code des Status der Handwerkskarte, listVersionID="1". */
  status: string;
  /** Ausstellungsdatum der Handwerkskarte. */
  ausgestelltAm?: string;
  /** PLZ der ausstellenden HWK. */
  ausgestelltVonPLZ?: string;
  /** Ort der ausstellenden HWK. */
  ausgestelltVonOrt?: string;
  /** Schlüssel der ausstellenden Handwerkskammer, listVersionID="5". */
  ausgestelltVonSchluessel?: string;
}

export function createHandwerkskarte(handwerkskarte: Handwerkskarte | undefined) {
  if (!handwerkskarte) return "";

  return `
    <xga:handwerkskarte>
      <xga:status>
        <code>${xml(handwerkskarte.status)}</code>
      </xga:status>
      ${handwerkskarte.ausgestelltAm ? `<xga:ausgestelltAm>${xml(handwerkskarte.ausgestelltAm)}</xga:ausgestelltAm>` : ""}
      ${handwerkskarte.ausgestelltVonPLZ ? `<xga:ausgestelltVonPLZ>${xml(handwerkskarte.ausgestelltVonPLZ)}</xga:ausgestelltVonPLZ>` : ""}
      ${handwerkskarte.ausgestelltVonOrt ? `<xga:ausgestelltVonOrt>${xml(handwerkskarte.ausgestelltVonOrt)}</xga:ausgestelltVonOrt>` : ""}
      ${handwerkskarte.ausgestelltVonSchluessel ? `<xga:ausgestelltVonSchluessel listVersionID="5"><code>${xml(handwerkskarte.ausgestelltVonSchluessel)}</code></xga:ausgestelltVonSchluessel>` : ""}
    </xga:handwerkskarte>`;
}
