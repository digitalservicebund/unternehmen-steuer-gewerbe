import { escapeXml } from "../escapeXml";
import { createBehoerde, type Behoerde } from "./behoerde";

export interface Nachrichtenkopf {
  nachrichtenUUID: string;
  /** Dieses Element enthält den Erstellungszeitpunkt der Nachricht - es enthält explizit nicht den Sende- und Empfangszeitpunkt. */
  erstellungszeitpunkt: string;
  leser: Behoerde;
  autor: Behoerde;
}

export function createG2gNachrichtenkopf(nachrichtenkopf: Nachrichtenkopf) {
  return `
    <bn-g2g:nachrichtenkopf.g2g>
      <bn-g2g:identifikation.nachricht>
        <bn-g2g:nachrichtenUUID>${escapeXml(nachrichtenkopf.nachrichtenUUID)}</bn-g2g:nachrichtenUUID>
        <bn-g2g:nachrichtentyp listURI="urn:xoev-de:xgewerbeordnung:codeliste:nachrichtentypen" listVersionID="1.6">
          <code>0300</code>
        </bn-g2g:nachrichtentyp>
        <bn-g2g:erstellungszeitpunkt>${escapeXml(nachrichtenkopf.erstellungszeitpunkt)}</bn-g2g:erstellungszeitpunkt>
      </bn-g2g:identifikation.nachricht>
      <bn-g2g:leser>
        ${createBehoerde(nachrichtenkopf.leser)}
      </bn-g2g:leser>
      <bn-g2g:autor>
        ${createBehoerde(nachrichtenkopf.autor)}
      </bn-g2g:autor>
</bn-g2g:nachrichtenkopf.g2g>`;
}
