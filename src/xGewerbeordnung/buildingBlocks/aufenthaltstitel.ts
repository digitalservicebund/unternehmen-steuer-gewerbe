import { xml } from "../escapeXml";

export interface Aufenthaltstitel {
  /** Angabe des Status des Aufenthaltstitels */
  status: string;
  /** Ausstellungsdatum des Aufenthaltstitels */
  ausgestelltAm?: string;
  /** Name der den Aufenthaltstitel ausstellenden Behörde */
  ausgestelltVonName?: string;
  /** Postleitzahl der den Aufenthaltstitel ausstellenden Behörde */
  ausgestelltVonPLZ?: string;
  /** Ort der den Aufenthaltstitel ausstellenden Behörde */
  ausgestelltVonOrt?: string;
}

export function createAufenthaltstitel(aufenthaltstitel: Aufenthaltstitel | undefined) {
  if (!aufenthaltstitel) return "";

  return `
    <xga:aufenthaltstitel>
      <xga:status>
        <code>${xml(aufenthaltstitel.status)}</code>
      </xga:status>
      ${aufenthaltstitel.ausgestelltAm ? `<xga:ausgestelltAm>${xml(aufenthaltstitel.ausgestelltAm)}</xga:ausgestelltAm>` : ""}
      ${aufenthaltstitel.ausgestelltVonName ? `<xga:ausgestelltVonName>${xml(aufenthaltstitel.ausgestelltVonName)}</xga:ausgestelltVonName>` : ""}
      ${aufenthaltstitel.ausgestelltVonPLZ ? `<xga:ausgestelltVonPLZ>${xml(aufenthaltstitel.ausgestelltVonPLZ)}</xga:ausgestelltVonPLZ>` : ""}
      ${aufenthaltstitel.ausgestelltVonOrt ? `<xga:ausgestelltVonOrt>${xml(aufenthaltstitel.ausgestelltVonOrt)}</xga:ausgestelltVonOrt>` : ""}
    </xga:aufenthaltstitel>`;
}
