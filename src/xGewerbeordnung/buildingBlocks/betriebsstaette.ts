import { xml } from "../escapeXml";
import { createAnschrift, type Anschrift } from "./anschrift";
import { createKommunikation, type Kommunikation } from "./kommunikation";

export interface Betriebsstaette {
  /** Art der Betriebsstätte (Code, listVersionID="1"); ab 2024-05-01 nur 01/02/03 zulässig (SCH-0256). */
  artBetriebsstaette: string;
  /** Angaben für die Adressierung im Inland, */
  anschrift: Anschrift;
  /** Kontaktdaten der Betriebsstätte. */
  kommunikation?: Kommunikation;
}

export function createBetriebsstaette(betriebsstaette: Betriebsstaette) {
  return `
    <xga:betriebsstaette>
      <wt:artBetriebsstaette listVersionID="1">
        <code>${xml(betriebsstaette.artBetriebsstaette)}</code>
      </wt:artBetriebsstaette>
      ${createAnschrift(betriebsstaette.anschrift)}
      ${createKommunikation(betriebsstaette.kommunikation)}
    </xga:betriebsstaette>`;
}
