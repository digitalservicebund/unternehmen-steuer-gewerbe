import { optionalTag } from "../../../helpers/xmlTag";

export interface Nachweisdokument {
  /** Innerhalb des Transport-Kontextes eindeutige Kennung des Dokuments, die als Ref-ID auf den separaten Content im OSCI-Container verweist. */
  dokumentid?: string;
  /** Der Dateiname des Dokuments. */
  dateiname?: string;
  /** Der Mime-Type des Dokuments. */
  mimetype?: string;
  /** Die Kategorie des Dokuments. Beispiel: "Antrag im Original". */
  kategorie?: string;
}

// The document itself travels outside the XML: as a further content in the same OSCI
// Inhaltsdatencontainer, whose Ref-ID has to match dokumentid (transport profile C.3.3, table C.2).
export function createNachweisdokumentOnlinedienst(nachweisdokument: Nachweisdokument | undefined) {
  if (!nachweisdokument) return "";
  return `
    <bk:nachweisdokument.onlinedienst>
      ${optionalTag("bk:dokumentid", nachweisdokument.dokumentid)}
      ${optionalTag("bk:dateiname", nachweisdokument.dateiname)}
      ${optionalTag("bk:mimetype", nachweisdokument.mimetype)}
      ${optionalTag("bk:kategorie", nachweisdokument.kategorie)}
    </bk:nachweisdokument.onlinedienst>`;
}
