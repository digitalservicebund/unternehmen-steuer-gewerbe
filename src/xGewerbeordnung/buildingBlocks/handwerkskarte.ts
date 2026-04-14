import { xml } from "../escapeXml";

export interface Handwerkskarte {
  /** Status der Handwerkskarte */
  status: string;
  /** Ausstellungsdatum der Handwerkskarte */
  ausgestelltAm?: string;
  /** Postleitzahl des Sitzes der die Handwerkskarte ausstellenden Handwerkskammer (z.B. "90489"). Das Element sollte nur angegeben werden, wenn kein Schlüssel zu der Handwerkskammer im betreffenden Element angegeben wurde. */
  ausgestelltVonPLZ?: string;
  /** Ort des Sitzes der die Handwerkskarte ausstellenden Handwerkskammer (z.B. "Nürnberg"). Das Element sollte nur angegeben werden, wenn kein Schlüssel zu der Handwerkskammer im betreffenden Element angegeben wurde */
  ausgestelltVonOrt?: string;
  /** Schlüssel der ausstellenden Handwerkskammer */
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
