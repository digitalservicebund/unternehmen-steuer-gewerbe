import { xml } from "../escapeXml";
import { createBetriebArt, type BetriebArt } from "./betriebArt";
import { createBetriebsstaette, type Betriebsstaette } from "./betriebsstaette";
import { createEintragung, type Eintragung } from "./eintragung";
import { createHandwerkskarte, type Handwerkskarte } from "./handwerkskarte";
import { createTaetigkeiten, type TaetigkeitenGesamt } from "./taetigkeiten";

export interface Gewerbebetrieb {
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

export function createGewerbebetrieb(
  gewerbebetrieb: Gewerbebetrieb,
  wirtschaftlichTaetigerId: string,
) {
  return `
    <xga:gewerbebetrieb>
      <xga:gewerbebetriebID>${xml(gewerbebetrieb.gewerbebetriebID)}</xga:gewerbebetriebID>
      <xga:gemeindeMeldungNr>${xml(gewerbebetrieb.gemeindeMeldungNr)}</xga:gemeindeMeldungNr>
      <rf:rechtsform>
        <rf:rechtsformcode listVersionID="2.2">
          <code>${xml(gewerbebetrieb.rechtsformcode)}</code>
        </rf:rechtsformcode>
      </rf:rechtsform>
      <wt:wirtschaftlichTaetiger.id>${xml(wirtschaftlichTaetigerId)}</wt:wirtschaftlichTaetiger.id>
      <ename:eingetragenerName>${xml(gewerbebetrieb.eingetragenerName)}</ename:eingetragenerName>
      ${createEintragung(gewerbebetrieb.eintragung)}
      ${createBetriebsstaette(gewerbebetrieb.betriebsstaette)}
      ${createTaetigkeiten(gewerbebetrieb.taetigkeitenGesamt)}
      <xga:gewerbetreibender>
        <xga:gewerbetreibender.id>${xml(wirtschaftlichTaetigerId)}</xga:gewerbetreibender.id>
        <xga:istNebenerwerb>${xml(gewerbebetrieb.istNebenerwerb)}</xga:istNebenerwerb>
      </xga:gewerbetreibender>
      <xga:anzahlVollzeitBeschaeftigte>${xml(gewerbebetrieb.anzahlVollzeitBeschaeftigte)}</xga:anzahlVollzeitBeschaeftigte>
      <xga:anzahlTeilzeitBeschaeftigte>${xml(gewerbebetrieb.anzahlTeilzeitBeschaeftigte)}</xga:anzahlTeilzeitBeschaeftigte>
      <xga:istReisegewerbe>${xml(gewerbebetrieb.istReisegewerbe)}</xga:istReisegewerbe>
      ${gewerbebetrieb.beteiligungOeffentlicheHand ? `<xga:beteiligungOeffentlicheHand><code>${xml(gewerbebetrieb.beteiligungOeffentlicheHand)}</code></xga:beteiligungOeffentlicheHand>` : ""}
      ${createBetriebArt(gewerbebetrieb.betriebArt)}
      ${createHandwerkskarte(gewerbebetrieb.handwerkskarte)}
    </xga:gewerbebetrieb>`;
}
