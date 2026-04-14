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
          <adr:strasse>${strassenanschriftInland.strasse}</adr:strasse>
          ${strassenanschriftInland.strassenschluessel ? `<bk:strassenschluessel>${strassenanschriftInland.strassenschluessel}</bk:strassenschluessel>` : ""}
          <bk:hausnummerVon>${strassenanschriftInland.hausnummerVon}</bk:hausnummerVon>
          ${strassenanschriftInland.hausnummerBis ? `<bk:hausnummerBis>${strassenanschriftInland.hausnummerBis}</bk:hausnummerBis>` : ""}
          ${strassenanschriftInland.hausnummernzusatz ? `<bk:hausnummernzusatz>${strassenanschriftInland.hausnummernzusatz}</bk:hausnummernzusatz>` : ""}
          <adr:postleitzahl>${strassenanschriftInland.postleitzahl}</adr:postleitzahl>
          <adr:ort>${strassenanschriftInland.ort}</adr:ort>
      </bk:strassenanschriftInland>
    </bk:anschrift>`;
}
