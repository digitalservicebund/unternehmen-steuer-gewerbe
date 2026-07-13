import { escapeXml } from "../../../helpers/escapeXml";
import { isDefinedInput } from "../../../helpers/isDefinedInput";
import { optionalTag } from "../../../helpers/xmlTag";

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
      ${optionalTag("bk:unternehmensnummer", bisherigeUnfallversicherung.unternehmensnummer)}
    </bk:bisherigeUnfallversicherung>`;
}
