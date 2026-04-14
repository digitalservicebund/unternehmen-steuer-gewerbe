// https://www.xrepository.de/details/urn:xoev-de:kosit:standard:xgewerbeordnung_1.6#version
import {
  createG2gNachrichtenkopf,
  type Nachrichtenkopf,
} from "./buildingBlocks/g2gNachrichtenkopf";
import { createEintragung, type Eintragung } from "./buildingBlocks/eintragung";
import { createAnschrift, type StrassenanschriftInland } from "./buildingBlocks/anschrift";
import { createKommunikation, type Kommunikation } from "./buildingBlocks/kommunikation";
import { createHandwerkskarte, type Handwerkskarte } from "./buildingBlocks/handwerkskarte";
import {
  createWeitereTaetigkeiten,
  type WeitereTaetigkeiten,
} from "./buildingBlocks/weitereTaetigkeiten";
import {
  createNatuerlichePerson,
  type NatuerlichePerson,
} from "./buildingBlocks/natuerlichePerson";

interface Behoerde {
  kennung: string;
  name: string;
}

interface BetriebArt {
  industrie: boolean;
  handwerk: boolean;
  handel: boolean;
  sonstiges: boolean;
}

interface Betriebsstaette {
  /** Art der Betriebsstätte (Code, listVersionID="1"); ab 2024-05-01 nur 01/02/03 zulässig (SCH-0256). */
  artBetriebsstaette: string;
  anschrift: StrassenanschriftInland;
  /** Kontaktdaten der Betriebsstätte. */
  kommunikation?: Kommunikation;
}

interface Taetigkeit {
  taetigkeitSchwerpunkt: string;
  wirtschaftszweigschluessel: string;
  stichwort: string;
}

interface TaetigkeitenGesamt {
  schwerpunkt: Taetigkeit;
  /** Weitere Tätigkeiten neben der Schwerpunkttätigkeit. */
  weitereTaetigkeiten?: WeitereTaetigkeiten;
}

interface Gewerbebetrieb {
  gewerbebetriebID: string;
  gemeindeMeldungNr: string;
  rechtsformcode: string;
  eingetragenerName: string;
  /** Angaben zur Eintragung im Handels-/Genossenschafts-/Partnerschafts-/Vereinsregister. */
  eintragung?: Eintragung;
  betriebsstaette: Betriebsstaette;
  taetigkeitenGesamt: TaetigkeitenGesamt;
  istNebenerwerb: boolean;
  anzahlVollzeitBeschaeftigte: number;
  anzahlTeilzeitBeschaeftigte: number;
  istReisegewerbe: boolean;
  /** Angabe, ob und in welcher Höhe eine Beteiligung der öffentlichen Hand am Gewerbebetrieb besteht. */
  beteiligungOeffentlicheHand?: string;
  betriebArt: BetriebArt;
  /** Angaben zur Handwerkskarte – nur relevant, wenn betriebArt.handwerk = true. */
  handwerkskarte?: Handwerkskarte;
}

interface ReferenzierteSubjekte {
  natuerlichePerson: NatuerlichePerson[];
}

export interface Anmeldung {
  nachrichtenkopf: Nachrichtenkopf;
  autor: Behoerde;
  satzErstellung: string;
  ereigniszeitpunkt: string;
  istStorno: boolean;
  gemeindeSchluessel: string;
  uuid: string;
  gueltigAb: string;
  datumMeldung: string;
  gewerbebetrieb: Gewerbebetrieb;
  referenzierteSubjekte: ReferenzierteSubjekte;
  grundAnmeldungSchluessel: string;
}

export const xGewerbeanmeldung0300 = (anmeldung: Anmeldung) => {
  const gewerbebetrieb = anmeldung.gewerbebetrieb;
  const natuerlichePerson0 = anmeldung.referenzierteSubjekte.natuerlichePerson[0];

  if (!natuerlichePerson0) {
    throw new Error(
      "Required field anmeldung.referenzierteSubjekte.natuerlichePerson[0] is missing",
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
    <xga:alg.gewerbemeldung.0300
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
      test="100">
      ${createG2gNachrichtenkopf(anmeldung.nachrichtenkopf)}
      <xga:satz>
        <xga:anmeldung>
            <xga:autor>
              <bn-beh:verzeichnisdienst listVersionID="1">
                  <code>DVDV</code>
              </bn-beh:verzeichnisdienst>
              <bn-beh:kennung>${anmeldung.autor.kennung}</bn-beh:kennung>
              <bn-beh:name>${anmeldung.autor.name}</bn-beh:name>
            </xga:autor>
            <xga:satzErstellung>${anmeldung.satzErstellung}</xga:satzErstellung>
            <xga:ereigniszeitpunkt>${anmeldung.ereigniszeitpunkt}</xga:ereigniszeitpunkt>
            <xga:istStorno>${anmeldung.istStorno}</xga:istStorno>
            <xga:gemeindeSchluessel listVersionID="2020-03-31">
              <code>${anmeldung.gemeindeSchluessel}</code>
            </xga:gemeindeSchluessel>
            <xga:uuid>${anmeldung.uuid}</xga:uuid>
            <xga:gueltigAb>${anmeldung.gueltigAb}</xga:gueltigAb>
            <xga:datumMeldung>${anmeldung.datumMeldung}</xga:datumMeldung>
            <xga:gewerbebetrieb>
              <xga:gewerbebetriebID>${gewerbebetrieb.gewerbebetriebID}</xga:gewerbebetriebID>
              <xga:gemeindeMeldungNr>${gewerbebetrieb.gemeindeMeldungNr}</xga:gemeindeMeldungNr>
              <rf:rechtsform>
                  <rf:rechtsformcode listVersionID="2.2">
                    <code>${gewerbebetrieb.rechtsformcode}</code>
                  </rf:rechtsformcode>
              </rf:rechtsform>
              <wt:wirtschaftlichTaetiger.id>${natuerlichePerson0.id}</wt:wirtschaftlichTaetiger.id>
              <ename:eingetragenerName>${gewerbebetrieb.eingetragenerName}</ename:eingetragenerName>
              ${createEintragung(gewerbebetrieb.eintragung)}
              <xga:betriebsstaette>
                  <wt:artBetriebsstaette listVersionID="1">
                    <code>${gewerbebetrieb.betriebsstaette.artBetriebsstaette}</code>
                  </wt:artBetriebsstaette>
                  ${createAnschrift(gewerbebetrieb.betriebsstaette.anschrift)}
                  ${createKommunikation(gewerbebetrieb.betriebsstaette.kommunikation)}
              </xga:betriebsstaette>
              <xga:taetigkeitenGesamt>
                  <xga:schwerpunkt>
                    <xga:taetigkeitSchwerpunkt>${gewerbebetrieb.taetigkeitenGesamt.schwerpunkt.taetigkeitSchwerpunkt}</xga:taetigkeitSchwerpunkt>
                    <wt:wirtschaftszweig>
                        <wt:wirtschaftszweigschluessel>${gewerbebetrieb.taetigkeitenGesamt.schwerpunkt.wirtschaftszweigschluessel}</wt:wirtschaftszweigschluessel>
                        <wt:versionWirtschaftszweigklassifikation listVersionID="1">
                          <code>WZ-2008</code>
                        </wt:versionWirtschaftszweigklassifikation>
                    </wt:wirtschaftszweig>
                    <xga:stichwort>${gewerbebetrieb.taetigkeitenGesamt.schwerpunkt.stichwort}</xga:stichwort>
                  </xga:schwerpunkt>
                  ${createWeitereTaetigkeiten(gewerbebetrieb.taetigkeitenGesamt.weitereTaetigkeiten)}
              </xga:taetigkeitenGesamt>
              <xga:gewerbetreibender>
                  <xga:gewerbetreibender.id>${natuerlichePerson0.id}</xga:gewerbetreibender.id>
                  <xga:istNebenerwerb>${gewerbebetrieb.istNebenerwerb}</xga:istNebenerwerb>
              </xga:gewerbetreibender>
              <xga:anzahlVollzeitBeschaeftigte>${gewerbebetrieb.anzahlVollzeitBeschaeftigte}</xga:anzahlVollzeitBeschaeftigte>
              <xga:anzahlTeilzeitBeschaeftigte>${gewerbebetrieb.anzahlTeilzeitBeschaeftigte}</xga:anzahlTeilzeitBeschaeftigte>
              <xga:istReisegewerbe>${gewerbebetrieb.istReisegewerbe}</xga:istReisegewerbe>
              ${gewerbebetrieb.beteiligungOeffentlicheHand !== undefined ? `<xga:beteiligungOeffentlicheHand><code>${gewerbebetrieb.beteiligungOeffentlicheHand}</code></xga:beteiligungOeffentlicheHand>` : ""}
              <xga:betriebArt>
                  <xga:industrie>${gewerbebetrieb.betriebArt.industrie}</xga:industrie>
                  <xga:handwerk>${gewerbebetrieb.betriebArt.handwerk}</xga:handwerk>
                  <xga:handel>${gewerbebetrieb.betriebArt.handel}</xga:handel>
                  <xga:sonstiges>${gewerbebetrieb.betriebArt.sonstiges}</xga:sonstiges>
              </xga:betriebArt>
              ${createHandwerkskarte(gewerbebetrieb.handwerkskarte)}
            </xga:gewerbebetrieb>
            <xga:referenzierteSubjekte>
              ${anmeldung.referenzierteSubjekte.natuerlichePerson.map(createNatuerlichePerson).join("\n")}
            </xga:referenzierteSubjekte>
            <xga:grundAnmeldungSchluessel>
              <code>${anmeldung.grundAnmeldungSchluessel}</code>
            </xga:grundAnmeldungSchluessel>
        </xga:anmeldung>
      </xga:satz>
    </xga:alg.gewerbemeldung.0300>`;
};
