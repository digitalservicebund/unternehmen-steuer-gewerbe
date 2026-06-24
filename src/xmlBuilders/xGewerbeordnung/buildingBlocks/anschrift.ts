import { escapeXml } from "../../../helpers/escapeXml";
import { hasAValue } from "../../../helpers/hasAValue";

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
        ${hasAValue(strassenanschriftInland.strasse) ? `<adr:strasse>${escapeXml(strassenanschriftInland.strasse)}</adr:strasse>` : ""}
        ${hasAValue(strassenanschriftInland.strassenschluessel) ? `<bk:strassenschluessel>${escapeXml(strassenanschriftInland.strassenschluessel)}</bk:strassenschluessel>` : ""}
        ${hasAValue(strassenanschriftInland.hausnummerVon) ? `<bk:hausnummerVon>${escapeXml(strassenanschriftInland.hausnummerVon)}</bk:hausnummerVon>` : ""}
        ${hasAValue(strassenanschriftInland.hausnummerBis) ? `<bk:hausnummerBis>${escapeXml(strassenanschriftInland.hausnummerBis)}</bk:hausnummerBis>` : ""}
        ${hasAValue(strassenanschriftInland.postleitzahl) ? `<adr:postleitzahl>${escapeXml(strassenanschriftInland.postleitzahl)}</adr:postleitzahl>` : ""}
        ${hasAValue(strassenanschriftInland.ort) ? `<adr:ort>${escapeXml(strassenanschriftInland.ort)}</adr:ort>` : ""}
      </bk:strassenanschriftInland>
    </bk:anschrift>`;
}
