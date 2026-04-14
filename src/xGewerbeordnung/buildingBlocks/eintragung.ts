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
        <code>${eintragung.artEintragung}</code>
      </eintragung:artEintragung>
      <eintragung:registergericht.code listVersionID="12">
        <code>${eintragung.registergericht.code}</code>
      </eintragung:registergericht.code>
      <eintragung:eintragungsnummer>${eintragung.eintragungsnummer}</eintragung:eintragungsnummer>
    </bk:eintragung>`;
}
