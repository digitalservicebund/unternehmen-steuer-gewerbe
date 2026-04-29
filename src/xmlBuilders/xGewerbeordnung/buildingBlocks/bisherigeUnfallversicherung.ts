import { escapeXml } from "../../../helpers/escapeXml";

// https://www.xrepository.de/details/urn:xoev-de:xgewerbeordnung:codeliste:unfallversicherungstraeger_1
export const UNFALLVERSICHERUNGSTRAEGER = {
  "00": "Unbekannt",
  "01": "Berufsgenossenschaft der Bauwirtschaft",
  "02": "Berufsgenossenschaft Energie Textil Elektro Medienerzeugnisse",
  "03": "Berufsgenossenschaft Verkehrswirtschaft Post-Logistik Telekommunikation",
  "04": "Berufsgenossenschaft Handel und Warenlogistik",
  "05": "Berufsgenossenschaft Holz und Metall",
  "06": "Berufsgenossenschaft Nahrungsmittel und Gastgewerbe",
  "07": "Berufsgenossenschaft Rohstoffe und chemische Industrie",
  "08": "Verwaltungs-Berufsgenossenschaft",
  "09": "Berufsgenossenschaft für Gesundheitsdienst und Wohlfahrtspflege",
  "10": "Sozialversicherung für Landwirtschaft, Forsten und Gartenbau",
  "11": "Unfallversicherung Bund und Bahn",
  "12": "Unfallkasse Baden-Württemberg",
  "13": "Kommunale Unfallversicherung Bayern",
  "14": "Bayerische Landesunfallkasse",
  "15": "Unfallkasse Berlin",
  "16": "Unfallkasse Brandenburg",
  "17": "Feuerwehr-Unfallkasse Brandenburg",
  "18": "Unfallkasse Freie Hansestadt Bremen",
  "19": "Unfallkasse Nord",
  "20": "Hanseatische Feuerwehr-Unfallkasse Nord",
  "21": "Unfallkasse Hessen",
  "22": "Unfallkasse Mecklenburg-Vorpommern",
  "23": "Braunschweigischer Gemeinde-Unfallversicherungsverband",
  "24": "Gemeinde-Unfallversicherungsverband Hannover",
  "25": "Landesunfallkasse Niedersachsen",
  "26": "Gemeinde-Unfallversicherungsverband Oldenburg",
  "27": "Feuerwehr-Unfallkasse Niedersachsen",
  "28": "Unfallkasse Nordrhein-Westfalen",
  "29": "Unfallkasse Rheinland-Pfalz",
  "30": "Unfallkasse Saarland",
  "31": "Unfallkasse Sachsen",
  "32": "Unfallkasse Sachsen-Anhalt",
  "33": "Unfallkasse Thüringen",
  "34": "Feuerwehr-Unfallkasse Mitte",
} as const;

export type UnfallversicherungstraegerCode = keyof typeof UNFALLVERSICHERUNGSTRAEGER;

export const UNFALLVERSICHERUNGSTRAEGER_CODES = Object.keys(UNFALLVERSICHERUNGSTRAEGER) as [
  UnfallversicherungstraegerCode,
  ...UnfallversicherungstraegerCode[],
];

export interface BisherigeUnfallversicherung {
  /** Schlüssel des Trägers der bisherigen gesetzlichen Unfallversicherung. */
  traeger?: UnfallversicherungstraegerCode;
  /** Unternehmensnummer bei der bisherigen Unfallversicherung (früher Mitgliedsnummer). */
  unternehmensnummer?: string;
}

export function createBisherigeUnfallversicherung(
  bisherigeUnfallversicherung: BisherigeUnfallversicherung | undefined,
) {
  if (!bisherigeUnfallversicherung) return "";
  return `
    <bk:bisherigeUnfallversicherung>
      <bk:traeger listVersionID="1">
        <code>${bisherigeUnfallversicherung.traeger ? escapeXml(bisherigeUnfallversicherung.traeger) : ""}</code>
      </bk:traeger>
      ${bisherigeUnfallversicherung.unternehmensnummer ? `<bk:unternehmensnummer>${escapeXml(bisherigeUnfallversicherung.unternehmensnummer)}</bk:unternehmensnummer>` : ""}
    </bk:bisherigeUnfallversicherung>`;
}
