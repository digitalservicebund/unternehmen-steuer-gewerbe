import { xml } from "../escapeXml";
import { createWirtschaftszweig } from "./wirtschaftszweig";

export interface Taetigkeit {
  /** Hier wird der vom Gewerbetreibenden angegebene Tätigkeitsschwerpunkt übermittelt. Es handelt sich hierbei nicht um den in Text des im Element wirtschaftszweig angegebenen Wirtschaftszweigschlüssels, sondern um die ursprüngliche Angabe des Gewerbetreibenden */
  taetigkeitSchwerpunkt: string;
  /** Wirtschaftszweigschlüssel gemäß der Klassifikation der Wirtschaftszweige des Statistischen Bundesamts. */
  wirtschaftszweigschluessel: string;
  /** Übermittelt werden soll, wenn im Fachverfahren vorhanden, die Sachbearbeiter-Auswahl des Stichwortes aus dem entsprechenden Schlüsselverzeichnis, das zur Zuordnung des Wirtschaftszweig-Schlüssels der Tätigkeit geführt hat. Ein Stichwort sollte nur übermittelt werden, wenn auch ein Tätigkeitsschlüssel (Element wt:wirtschaftszweig) angegeben ist. */
  stichwort: string;
}

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

export interface TaetigkeitenGesamt {
  /** Es ist der Schwerpunkt der tatsächlich an der gemeldeten Betriebsstätte ausgeübten Tätigkeiten anzugeben. Es gibt genau einen Schwerpunkt. Wenn an dieser Betriebstätte nur eine Tätigkeit ausgeübt wird, stellt diese den Schwerpunkt dar */
  schwerpunkt: Taetigkeit;
  /** Weitere Tätigkeiten neben der Schwerpunkttätigkeit. */
  weitereTaetigkeiten?: WeitereTaetigkeiten;
}

function createTaetigkeitEinzeln(taetigkeitEinzeln: TaetigkeitEinzeln) {
  return `
    <xga:taetigkeit>
      <xga:taetigkeitEinzeln>${xml(taetigkeitEinzeln.taetigkeitEinzeln)}</xga:taetigkeitEinzeln>
      ${createWirtschaftszweig(taetigkeitEinzeln.wirtschaftszweigschluessel)}
      <xga:stichwort>${xml(taetigkeitEinzeln.stichwort)}</xga:stichwort>
    </xga:taetigkeit>`;
}

function createWeitereTaetigkeiten(weitereTaetigkeiten: WeitereTaetigkeiten | undefined) {
  if (!weitereTaetigkeiten) return "";

  return `
    <xga:weitereTaetigkeiten>
      <xga:taetigkeitenZusammengefasst>${xml(weitereTaetigkeiten.taetigkeitenZusammengefasst)}</xga:taetigkeitenZusammengefasst>
      ${weitereTaetigkeiten.taetigkeit.map(createTaetigkeitEinzeln).join("\n")}
    </xga:weitereTaetigkeiten>`;
}

export function createTaetigkeiten(taetigkeitenGesamt: TaetigkeitenGesamt) {
  const { schwerpunkt, weitereTaetigkeiten } = taetigkeitenGesamt;
  return `
    <xga:taetigkeitenGesamt>
      <xga:schwerpunkt>
        <xga:taetigkeitSchwerpunkt>${xml(schwerpunkt.taetigkeitSchwerpunkt)}</xga:taetigkeitSchwerpunkt>
        ${createWirtschaftszweig(schwerpunkt.wirtschaftszweigschluessel)}
        <xga:stichwort>${xml(schwerpunkt.stichwort)}</xga:stichwort>
      </xga:schwerpunkt>
      ${createWeitereTaetigkeiten(weitereTaetigkeiten)}
    </xga:taetigkeitenGesamt>`;
}
