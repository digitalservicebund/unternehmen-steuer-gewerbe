import { optionalTag, optionalWrappedTag } from "../../../helpers/xmlTag";

export interface Eintragung {
  /** Angabe der Art des Registers, in welchem der wirtschaftlich Tätige bzw. die wirtschaftliche Tätigkeit (z. B. Zweigniederlassung) geführt wird. */
  artEintragung?: "A" | "B" | "G" | "GesR";
  /** Schlüssel des Registergerichts, in dessen Handels-, Genossenschafts-, Gesellschafts-, Partnerschafts- oder Vereinsregister, in welchem der wirtschaftlich Tätige bzw. die wirtschaftliche Tätigkeit (z. B. Zweigniederlassung) geführt wird. */
  registergericht?: {
    code?: string;
  };
  /** Nummer der Eintragung im jeweiligen Register bzw. Aktenzeichen im Stiftungsverzeichnis */
  eintragungsnummer?: number;
}

export function createEintragung(eintragung: Eintragung | undefined) {
  if (!eintragung) return "";
  return `
    <bk:eintragung>
      ${optionalWrappedTag("eintragung:artEintragung", "code", eintragung.artEintragung, ' listVersionID="1"')}
      ${optionalWrappedTag("eintragung:registergericht.code", "code", eintragung.registergericht?.code, ' listVersionID="12"')}
      ${optionalTag("eintragung:eintragungsnummer", eintragung.eintragungsnummer)}
    </bk:eintragung>`;
}
