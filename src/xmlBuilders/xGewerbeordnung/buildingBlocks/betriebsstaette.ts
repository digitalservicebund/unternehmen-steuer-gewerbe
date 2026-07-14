import { optionalWrappedTag } from "../../../helpers/xmlTag";
import { createAnschrift, type Anschrift } from "./anschrift";
import { createKommunikation, type Kommunikation } from "./kommunikation";

export interface Betriebsstaette {
  /** Art der Betriebsstätte (Code, listVersionID="1"); ab 2024-05-01 nur 01/02/03 zulässig (SCH-0256). */
  artBetriebsstaette?: string;
  /** Angaben für die Adressierung im Inland, */
  anschrift?: Anschrift;
  /** Kontaktdaten der Betriebsstätte. */
  kommunikation?: Kommunikation;
}

export function createBetriebsstaette(betriebsstaette: Betriebsstaette | undefined) {
  if (!betriebsstaette) return "";
  return `
    <xga:betriebsstaette>
      ${optionalWrappedTag("wt:artBetriebsstaette", "code", betriebsstaette.artBetriebsstaette, ' listVersionID="1"')}
      ${createAnschrift(betriebsstaette.anschrift)}
      ${createKommunikation(betriebsstaette.kommunikation)}
    </xga:betriebsstaette>`;
}
