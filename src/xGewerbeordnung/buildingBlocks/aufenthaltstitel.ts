export interface Aufenthaltstitel {
  status: string;
  /** Ausstellungsdatum des Aufenthaltstitels. */
  ausgestelltAm?: string;
  /** Name der den Aufenthaltstitel ausstellenden Behörde. */
  ausgestelltVonName?: string;
  /** PLZ der den Aufenthaltstitel ausstellenden Behörde. */
  ausgestelltVonPLZ?: string;
  /** Ort der den Aufenthaltstitel ausstellenden Behörde. */
  ausgestelltVonOrt?: string;
}

export function createAufenthaltstitel(aufenthaltstitel: Aufenthaltstitel | undefined) {
  if (!aufenthaltstitel) return "";

  return `
    <xga:aufenthaltstitel>
      <xga:status>
        <code>${aufenthaltstitel.status}</code>
      </xga:status>
      ${aufenthaltstitel.ausgestelltAm ? `<xga:ausgestelltAm>${aufenthaltstitel.ausgestelltAm}</xga:ausgestelltAm>` : ""}
      ${aufenthaltstitel.ausgestelltVonName ? `<xga:ausgestelltVonName>${aufenthaltstitel.ausgestelltVonName}</xga:ausgestelltVonName>` : ""}
      ${aufenthaltstitel.ausgestelltVonPLZ ? `<xga:ausgestelltVonPLZ>${aufenthaltstitel.ausgestelltVonPLZ}</xga:ausgestelltVonPLZ>` : ""}
      ${aufenthaltstitel.ausgestelltVonOrt ? `<xga:ausgestelltVonOrt>${aufenthaltstitel.ausgestelltVonOrt}</xga:ausgestelltVonOrt>` : ""}
    </xga:aufenthaltstitel>`;
}
