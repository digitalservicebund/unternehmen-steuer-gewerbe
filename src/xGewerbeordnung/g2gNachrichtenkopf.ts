interface Behoerde {
  kennung: string;
  name: string;
}

export interface Nachrichtenkopf {
  nachrichtenUUID: string;
  erstellungszeitpunkt: string;
  leser: Behoerde;
  autor: Behoerde;
}

export const createG2gNachrichtenkopf = (nachrichtenkopf: Nachrichtenkopf) => `
<bn-g2g:nachrichtenkopf.g2g>
    <bn-g2g:identifikation.nachricht>
        <bn-g2g:nachrichtenUUID>
            ${nachrichtenkopf.nachrichtenUUID}
        </bn-g2g:nachrichtenUUID>
        <bn-g2g:nachrichtentyp listURI="urn:xoev-de:xgewerbeordnung:codeliste:nachrichtentypen" listVersionID="1.6">
            <code>0300</code>
        </bn-g2g:nachrichtentyp>
        <bn-g2g:erstellungszeitpunkt>
            ${nachrichtenkopf.erstellungszeitpunkt}
        </bn-g2g:erstellungszeitpunkt>
    </bn-g2g:identifikation.nachricht>
    <bn-g2g:leser>
        <bn-beh:verzeichnisdienst listVersionID="1">
            <code>DVDV</code>
        </bn-beh:verzeichnisdienst>
        <bn-beh:kennung>
            ${nachrichtenkopf.leser.kennung}
        </bn-beh:kennung>
        <bn-beh:name>
            ${nachrichtenkopf.leser.name}
        </bn-beh:name>
    </bn-g2g:leser>
    <bn-g2g:autor>
        <bn-beh:verzeichnisdienst listVersionID="1">
            <code>DVDV</code>
        </bn-beh:verzeichnisdienst>
        <bn-beh:kennung>
            ${nachrichtenkopf.autor.kennung}
        </bn-beh:kennung>
        <bn-beh:name>
            ${nachrichtenkopf.autor.name}
        </bn-beh:name>
    </bn-g2g:autor>
</bn-g2g:nachrichtenkopf.g2g>`;
