import { xml } from "../escapeXml";

export interface Eintragung {
  artEintragung: "A" | "B" | "G" | "GesR";
  registergericht: {
    code: string;
  };
  eintragungsnummer: number;
}

export function createEintragung(eintragung: Eintragung | undefined) {
  if (!eintragung) return "";

  return `
    <bk:eintragung>
      <eintragung:artEintragung listVersionID="1">
        <code>${xml(eintragung.artEintragung)}</code>
      </eintragung:artEintragung>
      <eintragung:registergericht.code listVersionID="12">
        <code>${xml(eintragung.registergericht.code)}</code>
      </eintragung:registergericht.code>
      <eintragung:eintragungsnummer>${xml(eintragung.eintragungsnummer)}</eintragung:eintragungsnummer>
    </bk:eintragung>`;
}
