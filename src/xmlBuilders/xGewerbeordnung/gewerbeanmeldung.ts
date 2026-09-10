// https://www.xrepository.de/details/urn:xoev-de:kosit:standard:xgewerbeordnung_1.6#version
import { createValidationErrorSummary, validateXml } from "../../helpers/xmlValidator";
import { createBehoerde, type Behoerde } from "./buildingBlocks/behoerde";
import {
  createBisherigeUnfallversicherung,
  type BisherigeUnfallversicherung,
} from "./buildingBlocks/bisherigeUnfallversicherung";
import {
  createG2gNachrichtenkopf,
  type Nachrichtenkopf,
} from "./buildingBlocks/g2gNachrichtenkopf";
import { createGewerbebetrieb, type Gewerbebetrieb } from "./buildingBlocks/gewerbebetrieb";
import {
  createNachweisdokumentOnlinedienst,
  type Nachweisdokument,
} from "./buildingBlocks/nachweisdokument";
import {
  createReferenzierteSubjekte,
  type ReferenzierteSubjekte,
} from "./buildingBlocks/referenzierteSubjekte";
import { optionalTag, optionalWrappedTag } from "../../helpers/xmlTag";

export type TransportMethod = "fitConnect" | "osci";

export interface CreateGewerbeanmeldungXmlData {
  nachrichtenkopf?: Nachrichtenkopf;
  /** Die die Gewerbeanzeige entgegennehmende Behörde. */
  autor?: Behoerde;
  /** ID-Querverweis auf das natuerlichePerson- oder juristischePerson-Element des Anzeigenden. */
  anzeigerenderId?: string;
  /** ID-Querverweis auf das natuerlichePerson-Element der handelnden Person. */
  handelndePersonId?: string;
  /** Code des Vertrauensniveaus gemäß FIM-Codeliste urn:xoev-de:fim:codeliste:vertrauensniveau (XSD-Pflichtfeld). */
  handelndePersonVertrauensniveauCode?: string;
  /** ID-Querverweis auf das natuerlichePerson-Element des Ansprechpartners. */
  ansprechpartnerId?: string;
  /** Vom Online-Dienst selbst erstelltes Nachweisdokument, das als Anlage mitübermittelt wird. */
  nachweisdokumentOnlinedienst?: Nachweisdokument;
  /** Angabe des Zeitpunkts der Erstellung des XML-Datensatzes für die Übermittlung. */
  satzErstellung?: string;
  /** Der Zeitpunkt, zu welchem der die Übermittlung auslösende Verwaltungsvorgang (Aufnahme / Änderung / Korrektur eines Datensatzes) im gemeindlichen Gewerbeverzeichnis gespeichert wurde. */
  ereigniszeitpunkt?: string;
  /** Angabe über das Vorliegen einer Stornierung dieser Gewerbemeldung  */
  istStorno?: boolean;
  /** Amtlicher Gemeindeschlüssel der Sitzgemeinde der Betriebsstätte */
  gemeindeSchluessel?: string;
  /** Stadtbezirk der Betriebsstätte (Stadtstaaten); Pflicht für Hamburg und Berlin (schematron rule SCH-0189). */
  gemeindeschluesselErgaenzung?: string;
  /** Eindeutige Kennzeichnung der Gewerbeanzeige als UUID. */
  uuid?: string;
  /** Datum des Beginns, der meldepflichtigen Änderung, der Aufgabe des Gewerbes oder der Datenaktualisierung */
  gueltigAb?: string;
  /** Datum, an welchem die An-, Um-, Abmeldung bzw. Datenaktualisierung an die Gewerbemeldestelle übergeben wurde. */
  datumMeldung?: string;
  /** Angaben zur bisherigen Unfallversicherung bei Übernahme, Verschmelzung oder Spaltung. Laut SCH-0094 Pflicht bei Anmeldung, außer bei Neugründung einer Hauptniederlassung, Neugründung einer Zweigniederlassung mit ausländischer Hauptniederlassung, Reisegewerbe oder technischer Anmeldung – in diesen Fällen darf das Feld nicht angegeben werden. */
  bisherigeUnfallversicherung?: BisherigeUnfallversicherung;
  /** Ein Gewerbebetrieb beschreibt die wirtschaftliche Einheit, unter der ein oder mehrere Gewerbetreibende/r im Außenverhältnis am Wirtschaftsleben teilnehmen. */
  gewerbebetrieb?: Gewerbebetrieb;
  /** Innerhalb des Elements gewerbebetrieb über ID referenzierte Subjekte. */
  referenzierteSubjekte?: ReferenzierteSubjekte;
  /** Grund für Anmeldung - code */
  grundAnmeldungSchluessel?: string;
}

// FIT-Connect needs the xmlns:xsi and xsi:schemaLocation to be present, OSCI does not
const XSI_ATTRIBUTES = `
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.xgewerbeordnung.de/spezifikation/xga/1.6 xgewerbeordnung-gewerbeanzeige.xsd"` as const;

function createRootAttributes(transportMethod: TransportMethod) {
  const xsiAttributes = transportMethod === "fitConnect" ? XSI_ATTRIBUTES : "";

  return `
  xmlns:xga="http://www.xgewerbeordnung.de/spezifikation/xga/1.6"${xsiAttributes}
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
  produkt="Schneller Gründen"
  produkthersteller="DigitalService GmbH des Bundes"
  produktversion="1"
  standard="XGewerbeordnung"
  version="1.6"
`;
}

function createAutor(autor: Behoerde | undefined) {
  if (!autor) return "";
  return `<xga:autor>${createBehoerde(autor)}</xga:autor>`;
}

export async function createGewerbeanmeldungXml(
  gewerbeanmeldung: CreateGewerbeanmeldungXmlData,
  transportMethod: TransportMethod,
): Promise<string> {
  const natuerlichePerson0 = gewerbeanmeldung.referenzierteSubjekte?.natuerlichePerson?.[0];

  const gewerbeanmeldungXml = `<?xml version="1.0" encoding="UTF-8"?>
    <xga:ext.gewerbemeldung.0400 ${createRootAttributes(transportMethod)}>
      ${createG2gNachrichtenkopf(gewerbeanmeldung.nachrichtenkopf)}
      <xga:satz>
        ${optionalTag("antr:anzeigender.id", gewerbeanmeldung.anzeigerenderId)}
        ${optionalTag("antr:handelndePerson.id", gewerbeanmeldung.handelndePersonId)}
        ${optionalWrappedTag("bk:handelndePerson.vertrauensniveauIdentifikation", "code", gewerbeanmeldung.handelndePersonVertrauensniveauCode, ' listVersionID="4"')}
        ${optionalTag("antr:ansprechpartner.id", gewerbeanmeldung.ansprechpartnerId)}
        ${createNachweisdokumentOnlinedienst(gewerbeanmeldung.nachweisdokumentOnlinedienst)}
        <xga:anmeldung>
            ${createAutor(gewerbeanmeldung.autor)}
            ${optionalTag("xga:satzErstellung", gewerbeanmeldung.satzErstellung)}
            ${optionalTag("xga:ereigniszeitpunkt", gewerbeanmeldung.ereigniszeitpunkt)}
            ${optionalTag("xga:istStorno", gewerbeanmeldung.istStorno)}
            ${optionalWrappedTag("xga:gemeindeSchluessel", "code", gewerbeanmeldung.gemeindeSchluessel, ' listVersionID="2020-03-31"')}
            ${optionalWrappedTag("xga:gemeindeschluesselErgaenzung", "code", gewerbeanmeldung.gemeindeschluesselErgaenzung, ' listVersionID="1"')}
            ${optionalTag("xga:uuid", gewerbeanmeldung.uuid)}
            ${optionalTag("xga:gueltigAb", gewerbeanmeldung.gueltigAb)}
            ${optionalTag("xga:datumMeldung", gewerbeanmeldung.datumMeldung)}
            ${createBisherigeUnfallversicherung(gewerbeanmeldung.bisherigeUnfallversicherung)}
            ${createGewerbebetrieb(gewerbeanmeldung.gewerbebetrieb, natuerlichePerson0?.id ?? "")}
            ${createReferenzierteSubjekte(gewerbeanmeldung.referenzierteSubjekte)}
            ${optionalWrappedTag("xga:grundAnmeldungSchluessel", "code", gewerbeanmeldung.grundAnmeldungSchluessel)}
        </xga:anmeldung>
      </xga:satz>
    </xga:ext.gewerbemeldung.0400>`;

  const xmlValidationResult = await validateXml(gewerbeanmeldungXml);

  if (!xmlValidationResult.isValid) {
    throw new Error(
      `Generated XGewerbeanmeldung is invalid. ${createValidationErrorSummary(xmlValidationResult)}`,
    );
  }

  return gewerbeanmeldungXml;
}
