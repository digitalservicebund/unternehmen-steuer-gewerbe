import { escapeXml } from "../../../helpers/escapeXml";
import { isDefined } from "../../../helpers/isDefined";

export interface BetriebArt {
  /** In diesem Element wird angegeben, ob es sich um einen Industriebetrieb handelt. */
  industrie?: boolean;
  /** In diesem Element wird angegeben, ob es sich um einen Handwerksbetrieb handelt. */
  handwerk?: boolean;
  /** In diesem Element wird angegeben, ob es sich um einen Handelsbetrieb handelt. */
  handel?: boolean;
  /** In diesem Element wird angegeben, ob es sich um Betrieb sonstiger Art handelt. */
  sonstiges?: boolean;
}

export function createBetriebArt(betriebArt: BetriebArt | undefined) {
  if (!betriebArt) return "";
  return `
    <xga:betriebArt>
      ${isDefined(betriebArt.industrie) ? `<xga:industrie>${escapeXml(betriebArt.industrie)}</xga:industrie>` : ""}
      ${isDefined(betriebArt.handwerk) ? `<xga:handwerk>${escapeXml(betriebArt.handwerk)}</xga:handwerk>` : ""}
      ${isDefined(betriebArt.handel) ? `<xga:handel>${escapeXml(betriebArt.handel)}</xga:handel>` : ""}
      ${isDefined(betriebArt.sonstiges) ? `<xga:sonstiges>${escapeXml(betriebArt.sonstiges)}</xga:sonstiges>` : ""}
    </xga:betriebArt>`;
}
