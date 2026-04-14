import { xml } from "../escapeXml";

export interface StrassenanschriftInland {
  strasse: string;
  /** Amtl. Straßenschlüssel gem. AGS – nur falls verfügbar. */
  strassenschluessel?: string;
  hausnummerVon: string;
  /** Bis-Hausnummer bei Hausnummernbereichen. */
  hausnummerBis?: string;
  /** Hausnummernzusatz (z.B. "a"). */
  hausnummernzusatz?: string;
  postleitzahl: string;
  ort: string;
}

export function createAnschrift(strassenanschriftInland: StrassenanschriftInland | undefined) {
  if (!strassenanschriftInland) return "";

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
