// https://www.xrepository.de/details/urn:xoev-de:kosit:standard:xgewerbeordnung_1.6#version
import {
  createG2gNachrichtenkopf,
  type Behoerde,
  type Nachrichtenkopf,
} from "./buildingBlocks/g2gNachrichtenkopf";
import { createEintragung, type Eintragung } from "./buildingBlocks/eintragung";
import { createAnschrift, type Anschrift } from "./buildingBlocks/anschrift";
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
import { xml } from "./escapeXml";

interface BetriebArt {
  /** In diesem Element wird angegeben, ob es sich um einen Industriebetrieb handelt. */
  industrie: boolean;
  /** In diesem Element wird angegeben, ob es sich um einen Handwerksbetrieb handelt. */
  handwerk: boolean;
  /** In diesem Element wird angegeben, ob es sich um einen Handelsbetrieb handelt. */
  handel: boolean;
  /** In diesem Element wird angegeben, ob es sich um Betrieb sonstiger Art handelt. */
  sonstiges: boolean;
}

interface Betriebsstaette {
  /** Art der Betriebsstätte (Code, listVersionID="1"); ab 2024-05-01 nur 01/02/03 zulässig (SCH-0256). */
  artBetriebsstaette: string;
  /** Angaben für die Adressierung im Inland, */
  anschrift: Anschrift;
  /** Kontaktdaten der Betriebsstätte. */
  kommunikation?: Kommunikation;
}

interface Taetigkeit {
  /** Hier wird der vom Gewerbetreibenden angegebene Tätigkeitsschwerpunkt übermittelt. Es handelt sich hierbei nicht um den in Text des im Element wirtschaftszweig angegebenen Wirtschaftszweigschlüssels, sondern um die ursprüngliche Angabe des Gewerbetreibenden */
  taetigkeitSchwerpunkt: string;
  /** Wirtschaftszweigschlüssel gemäß der Klassifikation der Wirtschaftszweige des Statistischen Bundesamts. */
  wirtschaftszweigschluessel: string;
  /** Übermittelt werden soll, wenn im Fachverfahren vorhanden, die Sachbearbeiter-Auswahl des Stichwortes aus dem entsprechenden Schlüsselverzeichnis, das zur Zuordnung des Wirtschaftszweig-Schlüssels der Tätigkeit geführt hat. Ein Stichwort sollte nur übermittelt werden, wenn auch ein Tätigkeitsschlüssel (Element wt:wirtschaftszweig) angegeben ist. */
  stichwort: string;
}

interface TaetigkeitenGesamt {
  /** Es ist der Schwerpunkt der tatsächlich an der gemeldeten Betriebsstätte ausgeübten Tätigkeiten anzugeben. Es gibt genau einen Schwerpunkt. Wenn an dieser Betriebstätte nur eine Tätigkeit ausgeübt wird, stellt diese den Schwerpunkt dar */
  schwerpunkt: Taetigkeit;
  /** Weitere Tätigkeiten neben der Schwerpunkttätigkeit. */
  weitereTaetigkeiten?: WeitereTaetigkeiten;
}

interface Gewerbebetrieb {
  /** Eine UUID als eindeutige technische Identifikation des Gewerbebetriebes, gleiche fachliche, aber vom AGS unabhängige Systematik wie gemeindeMeldungNr. */
  gewerbebetriebID: string;
  /** Nummer der Meldung des Gewerbebetriebes in der Gemeinde. Die Gemeindemeldungsnummer wird von den Gewerbeämtern i.d.R. so vergeben, dass Gewerbebetriebe damit innerhalb des Zuständigkeitsbereichs einer Gewerbebehörde eindeutig identifiziert werden können. */
  gemeindeMeldungNr: string;
  /** Angabe der Rechtsform */
  rechtsformcode: string;
  /** Die im Handels-, Genossenschafts- oder Gesellschaftsregister eingetragene Firma eines wirtschaftlich Tätigen oder einer wirtschaftlichen Tätigkeit (z. B. eingetragenes Einzelunternehmen, eingetragene Zweigniederlassung) bzw. der im Vereins-, Partnerschafts- oder Stiftungsregister oder im Stiftungsverzeichnis eingetragene Name */
  eingetragenerName: string;
  /** Dieses Kerndatenobjekt fasst die Daten, mit welchen die Eintragung eines wirtschaftlich Tätigen bzw. eines Gewerbebetriebs in ein Register (Handels-, Gesellschafts-, Genossenschafts-, Vereins- oder Stiftungsregister) oder in ein Verzeichnis (Stiftungsverzeichnis) identifiziert werden kann */
  eintragung?: Eintragung;
  /** Angaben zu der Betriebsstätte. */
  betriebsstaette: Betriebsstaette;
  /** Mittels dieses Datentyps werden die an der Betriebsstätte tatsächlich ausgeübten Tätigkeiten angegeben. */
  taetigkeitenGesamt: TaetigkeitenGesamt;
  /** Mit diesem Element kann übermittelt werden, ob es sich bei dem Gewerbe um einen Nebenerwerb des angegebenen Gewerbetreibenden handelt */
  istNebenerwerb: boolean;
  /** In diesem Element wird die Anzahl der Vollzeitbeschäftigten (inklusive Ehe- oder Lebenspartner, Aushilfen, jedoch stets ohne den Inhaber selbst) angegeben, welche zum Zeitpunkt der Gewerbemeldung in der Betriebsstätte tätig sind. */
  anzahlVollzeitBeschaeftigte: number;
  /** In diesem Element wird die Anzahl der Teilzeitbeschäftigten (inklusive Ehe- oder Lebenspartner, Aushilfen, jedoch stets ohne den Inhaber selbst) angegeben, welche zum Zeitpunkt der Gewerbemeldung in der Betriebsstätte tätig sind. */
  anzahlTeilzeitBeschaeftigte: number;
  /** Mit diesem Element kann übermittelt werden, ob es sich bei dem Gewerbe um eine Reisegewerbe handelt */
  istReisegewerbe: boolean;
  /** Angabe, ob und in welcher Höhe eine Beteiligung der öffentlichen Hand am Gewerbebetrieb besteht. */
  beteiligungOeffentlicheHand?: string;
  /** Gibt die Art eine Betriebes (Handels-, Handwerks-, Industrie oder sonstiger Betrieb) an. */
  betriebArt: BetriebArt;
  /** Angaben zur Handwerkskarte – nur relevant, wenn betriebArt.handwerk = true. */
  handwerkskarte?: Handwerkskarte;
}

interface ReferenzierteSubjekte {
  natuerlichePerson: NatuerlichePerson[];
}

export interface Anmeldung {
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

export const xGewerbeanmeldung0300 = (anmeldung: Anmeldung) => {
  const gewerbebetrieb = anmeldung.gewerbebetrieb;
  const natuerlichePerson0 = anmeldung.referenzierteSubjekte.natuerlichePerson[0];

  if (!natuerlichePerson0) {
    throw new Error(
      "Required field anmeldung.referenzierteSubjekte.natuerlichePerson[0] is missing",
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
    <xga:alg.gewerbemeldung.0300 ${ROOT_ATTRIBUTES}>
      ${createG2gNachrichtenkopf(anmeldung.nachrichtenkopf)}
      <xga:satz>
        <xga:anmeldung>
            <xga:autor>
              <bn-beh:verzeichnisdienst listVersionID="1">
                  <code>DVDV</code>
              </bn-beh:verzeichnisdienst>
              <bn-beh:kennung>${xml(anmeldung.autor.kennung)}</bn-beh:kennung>
              <bn-beh:name>${xml(anmeldung.autor.name)}</bn-beh:name>
            </xga:autor>
            <xga:satzErstellung>${xml(anmeldung.satzErstellung)}</xga:satzErstellung>
            <xga:ereigniszeitpunkt>${xml(anmeldung.ereigniszeitpunkt)}</xga:ereigniszeitpunkt>
            <xga:istStorno>${xml(anmeldung.istStorno)}</xga:istStorno>
            <xga:gemeindeSchluessel listVersionID="2020-03-31">
              <code>${xml(anmeldung.gemeindeSchluessel)}</code>
            </xga:gemeindeSchluessel>
            <xga:uuid>${xml(anmeldung.uuid)}</xga:uuid>
            <xga:gueltigAb>${xml(anmeldung.gueltigAb)}</xga:gueltigAb>
            <xga:datumMeldung>${xml(anmeldung.datumMeldung)}</xga:datumMeldung>
            <xga:gewerbebetrieb>
              <xga:gewerbebetriebID>${xml(gewerbebetrieb.gewerbebetriebID)}</xga:gewerbebetriebID>
              <xga:gemeindeMeldungNr>${xml(gewerbebetrieb.gemeindeMeldungNr)}</xga:gemeindeMeldungNr>
              <rf:rechtsform>
                  <rf:rechtsformcode listVersionID="2.2">
                    <code>${xml(gewerbebetrieb.rechtsformcode)}</code>
                  </rf:rechtsformcode>
              </rf:rechtsform>
              <wt:wirtschaftlichTaetiger.id>${xml(natuerlichePerson0.id)}</wt:wirtschaftlichTaetiger.id>
              <ename:eingetragenerName>${xml(gewerbebetrieb.eingetragenerName)}</ename:eingetragenerName>
              ${createEintragung(gewerbebetrieb.eintragung)}
              <xga:betriebsstaette>
                  <wt:artBetriebsstaette listVersionID="1">
                    <code>${xml(gewerbebetrieb.betriebsstaette.artBetriebsstaette)}</code>
                  </wt:artBetriebsstaette>
                  ${createAnschrift(gewerbebetrieb.betriebsstaette.anschrift)}
                  ${createKommunikation(gewerbebetrieb.betriebsstaette.kommunikation)}
              </xga:betriebsstaette>
              <xga:taetigkeitenGesamt>
                  <xga:schwerpunkt>
                    <xga:taetigkeitSchwerpunkt>${xml(gewerbebetrieb.taetigkeitenGesamt.schwerpunkt.taetigkeitSchwerpunkt)}</xga:taetigkeitSchwerpunkt>
                    <wt:wirtschaftszweig>
                        <wt:wirtschaftszweigschluessel>${xml(gewerbebetrieb.taetigkeitenGesamt.schwerpunkt.wirtschaftszweigschluessel)}</wt:wirtschaftszweigschluessel>
                        <wt:versionWirtschaftszweigklassifikation listVersionID="1">
                          <code>WZ-2008</code>
                        </wt:versionWirtschaftszweigklassifikation>
                    </wt:wirtschaftszweig>
                    <xga:stichwort>${xml(gewerbebetrieb.taetigkeitenGesamt.schwerpunkt.stichwort)}</xga:stichwort>
                  </xga:schwerpunkt>
                  ${createWeitereTaetigkeiten(gewerbebetrieb.taetigkeitenGesamt.weitereTaetigkeiten)}
              </xga:taetigkeitenGesamt>
              <xga:gewerbetreibender>
                  <xga:gewerbetreibender.id>${xml(natuerlichePerson0.id)}</xga:gewerbetreibender.id>
                  <xga:istNebenerwerb>${xml(gewerbebetrieb.istNebenerwerb)}</xga:istNebenerwerb>
              </xga:gewerbetreibender>
              <xga:anzahlVollzeitBeschaeftigte>${xml(gewerbebetrieb.anzahlVollzeitBeschaeftigte)}</xga:anzahlVollzeitBeschaeftigte>
              <xga:anzahlTeilzeitBeschaeftigte>${xml(gewerbebetrieb.anzahlTeilzeitBeschaeftigte)}</xga:anzahlTeilzeitBeschaeftigte>
              <xga:istReisegewerbe>${xml(gewerbebetrieb.istReisegewerbe)}</xga:istReisegewerbe>
              ${gewerbebetrieb.beteiligungOeffentlicheHand ? `<xga:beteiligungOeffentlicheHand><code>${xml(gewerbebetrieb.beteiligungOeffentlicheHand)}</code></xga:beteiligungOeffentlicheHand>` : ""}
              <xga:betriebArt>
                  <xga:industrie>${xml(gewerbebetrieb.betriebArt.industrie)}</xga:industrie>
                  <xga:handwerk>${xml(gewerbebetrieb.betriebArt.handwerk)}</xga:handwerk>
                  <xga:handel>${xml(gewerbebetrieb.betriebArt.handel)}</xga:handel>
                  <xga:sonstiges>${xml(gewerbebetrieb.betriebArt.sonstiges)}</xga:sonstiges>
              </xga:betriebArt>
              ${createHandwerkskarte(gewerbebetrieb.handwerkskarte)}
            </xga:gewerbebetrieb>
            <xga:referenzierteSubjekte>
              ${anmeldung.referenzierteSubjekte.natuerlichePerson.map(createNatuerlichePerson).join("\n")}
            </xga:referenzierteSubjekte>
            <xga:grundAnmeldungSchluessel>
              <code>${xml(anmeldung.grundAnmeldungSchluessel)}</code>
            </xga:grundAnmeldungSchluessel>
        </xga:anmeldung>
      </xga:satz>
    </xga:alg.gewerbemeldung.0300>`;
};
