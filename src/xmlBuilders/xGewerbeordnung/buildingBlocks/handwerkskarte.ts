import { optionalTag, optionalWrappedTag } from "../../../helpers/xmlTag";

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
      ${optionalWrappedTag("xga:status", "code", handwerkskarte.status)}
      ${optionalTag("xga:ausgestelltAm", handwerkskarte.ausgestelltAm)}
      ${optionalTag("xga:ausgestelltVonPLZ", handwerkskarte.ausgestelltVonPLZ)}
      ${optionalTag("xga:ausgestelltVonOrt", handwerkskarte.ausgestelltVonOrt)}
      ${optionalWrappedTag("xga:ausgestelltVonSchluessel", "code", handwerkskarte.ausgestelltVonSchluessel, ' listVersionID="5"')}
    </xga:handwerkskarte>`;
}
