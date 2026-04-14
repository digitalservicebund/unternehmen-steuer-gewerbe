import { xml } from "../escapeXml";

export interface TaetigkeitEinzeln {
  /** Hier wird eine vom Gewerbetreibenden angegebene Tätigkeit einzeln übermittelt. Es handelt sich hierbei nicht um den im Text des im Element taetigkeitSchluessel angegebenen Wirtschaftszweigschlüssels, sondern um die ursprüngliche Angabe des Gewerbetreibenden. */
  taetigkeitEinzeln: string;
  /** Hier ist der Wirtschaftszweigschlüssel anzugeben. Sofern taetigkeitEinzeln übermittelt wird, bezieht sich das vorliegende Element auf diese Angabe. Ist ausschließlich ein Schlüssel angegeben, bezieht sich dieser auf das Element taetigkeitenZusammengefasst. */
  wirtschaftszweigschluessel: string;
  /** Übermittelt werden soll, wenn im Fachverfahren vorhanden, die Sachbearbeiter-Auswahl des Stichwortes aus dem entsprechenden Schlüsselverzeichnis, das zur Zuordnung des Wirtschaftszweig-Schlüssels der Tätigkeit geführt hat. Ein Stichwort sollte nur übermittelt werden, wenn auch ein Tätigkeitsschlüssel (Element wt:wirtschaftszweig) angegeben ist. */
  stichwort: string;
}

export interface WeitereTaetigkeiten {
  /** Zusammenfassung aller vom Gewerbetreibenden angegebenen weiteren Tätigkeiten, jedoch ohne den Tätigkeitsschwerpunkt, welcher in Schwerpunkt angegeben werden muss. */
  taetigkeitenZusammengefasst: string;
  /** Hier werden alle vom Gewerbetreibenden angegebenen weiteren ausgeübten Tätigkeiten in Form separater Angaben einzelner Tätigkeiten übermittelt. Der Tätigkeitsschwerpunkt wird hierbei jedoch nicht erneut angegeben. */
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
