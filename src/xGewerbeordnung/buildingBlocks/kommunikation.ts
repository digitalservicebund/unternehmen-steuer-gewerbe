import { escapeXml } from "../escapeXml";

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
      ${kommunikation.telefon ? `<komm:telefon>${escapeXml(kommunikation.telefon)}</komm:telefon>` : ""}
      ${kommunikation.telefax ? `<komm:telefax>${escapeXml(kommunikation.telefax)}</komm:telefax>` : ""}
      ${kommunikation.email ? `<komm:email>${escapeXml(kommunikation.email)}</komm:email>` : ""}
      ${kommunikation.webseite ? `<komm:webseite>${escapeXml(kommunikation.webseite)}</komm:webseite>` : ""}
    </bk:kommunikation>`;
}
