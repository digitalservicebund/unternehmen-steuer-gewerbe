// https://www.xrepository.de/details/urn:xoev-de:kosit:standard:xgewerbeordnung_1.6#version
import { createBehoerde, type Behoerde } from "./buildingBlocks/behoerde";
import {
  createG2gNachrichtenkopf,
  type Nachrichtenkopf,
} from "./buildingBlocks/g2gNachrichtenkopf";
import { createGewerbebetrieb, type Gewerbebetrieb } from "./buildingBlocks/gewerbebetrieb";
import {
  createReferenzierteSubjekte,
  type ReferenzierteSubjekte,
} from "./buildingBlocks/referenzierteSubjekte";
import { escapeXml } from "./escapeXml";

export interface Gewerbeanmeldung {
  nachrichtenkopf: Nachrichtenkopf;
  /** Die die Gewerbeanzeige entgegennehmende Behörde. */
  autor: Behoerde;
  /** Angabe des Zeitpunkts der Erstellung des XML-Datensatzes für die Übermittlung. */
  satzErstellung: string;
  /** Der Zeitpunkt, zu welchem der die Übermittlung auslösende Verwaltungsvorgang (Aufnahme / Änderung / Korrektur eines Datensatzes) im gemeindlichen Gewerbeverzeichnis gespeichert wurde. */
  ereigniszeitpunkt: string;
  /** Angabe über das Vorliegen einer Stornierung dieser Gewerbemeldung  */
  istStorno: boolean;
  /** Falls mit der Meldung eine Stornierung übermittelt wird, wird mit diesem Datentyp der Grund der Stornierung angegeben */
  gemeindeSchluessel: string;
  /** Eindeutige Kennzeichnung der Gewerbeanzeige als UUID. */
  uuid: string;
  /** Datum des Beginns, der meldepflichtigen Änderung, der Aufgabe des Gewerbes oder der Datenaktualisierung */
  gueltigAb: string;
  /** Datum, an welchem die An-, Um-, Abmeldung bzw. Datenaktualisierung an die Gewerbemeldestelle übergeben wurde. */
  datumMeldung: string;
  /** Ein Gewerbebetrieb beschreibt die wirtschaftliche Einheit, unter der ein oder mehrere Gewerbetreibende/r im Außenverhältnis am Wirtschaftsleben teilnehmen. */
  gewerbebetrieb: Gewerbebetrieb;
  /** Innerhalb des Elements gewerbebetrieb über ID referenzierte Subjekte. */
  referenzierteSubjekte: ReferenzierteSubjekte;
  /** Grund für Anmeldung - code */
  grundAnmeldungSchluessel: string;
}

const ROOT_ATTRIBUTES = `
  xmlns:xga="http://www.xgewerbeordnung.de/spezifikation/xga/1.6"
  xmlns:erl="http://www.xgewerbeordnung.de/spezifikation/erl/1.6"
  xmlns:bk="http://www.xgewerbeordnung.de/spezifikation/baukasten/1.6"
  xmlns:nachr="urn:xoev-de:xunternehmen:standard:basismodul:nachrichtenstruktur_1.2"
  xmlns:np="urn:xoev-de:xunternehmen:standard:basismodul:natuerlicheperson_1.2"
  xmlns:jp="urn:xoev-de:xunternehmen:standard:basismodul:juristischeperson_1.2"
  xmlns:rpg="urn:xoev-de:xunternehmen:standard:basismodul:rechtsfaehigepersonengesellschaft_1.2"
  xmlns:eintr="urn:xoev-de:xunternehmen:standard:basismodul:eintragung_1.2"
  xmlns:rf="urn:xoev-de:xunternehmen:standard:basismodul:rechtsform_1.2"
  xmlns:bn-g2g="http://xoev.de/schemata/basisnachricht/g2g/1_1"
  xmlns:bn-beh="http://xoev.de/schemata/basisnachricht/behoerde/1_1"
  xmlns:bn-kom="http://xoev.de/schemata/basisnachricht/kommunikation/1_1"
  xmlns:komm="urn:xoev-de:xunternehmen:standard:basismodul:kommunikation_1.2"
  xmlns:wt="urn:xoev-de:xunternehmen:standard:basismodul:wirtschaftlichetaetigkeit_1.2"
  xmlns:ename="urn:xoev-de:xunternehmen:standard:basismodul:eingetragenername_1.2"
  xmlns:eintragung="urn:xoev-de:xunternehmen:standard:basismodul:eintragung_1.2"
  xmlns:adr="urn:xoev-de:xunternehmen:standard:basismodul:adressen_1.2"
  xmlns:antr="urn:xoev-de:xunternehmen:standard:basismodul:antraege-anzeigen_1.2"
  xmlns:lc="urn:xoev-de:kosit:xoev:datentyp:din-91379_2022-08"
  xmlns:code="http://xoev.de/schemata/code/1_0"
  xmlns:dat="urn:xoev-de:xunternehmen:standard:basismodul:datumsangaben_1.2"
  xmlns:gv="urn:xoev-de:xunternehmen:standard:basismodul:gesetzlichervertreter_1.2"
  xmlns:ges="urn:xoev-de:xunternehmen:standard:basismodul:gesellschafter_1.2"
  xmlns:spv="urn:xoev-de:xunternehmen:standard:basismodul:sonstigepersonenvereinigung_1.2"
  xmlns:bspv="urn:xoev-de:xunternehmen:standard:basismodul:beteiligtersonstigepersonenvereinigung_1.2"
  produkt="XGA-Testsuite"
  produkthersteller="KoSIT"
  produktversion="2024"
  standard="XGewerbeordnung"
  version="1.6"
  test="100"`;

export function createGewerbeanmeldungXml(gewerbeanmeldung: Gewerbeanmeldung) {
  const natuerlichePerson0 = gewerbeanmeldung.referenzierteSubjekte.natuerlichePerson[0];

  if (!natuerlichePerson0) {
    throw new Error(
      "Required field gewerbeanmeldung.referenzierteSubjekte.natuerlichePerson[0] is missing",
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
    <xga:alg.gewerbemeldung.0300 ${ROOT_ATTRIBUTES}>
      ${createG2gNachrichtenkopf(gewerbeanmeldung.nachrichtenkopf)}
      <xga:satz>
        <xga:anmeldung>
            <xga:autor>
              ${createBehoerde(gewerbeanmeldung.autor)}
            </xga:autor>
            <xga:satzErstellung>${escapeXml(gewerbeanmeldung.satzErstellung)}</xga:satzErstellung>
            <xga:ereigniszeitpunkt>${escapeXml(gewerbeanmeldung.ereigniszeitpunkt)}</xga:ereigniszeitpunkt>
            <xga:istStorno>${escapeXml(gewerbeanmeldung.istStorno)}</xga:istStorno>
            <xga:gemeindeSchluessel listVersionID="2020-03-31">
              <code>${escapeXml(gewerbeanmeldung.gemeindeSchluessel)}</code>
            </xga:gemeindeSchluessel>
            <xga:uuid>${escapeXml(gewerbeanmeldung.uuid)}</xga:uuid>
            <xga:gueltigAb>${escapeXml(gewerbeanmeldung.gueltigAb)}</xga:gueltigAb>
            <xga:datumMeldung>${escapeXml(gewerbeanmeldung.datumMeldung)}</xga:datumMeldung>
            ${createGewerbebetrieb(gewerbeanmeldung.gewerbebetrieb, natuerlichePerson0.id)}
            ${createReferenzierteSubjekte(gewerbeanmeldung.referenzierteSubjekte)}
            <xga:grundAnmeldungSchluessel>
              <code>${escapeXml(gewerbeanmeldung.grundAnmeldungSchluessel)}</code>
            </xga:grundAnmeldungSchluessel>
        </xga:anmeldung>
      </xga:satz>
    </xga:alg.gewerbemeldung.0300>`;
}
