import { xml } from "../escapeXml";

export interface Anschrift {
  /** Falls die Anschrift unbekannt ist (z. B. bei Abmeldung von Amts wegen), so ist hier der Wert "unbekannt" zu übermitteln. */
  strasse: string;
  /** Angabe des Straßenschlüssels in der Gemeinde. */
  strassenschluessel?: string;
  /** Hausnummer (von), z.B. "136 A" */
  hausnummerVon: string;
  /** Hausnummer (bis), z.B. "136 C" */
  hausnummerBis?: string;
  /** Hausnummernzusatz (z.B. "a"). */
  hausnummernzusatz?: string;
  /** Es ist die Postleitzahl anzugeben. */
  postleitzahl: string;
  /** Der Name des Ortes (Gemeinde, Ortschaft oder Stadt). */
  ort: string;
}

export function createAnschrift(strassenanschriftInland: Anschrift) {
  return `
    <bk:anschrift>
      <bk:strassenanschriftInland>
        <adr:strasse>${xml(strassenanschriftInland.strasse)}</adr:strasse>
        ${strassenanschriftInland.strassenschluessel ? `<bk:strassenschluessel>${xml(strassenanschriftInland.strassenschluessel)}</bk:strassenschluessel>` : ""}
        <bk:hausnummerVon>${xml(strassenanschriftInland.hausnummerVon)}</bk:hausnummerVon>
        ${strassenanschriftInland.hausnummerBis ? `<bk:hausnummerBis>${xml(strassenanschriftInland.hausnummerBis)}</bk:hausnummerBis>` : ""}
        ${strassenanschriftInland.hausnummernzusatz ? `<bk:hausnummernzusatz>${xml(strassenanschriftInland.hausnummernzusatz)}</bk:hausnummernzusatz>` : ""}
        <adr:postleitzahl>${xml(strassenanschriftInland.postleitzahl)}</adr:postleitzahl>
        <adr:ort>${xml(strassenanschriftInland.ort)}</adr:ort>
      </bk:strassenanschriftInland>
    </bk:anschrift>`;
}
