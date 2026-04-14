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
      ${kommunikation.telefon ? `<komm:telefon>${kommunikation.telefon}</komm:telefon>` : ""}
      ${kommunikation.mobiltelefon ? `<komm:mobiltelefon>${kommunikation.mobiltelefon}</komm:mobiltelefon>` : ""}
      ${kommunikation.telefax ? `<komm:telefax>${kommunikation.telefax}</komm:telefax>` : ""}
      ${kommunikation.email ? `<komm:email>${kommunikation.email}</komm:email>` : ""}
      ${kommunikation.webseite ? `<komm:webseite>${kommunikation.webseite}</komm:webseite>` : ""}
    </bk:kommunikation>`;
}
