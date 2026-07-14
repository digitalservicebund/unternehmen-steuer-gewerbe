import { optionalTag, optionalWrappedTag } from "../../../helpers/xmlTag";

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
      ${optionalWrappedTag("xga:status", "code", aufenthaltstitel.status)}
      ${optionalTag("xga:ausgestelltAm", aufenthaltstitel.ausgestelltAm)}
      ${optionalTag("xga:ausgestelltVonName", aufenthaltstitel.ausgestelltVonName)}
      ${optionalTag("xga:ausgestelltVonPLZ", aufenthaltstitel.ausgestelltVonPLZ)}
      ${optionalTag("xga:ausgestelltVonOrt", aufenthaltstitel.ausgestelltVonOrt)}
    </xga:aufenthaltstitel>`;
}
