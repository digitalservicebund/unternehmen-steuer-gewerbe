import { xml } from "../escapeXml";

export interface Kommunikation {
  /** Telefonnummer, strukturiert gemäß ITU E.123. Beispiel: "+49 421 1234567", "+49 421 123 4567". */
  telefon?: string;
  /** Telefaxnummer, strukturiert gemäß ITU E.123. Beispiel: "+49 421 1234567", "+49 421 123 4567". */
  telefax?: string;
  /** E-Mail-Adresse. */
  email?: string;
  /** Web-Adresse. */
  webseite?: string;
}

export function createKommunikation(kommunikation: Kommunikation | undefined) {
  if (!kommunikation) return "";

  return `
    <bk:kommunikation>
      ${kommunikation.telefon ? `<komm:telefon>${xml(kommunikation.telefon)}</komm:telefon>` : ""}
      ${kommunikation.telefax ? `<komm:telefax>${xml(kommunikation.telefax)}</komm:telefax>` : ""}
      ${kommunikation.email ? `<komm:email>${xml(kommunikation.email)}</komm:email>` : ""}
      ${kommunikation.webseite ? `<komm:webseite>${xml(kommunikation.webseite)}</komm:webseite>` : ""}
    </bk:kommunikation>`;
}
