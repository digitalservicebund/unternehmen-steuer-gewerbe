import { type CreateGewerbeanmeldungXmlData } from "../../xmlBuilders/xGewerbeordnung/gewerbeanmeldung";
import { type Anschrift } from "../../xmlBuilders/xGewerbeordnung/buildingBlocks/anschrift";
import { type BetriebArt } from "../../xmlBuilders/xGewerbeordnung/buildingBlocks/betriebArt";
import { type GewerbeRoutingInfo } from "./getGewerbeRoutingInfo";
import {
  ART_BETRIEBSSTAETTE_LABEL,
  BETEILIGUNG_OEFFENTLICHE_HAND_LABEL,
  GESCHLECHT_LABEL,
  GRUND_ANMELDUNG_LABEL,
  RECHTSFORM_LABEL,
  STAATSANGEHOERIGKEIT_LABEL,
  UNFALLVERSICHERUNGSTRAEGER_LABEL,
} from "./requestDataTransformer/xGewerbeordnungCodeLabels";

export const RECEIPT_TITLE = "Bestätigung über den Eingang der Gewerbeanmeldung";
export const RECEIPT_SUBLINE =
  "Feldnummern entsprechen dem amtlichen Vordruck GewA 1 nach § 14 GewO oder § 55 c GewO";
export const RECEIPT_NOTICE_TITLE = "Hinweis: Dieses Dokument ist kein Gewerbeschein";
export const RECEIPT_NOTICE_TEXT =
  "Es bestätigt, dass Sie Ihre Gewerbeanmeldung an das Gewerbeamt geschickt haben. " +
  "Den Gewerbeschein bekommen Sie, sobald Sie die Gebühr an das Gewerbeamt bezahlt haben.";
export const RECEIPT_SUBMITTED_BY = "Einfach Gründen";

export interface ReceiptRow {
  gewaNumber?: string;
  label: string;
  value?: string;
}

export interface ReceiptSection {
  title: string;
  rows: ReceiptRow[];
}

export interface Receipt {
  behoerdenName: string;
  gemeindekennzahl: string;
  submittedBy: string;
  createdAt: string;
  anzeigeId: string;
  sections: ReceiptSection[];
}

function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatBoolean(value?: boolean): string | undefined {
  if (value === undefined) return undefined;
  return value ? "Ja" : "Nein";
}

function formatAnschrift(anschrift?: Anschrift): string | undefined {
  if (!anschrift?.strasse || !anschrift.hausnummerVon || !anschrift.postleitzahl || !anschrift.ort)
    return undefined;
  const hausnummer = anschrift.hausnummerBis
    ? `${anschrift.hausnummerVon}-${anschrift.hausnummerBis}`
    : anschrift.hausnummerVon;
  return `${anschrift.strasse} ${hausnummer}, ${anschrift.postleitzahl} ${anschrift.ort}`;
}

function formatGeburtsortUndLand(ort?: string, staat?: string): string | undefined {
  if (!ort || !staat) return undefined;
  return `${ort}, ${staat}`;
}

function formatBetriebArt(betriebArt?: BetriebArt): string | undefined {
  if (!betriebArt) return undefined;
  const arten = [
    betriebArt.industrie ? "Industrie" : undefined,
    betriebArt.handwerk ? "Handwerk" : undefined,
    betriebArt.handel ? "Handel" : undefined,
    betriebArt.sonstiges ? "Sonstiges" : undefined,
  ].filter((art) => art !== undefined);
  return arten.length === 0 ? undefined : arten.join(", ");
}

function formatBeschaeftigte(vollzeit?: number, teilzeit?: number): string | undefined {
  if (vollzeit === undefined && teilzeit === undefined) return undefined;
  return `${vollzeit ?? 0} / ${teilzeit ?? 0}`;
}

function labelFor(labels: Record<string, string>, code?: string): string | undefined {
  return code === undefined ? undefined : labels[code];
}

export function buildReceipt(
  anmeldung: CreateGewerbeanmeldungXmlData,
  routingInfo: GewerbeRoutingInfo,
): Receipt {
  const person = anmeldung.referenzierteSubjekte?.natuerlichePerson?.[0];
  const gewerbebetrieb = anmeldung.gewerbebetrieb;
  const betriebsstaette = gewerbebetrieb?.betriebsstaette;

  const sections: ReceiptSection[] = [
    {
      title: "Angaben zur Gewerbeanmeldung",
      rows: [
        {
          gewaNumber: "32",
          label: "Datum der Anmeldung",
          value: formatDate(anmeldung.datumMeldung),
        },
        {
          gewaNumber: "25",
          label: "Grund der Neuerrichtung / Übernahme",
          value: labelFor(GRUND_ANMELDUNG_LABEL, anmeldung.grundAnmeldungSchluessel),
        },
        {
          gewaNumber: "23",
          label: "Die Anmeldung wird erstattet für",
          value: labelFor(ART_BETRIEBSSTAETTE_LABEL, betriebsstaette?.artBetriebsstaette),
        },
        {
          label: "Rechtsform",
          value: labelFor(RECHTSFORM_LABEL, gewerbebetrieb?.rechtsformcode),
        },
      ],
    },
    {
      title: "Angaben zur Person",
      rows: [
        { gewaNumber: "4", label: "Name", value: person?.name?.familienname },
        { gewaNumber: "5", label: "Vornamen", value: person?.name?.vornamen },
        {
          gewaNumber: "6",
          label: "Geschlecht",
          value: labelFor(GESCHLECHT_LABEL, person?.geschlecht),
        },
        {
          gewaNumber: "7",
          label: "Geburtsname (bei Abweichung)",
          value: person?.name?.geburtsname,
        },
        {
          gewaNumber: "8",
          label: "Geburtsdatum",
          value: formatDate(person?.geburt?.geburtsdatum),
        },
        {
          gewaNumber: "9",
          label: "Geburtsort und -land",
          value: formatGeburtsortUndLand(person?.geburt?.ort, person?.geburt?.staat),
        },
        {
          gewaNumber: "10",
          label: "Staatsangehörigkeit",
          value: labelFor(STAATSANGEHOERIGKEIT_LABEL, person?.staatsangehoerigkeit),
        },
        {
          gewaNumber: "11",
          label: "Anschrift der Wohnung",
          value: formatAnschrift(person?.anschrift),
        },
        {
          gewaNumber: "11",
          label: "Telefonnummer",
          value: person?.kommunikation?.telefon,
        },
        {
          gewaNumber: "11",
          label: "E-Mail-Adresse",
          value: person?.kommunikation?.email,
        },
      ],
    },
    {
      title: "Angaben zum Betrieb",
      rows: [
        {
          gewaNumber: "3",
          label: "Geschäftsbezeichnung",
          value: gewerbebetrieb?.geschaeftsbezeichnung,
        },
        {
          gewaNumber: "15",
          label: "Anschrift der Betriebsstätte",
          value: formatAnschrift(betriebsstaette?.anschrift),
        },
        {
          gewaNumber: "18",
          label: "Angemeldete Tätigkeit",
          value: gewerbebetrieb?.taetigkeitenGesamt?.schwerpunkt?.taetigkeitSchwerpunkt,
        },
        {
          gewaNumber: "19",
          label: "Tätigkeit im Nebenerwerb?",
          value: formatBoolean(gewerbebetrieb?.istNebenerwerb),
        },
        {
          gewaNumber: "20",
          label: "Datum des Beginns der Tätigkeit",
          value: formatDate(anmeldung.gueltigAb),
        },
        {
          gewaNumber: "21",
          label: "Art des angemeldeten Betriebes",
          value: formatBetriebArt(gewerbebetrieb?.betriebArt),
        },
        {
          gewaNumber: "22",
          label: "Zahl der tätigen Personen (Vollzeit / Teilzeit)",
          value: formatBeschaeftigte(
            gewerbebetrieb?.anzahlVollzeitBeschaeftigte,
            gewerbebetrieb?.anzahlTeilzeitBeschaeftigte,
          ),
        },
      ],
    },
    {
      title: "Erlaubnisse und Nachweise",
      rows: [
        {
          gewaNumber: "24",
          label: "Reisegewerbe",
          value: formatBoolean(gewerbebetrieb?.istReisegewerbe),
        },
        { gewaNumber: "28", label: "Liegt eine Erlaubnis vor?" },
        {
          gewaNumber: "29",
          label: "Liegt eine Handwerkskarte vor?",
          value: gewerbebetrieb?.handwerkskarte === undefined ? undefined : "Ja",
        },
        {
          gewaNumber: "30",
          label: "Liegt ein Aufenthaltstitel vor?",
          value: person?.aufenthaltstitel === undefined ? undefined : "Ja",
        },
        {
          gewaNumber: "31",
          label: "Auflage oder Beschränkung der Erwerbstätigkeit",
        },
      ],
    },
    {
      title: "Weitere Felder der Gewerbeanmeldung",
      rows: [
        {
          gewaNumber: "1",
          label: "Im Register eingetragener Name mit Rechtsform",
          value: gewerbebetrieb?.eingetragenerName,
        },
        {
          gewaNumber: "2",
          label: "Ort und Nummer des Registereintrages",
          value: gewerbebetrieb?.eintragung === undefined ? undefined : "liegt vor",
        },
        {
          gewaNumber: "12",
          label: "Zahl der geschäftsführenden Gesellschafter / gesetzlichen Vertreter",
        },
        {
          gewaNumber: "13",
          label: "Beteiligung der öffentlichen Hand",
          value: labelFor(
            BETEILIGUNG_OEFFENTLICHE_HAND_LABEL,
            gewerbebetrieb?.beteiligungOeffentlicheHand,
          ),
        },
        {
          gewaNumber: "14",
          label: "Vertretungsberechtigte Person / Betriebsleiter",
        },
        {
          gewaNumber: "16",
          label: "Hauptniederlassung (bei Zweigniederlassung)",
        },
        { gewaNumber: "17", label: "Frühere Betriebsstätte" },
        {
          gewaNumber: "26",
          label: "Früherer Gewerbetreibender oder Firmenname",
        },
        {
          gewaNumber: "27",
          label: "Bisheriger Unfallversicherungsträger",
          value: labelFor(
            UNFALLVERSICHERUNGSTRAEGER_LABEL,
            anmeldung.bisherigeUnfallversicherung?.traeger,
          ),
        },
        {
          gewaNumber: "27",
          label: "Bisherige Mitgliedsnummer",
          value: anmeldung.bisherigeUnfallversicherung?.unternehmensnummer,
        },
      ],
    },
  ];

  return {
    behoerdenName: routingInfo.gewerbeamt.name,
    gemeindekennzahl: routingInfo.ags,
    submittedBy: RECEIPT_SUBMITTED_BY,
    createdAt: new Date().toISOString(),
    anzeigeId: anmeldung.uuid ?? "",
    sections,
  };
}
