import { xml } from "../escapeXml";

export interface Behoerde {
  /** Dieses Element enthält die eindeutige Kennzeichnung der Behörde / öffentlichen Stelle innerhalb des angegebenen Verzeichnisdienstes. Die Behördenkennung des Autors muss das Präfix MELDID oder xga haben. */
  kennung: string;
  /** Dieses Element enthält den Namen der Behörde / öffentlichen Stelle. */
  name: string;
}

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
        <bn-g2g:nachrichtenUUID>
          ${xml(nachrichtenkopf.nachrichtenUUID)}
        </bn-g2g:nachrichtenUUID>
        <bn-g2g:nachrichtentyp listURI="urn:xoev-de:xgewerbeordnung:codeliste:nachrichtentypen" listVersionID="1.6">
          <code>0300</code>
        </bn-g2g:nachrichtentyp>
        <bn-g2g:erstellungszeitpunkt>
          ${xml(nachrichtenkopf.erstellungszeitpunkt)}
        </bn-g2g:erstellungszeitpunkt>
      </bn-g2g:identifikation.nachricht>
      <bn-g2g:leser>
        <bn-beh:verzeichnisdienst listVersionID="1">
          <code>DVDV</code>
        </bn-beh:verzeichnisdienst>
        <bn-beh:kennung>
          ${xml(nachrichtenkopf.leser.kennung)}
        </bn-beh:kennung>
        <bn-beh:name>
          ${xml(nachrichtenkopf.leser.name)}
        </bn-beh:name>
      </bn-g2g:leser>
      <bn-g2g:autor>
        <bn-beh:verzeichnisdienst listVersionID="1">
          <code>DVDV</code>
        </bn-beh:verzeichnisdienst>
        <bn-beh:kennung>
          ${xml(nachrichtenkopf.autor.kennung)}
        </bn-beh:kennung>
        <bn-beh:name>
          ${xml(nachrichtenkopf.autor.name)}
        </bn-beh:name>
      </bn-g2g:autor>
</bn-g2g:nachrichtenkopf.g2g>`;
}
