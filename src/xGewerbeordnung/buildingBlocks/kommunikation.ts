import { xml } from "../escapeXml";

export interface Kommunikation {
  telefon?: string;
  mobiltelefon?: string;
  telefax?: string;
  email?: string;
  webseite?: string;
}

export function createKommunikation(kommunikation: Kommunikation | undefined) {
  if (!kommunikation) return "";

  return `
    <bk:kommunikation>
      ${kommunikation.telefon ? `<komm:telefon>${xml(kommunikation.telefon)}</komm:telefon>` : ""}
      ${kommunikation.mobiltelefon ? `<komm:mobiltelefon>${xml(kommunikation.mobiltelefon)}</komm:mobiltelefon>` : ""}
      ${kommunikation.telefax ? `<komm:telefax>${xml(kommunikation.telefax)}</komm:telefax>` : ""}
      ${kommunikation.email ? `<komm:email>${xml(kommunikation.email)}</komm:email>` : ""}
      ${kommunikation.webseite ? `<komm:webseite>${xml(kommunikation.webseite)}</komm:webseite>` : ""}
    </bk:kommunikation>`;
}
