import { xml } from "../escapeXml";

export interface TaetigkeitEinzeln {
  taetigkeitEinzeln: string;
  wirtschaftszweigschluessel: string;
  stichwort: string;
}

export interface WeitereTaetigkeiten {
  taetigkeitenZusammengefasst: string;
  taetigkeit: TaetigkeitEinzeln[];
}

function createTaetigkeit(taetigkeitEinzeln: TaetigkeitEinzeln) {
  return `
    <xga:taetigkeit>
      <xga:taetigkeitEinzeln>${xml(taetigkeitEinzeln.taetigkeitEinzeln)}</xga:taetigkeitEinzeln>
      <wt:wirtschaftszweig>
        <wt:wirtschaftszweigschluessel>${xml(taetigkeitEinzeln.wirtschaftszweigschluessel)}</wt:wirtschaftszweigschluessel>
        <wt:versionWirtschaftszweigklassifikation listVersionID="1">
          <code>WZ-2008</code>
        </wt:versionWirtschaftszweigklassifikation>
      </wt:wirtschaftszweig>
      <xga:stichwort>${xml(taetigkeitEinzeln.stichwort)}</xga:stichwort>
    </xga:taetigkeit>`;
}

export function createWeitereTaetigkeiten(weitereTaetigkeiten: WeitereTaetigkeiten | undefined) {
  if (!weitereTaetigkeiten) return "";

  return `
    <xga:weitereTaetigkeiten>
      <xga:taetigkeitenZusammengefasst>${xml(weitereTaetigkeiten.taetigkeitenZusammengefasst)}</xga:taetigkeitenZusammengefasst>
      ${weitereTaetigkeiten.taetigkeit.map(createTaetigkeit).join("\n")}
    </xga:weitereTaetigkeiten>`;
}
