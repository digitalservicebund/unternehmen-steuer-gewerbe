import { optionalTag } from "../../../helpers/xmlTag";

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
      ${optionalTag("komm:telefon", kommunikation.telefon)}
      ${optionalTag("komm:telefax", kommunikation.telefax)}
      ${optionalTag("komm:eMail", kommunikation.email)}
      ${optionalTag("komm:webAdresse", kommunikation.webAdresse)}
    </bk:kommunikation>`;
}
