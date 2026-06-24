import { escapeXml } from "../../../helpers/escapeXml";
import { isDefinedInput } from "../../../helpers/isDefinedInput";

export interface BisherigeUnfallversicherung {
  /** Schlüssel des Trägers der bisherigen gesetzlichen Unfallversicherung. */
  traeger?: string;
  /** Unternehmensnummer bei der bisherigen Unfallversicherung (früher Mitgliedsnummer). */
  unternehmensnummer?: string;
}

export function createBisherigeUnfallversicherung(
  bisherigeUnfallversicherung: BisherigeUnfallversicherung | undefined,
) {
  if (!bisherigeUnfallversicherung) return "";
  return `
    <bk:bisherigeUnfallversicherung>
      <bk:traeger listVersionID="1">
        <code>${isDefinedInput(bisherigeUnfallversicherung.traeger) ? escapeXml(bisherigeUnfallversicherung.traeger) : ""}</code>
      </bk:traeger>
      ${isDefinedInput(bisherigeUnfallversicherung.unternehmensnummer) ? `<bk:unternehmensnummer>${escapeXml(bisherigeUnfallversicherung.unternehmensnummer)}</bk:unternehmensnummer>` : ""}
    </bk:bisherigeUnfallversicherung>`;
}
