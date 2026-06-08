// https://www.xrepository.de/details/urn:xoev-de:xgewerbeordnung:codeliste:unfallversicherungstraeger_1
export const UNFALLVERSICHERUNGSTRAEGER = {
  unbekannt: "00",
  berufsgenossenschaftDerBauwirtschaft: "01",
  berufsgenossenschaftEnergieTextilElektroMedienerzeugnisse: "02",
  berufsgenossenschaftVerkehrswirtschaftPostLogistikTelekommunikation: "03",
  berufsgenossenschaftHandelUndWarenlogistik: "04",
  berufsgenossenschaftHolzUndMetall: "05",
  berufsgenossenschaftNahrungsmittelUndGastgewerbe: "06",
  berufsgenossenschaftRohstoffeUndChemischeIndustrie: "07",
  verwaltungsBerufsgenossenschaft: "08",
  berufsgenossenschaftFürGesundheitsdienstUndWohlfahrtspflege: "09",
  sozialversicherungFürLandwirtschaftForstenUndGartenbau: "10",
  unfallversicherungBundUndBahn: "11",
  unfallkasseBadenWürttemberg: "12",
  kommunaleUnfallversicherungBayern: "13",
  bayerischeLandesunfallkasse: "14",
  unfallkasseBerlin: "15",
  unfallkasseBrandenburg: "16",
  feuerwehrUnfallkasseBrandenburg: "17",
  unfallkasseFreieHansestadtBremen: "18",
  unfallkasseNord: "19",
  hanseatischeFeuerwehrUnfallkasseNord: "20",
  unfallkasseHessen: "21",
  unfallkasseMecklenburgVorpommern: "22",
  braunschweigischerGemeindeUnfallversicherungsverband: "23",
  gemeindeUnfallversicherungsverbandHannover: "24",
  landesunfallkasseNiedersachsen: "25",
  gemeindeUnfallversicherungsverbandOldenburg: "26",
  feuerwehrUnfallkasseNiedersachsen: "27",
  unfallkasseNordrheinWestfalen: "28",
  unfallkasseRheinlandPfalz: "29",
  unfallkasseSaarland: "30",
  unfallkasseSachsen: "31",
  unfallkasseSachsenAnhalt: "32",
  unfallkasseThüringen: "33",
  feuerwehrUnfallkasseMitte: "34",
} as const;

type Unfallversicherungstraeger = keyof typeof UNFALLVERSICHERUNGSTRAEGER;
export const UNFALLVERSICHERUNGSTRAEGER_KEYS = Object.keys(UNFALLVERSICHERUNGSTRAEGER) as [
  Unfallversicherungstraeger,
  ...Unfallversicherungstraeger[],
];

// https://www.xrepository.de/details/urn:xoev-de:fim:codeliste:xzufi.vertrauensniveau
export const VERTRAUENSNIVEAU = {
  unbestimmt: "00",
  basisregistrierung: "10",
  niedrig: "15",
  substantiell: "20",
  hoch: "30",
  hochplus: "40",
};

type Vertrauensniveau = keyof typeof VERTRAUENSNIVEAU;
export const VERTRAUENSNIVEAU_KEYS = Object.keys(VERTRAUENSNIVEAU) as [
  Vertrauensniveau,
  ...Vertrauensniveau[],
];

// https://www.xrepository.de/details/urn:xoev-de:xunternehmen:codeliste:rechtsformen_2
// Only the Einzelunternehmen branch (codes 400000-492000) is listed, as we currently
// only support Einzelunternehmen. The German labels are the official designations from version 2.4 of the codelist.
export const RECHTSFORM = {
  wirtschaftlicheTaetigkeitNatuerlichePerson: "400000", // Wirtschaftliche Tätigkeit einer natürlichen Person
  gewerblichesEinzelunternehmen: "410000", // gewerbliches Einzelunternehmen (ohne Hausgewerbe)
  eingetragenesEinzelunternehmen: "411000", // eingetragenes gewerbliches Einzelunternehmen (e.K.; e.Kfm.; e.Kfr.)
  eingetragenesEinzelunternehmenSitzInland: "411100", // eingetragenes gewerbliches Einzelunternehmen (Sitz in Deutschland)
  eingetragenesEinzelunternehmenSitzAusland: "411200", // eingetragenes gewerbliches Einzelunternehmen (Sitz im Ausland)
  nichtEingetragenesEinzelunternehmen: "412000", // nicht eingetragenes gewerbliches Einzelunternehmen
  nichtEingetragenesEinzelunternehmenSitzInland: "412100", // nicht eingetragenes gewerbliches Einzelunternehmen (Sitz in Deutschland)
  nichtEingetragenesEinzelunternehmenSitzAusland: "412200", // nicht eingetragenes gewerbliches Einzelunternehmen (Sitz im Ausland)
  sonstigeWirtschaftlicheTaetigkeitNatuerlichePerson: "420000", // sonstige wirtschaftliche Tätigkeit einer natürlichen Person
  freiberufler: "421000", // Freiberufler
  landForstwirt: "422000", // Land-/Forstwirt
  hausgewerbe: "423000", // Hausgewerbe (und gleichgestellte Personen)
  beteiligungGewerblichePersonengesellschaft: "424000", // Beteiligung an gewerblichen Personengesellschaften
  auffangtatbestaende: "428000", // Auffangtatbestände (wirtschaftliche Tätigkeit einer natürlichen Person)
  sonstigeWirtschaftlicheTaetigkeitAuffangtatbestand: "428100", // sonstige wirtschaftliche Tätigkeit einer natürlichen Person (Auffangtatbestand)
  auslaendischeWirtschaftlicheTaetigkeitNatuerlichePerson: "490000", // ausländische wirtschaftliche Tätigkeit einer natürlichen Person
  auslaendischesEinzelunternehmenEuRecht: "491000", // ausländisches gewerbliches Einzelunternehmen (EU-Recht)
  auslaendischesEinzelunternehmenNichtEuRecht: "492000", // ausländisches gewerbliches Einzelunternehmen (Nicht-EU-Recht)
} as const;

type RechtsformEinzelunternehmen = keyof typeof RECHTSFORM;
export const RECHTSFORM_KEYS = Object.keys(RECHTSFORM) as [
  RechtsformEinzelunternehmen,
  ...RechtsformEinzelunternehmen[],
];
