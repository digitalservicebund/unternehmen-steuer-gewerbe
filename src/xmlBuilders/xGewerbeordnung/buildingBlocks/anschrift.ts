import { optionalTag } from "../../../helpers/xmlTag";

export interface Anschrift {
  /** Falls die Anschrift unbekannt ist (z. B. bei Abmeldung von Amts wegen), so ist hier der Wert "unbekannt" zu übermitteln. */
  strasse?: string;
  /** Angabe des Straßenschlüssels in der Gemeinde. */
  strassenschluessel?: string;
  /** Hausnummer (von), z.B. "136 A" */
  hausnummerVon?: string;
  /** Hausnummer (bis), z.B. "136 C" */
  hausnummerBis?: string;
  /** Es ist die Postleitzahl anzugeben. */
  postleitzahl?: string;
  /** Der Name des Ortes (Gemeinde, Ortschaft oder Stadt). */
  ort?: string;
}

export function createAnschrift(strassenanschriftInland: Anschrift | undefined) {
  if (!strassenanschriftInland) return "";
  return `
    <bk:anschrift>
      <bk:strassenanschriftInland>
        ${optionalTag("adr:strasse", strassenanschriftInland.strasse)}
        ${optionalTag("bk:strassenschluessel", strassenanschriftInland.strassenschluessel)}
        ${optionalTag("bk:hausnummerVon", strassenanschriftInland.hausnummerVon)}
        ${optionalTag("bk:hausnummerBis", strassenanschriftInland.hausnummerBis)}
        ${optionalTag("adr:postleitzahl", strassenanschriftInland.postleitzahl)}
        ${optionalTag("adr:ort", strassenanschriftInland.ort)}
      </bk:strassenanschriftInland>
    </bk:anschrift>`;
}
