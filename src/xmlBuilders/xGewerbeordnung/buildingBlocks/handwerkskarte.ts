import { escapeXml } from "../../../helpers/escapeXml";
import { isDefined } from "../../../helpers/isDefined";

export interface Handwerkskarte {
  /** Status der Handwerkskarte */
  status?: string;
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
      ${isDefined(handwerkskarte.status) ? `<xga:status><code>${escapeXml(handwerkskarte.status)}</code></xga:status>` : ""}
      ${isDefined(handwerkskarte.ausgestelltAm) ? `<xga:ausgestelltAm>${escapeXml(handwerkskarte.ausgestelltAm)}</xga:ausgestelltAm>` : ""}
      ${isDefined(handwerkskarte.ausgestelltVonPLZ) ? `<xga:ausgestelltVonPLZ>${escapeXml(handwerkskarte.ausgestelltVonPLZ)}</xga:ausgestelltVonPLZ>` : ""}
      ${isDefined(handwerkskarte.ausgestelltVonOrt) ? `<xga:ausgestelltVonOrt>${escapeXml(handwerkskarte.ausgestelltVonOrt)}</xga:ausgestelltVonOrt>` : ""}
      ${isDefined(handwerkskarte.ausgestelltVonSchluessel) ? `<xga:ausgestelltVonSchluessel listVersionID="5"><code>${escapeXml(handwerkskarte.ausgestelltVonSchluessel)}</code></xga:ausgestelltVonSchluessel>` : ""}
    </xga:handwerkskarte>`;
}
