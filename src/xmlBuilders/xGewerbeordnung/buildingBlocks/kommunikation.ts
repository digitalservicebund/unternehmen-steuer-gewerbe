import { escapeXml } from "../../../helpers/escapeXml";

export interface Kommunikation {
  /** Telefonnummer, strukturiert gemäß ITU E.123. Beispiel: "+49 421 1234567", "+49 421 123 4567". */
  telefon?: string;
  /** Telefaxnummer, strukturiert gemäß ITU E.123. Beispiel: "+49 421 1234567", "+49 421 123 4567". */
  telefax?: string;
  /** E-Mail-Adresse. */
  email?: string;
  /** Web-Adresse. */
  webAdresse?: string;
}

export function createKommunikation(kommunikation: Kommunikation | undefined) {
  if (!kommunikation) return "";

  return `
    <bk:kommunikation>
      ${kommunikation.telefon ? `<komm:telefon>${escapeXml(kommunikation.telefon)}</komm:telefon>` : ""}
      ${kommunikation.telefax ? `<komm:telefax>${escapeXml(kommunikation.telefax)}</komm:telefax>` : ""}
      ${kommunikation.email ? `<komm:eMail>${escapeXml(kommunikation.email)}</komm:eMail>` : ""}
      ${kommunikation.webAdresse ? `<komm:webAdresse>${escapeXml(kommunikation.webAdresse)}</komm:webAdresse>` : ""}
    </bk:kommunikation>`;
}
