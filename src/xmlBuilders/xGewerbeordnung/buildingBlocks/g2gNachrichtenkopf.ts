import { optionalTag } from "../../../helpers/xmlTag";
import { createBehoerde, type Behoerde } from "./behoerde";

export interface Nachrichtenkopf {
  nachrichtenUUID?: string;
  /** Dieses Element enthält den Erstellungszeitpunkt der Nachricht - es enthält explizit nicht den Sende- und Empfangszeitpunkt. */
  erstellungszeitpunkt?: string;
  leser?: Behoerde;
  autor?: Behoerde;
}

function createLeser(leser: Behoerde | undefined) {
  if (!leser) return "";
  return `<bn-g2g:leser>${createBehoerde(leser)}</bn-g2g:leser>`;
}

function createAutor(autor: Behoerde | undefined) {
  if (!autor) return "";
  return `<bn-g2g:autor>${createBehoerde(autor)}</bn-g2g:autor>`;
}

export function createG2gNachrichtenkopf(nachrichtenkopf: Nachrichtenkopf | undefined) {
  if (!nachrichtenkopf) return "";
  return `
    <bn-g2g:nachrichtenkopf.g2g>
      <bn-g2g:identifikation.nachricht>
        ${optionalTag("bn-g2g:nachrichtenUUID", nachrichtenkopf.nachrichtenUUID)}
        <bn-g2g:nachrichtentyp listURI="urn:xoev-de:xgewerbeordnung:codeliste:nachrichtentypen" listVersionID="1.6">
          <code>0400</code>
        </bn-g2g:nachrichtentyp>
        ${optionalTag("bn-g2g:erstellungszeitpunkt", nachrichtenkopf.erstellungszeitpunkt)}
      </bn-g2g:identifikation.nachricht>
      ${createLeser(nachrichtenkopf.leser)}
      ${createAutor(nachrichtenkopf.autor)}
    </bn-g2g:nachrichtenkopf.g2g>`;
}
