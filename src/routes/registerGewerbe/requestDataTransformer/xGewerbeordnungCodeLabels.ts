import { STAATSANGEHOERIGKEIT } from "./xGewerbeordnungCodes";

// Wording of the codes as printed on the amtlicher Vordruck GewA 1.

/** urn:xoev-de:xgewerbeordnung:codeliste:grundfueranmeldung_3; only "01" is transmitted. */
export const GRUND_ANMELDUNG_LABEL: Record<string, string> = {
  "01": "Neugründung",
};

/** urn:xoev-de:xgewerbeordnung:codeliste:artbetriebsstaette_1 */
export const ART_BETRIEBSSTAETTE_LABEL: Record<string, string> = {
  "01": "eine Hauptniederlassung",
  "02": "eine Zweigniederlassung",
  "03": "eine unselbstständige Zweigstelle",
};

/** urn:xoev-de:xunternehmen:codeliste:rechtsformen_2; only "412000" is transmitted. */
export const RECHTSFORM_LABEL: Record<string, string> = {
  "412000": "Einzelunternehmen",
};

/** "x" (ohne Angabe) intentionally missing: it is rendered as an empty value. */
export const GESCHLECHT_LABEL: Record<string, string> = {
  m: "männlich",
  w: "weiblich",
  d: "divers",
};

export const BETEILIGUNG_OEFFENTLICHE_HAND_LABEL: Record<string, string> = {
  "0": "nein",
  "1": "ja",
  "2": "nicht bekannt",
};

/** urn:xoev-de:xgewerbeordnung:codeliste:unfallversicherungstraeger_1 */
export const UNFALLVERSICHERUNGSTRAEGER_LABEL: Record<string, string> = {
  "00": "unbekannt",
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
};

const STAATSANGEHOERIGKEIT_LABEL_OVERRIDES: Record<string, string> = {
  bosnischHerzegowinisch: "bosnisch-herzegowinisch",
  britischBOTC: "britisch (BOTC)",
  caboVerdisch: "cabo-verdisch",
  chinesischHongkong: "chinesisch (Hongkong)",
  chinesischMacau: "chinesisch (Macau)",
  costaRicanisch: "costa-ricanisch",
  derDemokratischenRepublikKongo: "der Demokratischen Republik Kongo",
  derDemokratischenVolksrepublikKorea: "der Demokratischen Volksrepublik Korea",
  derRepublikKorea: "der Republik Korea",
  derVereinigtenArabischenEmirate: "der Vereinigten Arabischen Emirate",
  guineaBissauisch: "guinea-bissauisch",
  jugoslawischBundesrepublik: "jugoslawisch (Bundesrepublik)",
  ohneAngabe: "ohne Angabe",
  ohneBezeichnung: "ohne Bezeichnung",
  papuaNeuguineisch: "papua-neuguineisch",
  sanMarinesisch: "san-marinesisch",
  saudiArabisch: "saudi-arabisch",
  serbischKosovo: "serbisch (Kosovo)",
  sierraLeonisch: "sierra-leonisch",
  sriLankisch: "sri-lankisch",
  sudanesischSüdsudan: "sudanesisch (Südsudan)",
  vonSerbienUndMontenegro: "von Serbien und Montenegro",
  vonStKittsUndNevis: "von St. Kitts und Nevis",
  vonTimorLeste: "von Timor-Leste",
  vonTrinidadUndTobago: "von Trinidad und Tobago",
};

export const STAATSANGEHOERIGKEIT_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(STAATSANGEHOERIGKEIT).map(([key, code]) => [
    code,
    STAATSANGEHOERIGKEIT_LABEL_OVERRIDES[key] ?? key,
  ]),
);
