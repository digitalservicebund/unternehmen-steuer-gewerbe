import { optionalTag } from "../../../helpers/xmlTag";

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
      ${optionalTag("xga:industrie", betriebArt.industrie)}
      ${optionalTag("xga:handwerk", betriebArt.handwerk)}
      ${optionalTag("xga:handel", betriebArt.handel)}
      ${optionalTag("xga:sonstiges", betriebArt.sonstiges)}
    </xga:betriebArt>`;
}
