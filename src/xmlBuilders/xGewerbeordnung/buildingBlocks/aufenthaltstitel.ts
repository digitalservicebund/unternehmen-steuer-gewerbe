import { escapeXml } from "../../../helpers/escapeXml";
import { hasAValue } from "../../../helpers/hasAValue";

export interface Aufenthaltstitel {
  /** Angabe des Status des Aufenthaltstitels */
  status?: string;
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
      ${hasAValue(aufenthaltstitel.status) ? `<xga:status><code>${escapeXml(aufenthaltstitel.status)}</code></xga:status>` : ""}
      ${hasAValue(aufenthaltstitel.ausgestelltAm) ? `<xga:ausgestelltAm>${escapeXml(aufenthaltstitel.ausgestelltAm)}</xga:ausgestelltAm>` : ""}
      ${hasAValue(aufenthaltstitel.ausgestelltVonName) ? `<xga:ausgestelltVonName>${escapeXml(aufenthaltstitel.ausgestelltVonName)}</xga:ausgestelltVonName>` : ""}
      ${hasAValue(aufenthaltstitel.ausgestelltVonPLZ) ? `<xga:ausgestelltVonPLZ>${escapeXml(aufenthaltstitel.ausgestelltVonPLZ)}</xga:ausgestelltVonPLZ>` : ""}
      ${hasAValue(aufenthaltstitel.ausgestelltVonOrt) ? `<xga:ausgestelltVonOrt>${escapeXml(aufenthaltstitel.ausgestelltVonOrt)}</xga:ausgestelltVonOrt>` : ""}
    </xga:aufenthaltstitel>`;
}
