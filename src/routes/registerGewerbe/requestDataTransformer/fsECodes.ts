export const RELIGIONSSCHLUESSEL = {
  nichtKirchensteuerpflichtig: "11",
  römischKatholisch: "03",
  evangelisch: "02",
  evangelischReformiert: "05",
  evangelischReformierteKircheBückeburg: "20",
  evangelischReformierteKircheStadthagen: "21",
  französischReformiert: "07",
  freieReligionsgemeinschaftAlzey: "16",
  freireligiöseLandesgemeindeBaden: "13",
  freireligiöseLandesgemeindePfalz: "14",
  freireligiöseGemeindeMainz: "15",
  freireligiöseGemeindeOffenbach: "17",
  israelitischeReligionsgemeinschaftBaden: "25",
  jüdischeGemeindenHessen: "19",
  israelitischeKultusgemeindenBayern: "26",
  jüdischeGemeindeFrankfurt: "18",
  jüdischeKultusgemeindenBadKreuznachKoblenz: "27",
  israelitischSaarland: "28",
  israelitischeReligionsgemeinschaftWürttemberg: "12",
  nordrheinWestfalenIsraelitisch: "29",
  jüdischeGemeindeHamburg: "24",
  altkatholisch: "04",
  sonstige: "10",
} as const;

type Religionsschluessel = keyof typeof RELIGIONSSCHLUESSEL;
export const RELIGIONSSCHLUESSEL_KEYS = Object.keys(RELIGIONSSCHLUESSEL) as [
  Religionsschluessel,
  ...Religionsschluessel[],
];

export const GEWINN_ERMITTLUNG = {
  einnahmenüberschussrechnung: "01",
  betriebsvermögensvergleich: "02",
  gewinnermittlungDurchschnittssätze: "03",
  sonstige: "04",
} as const;

type GewinnErmittlung = keyof typeof GEWINN_ERMITTLUNG;
export const GEWINN_ERMITTLUNG_KEYS = Object.keys(GEWINN_ERMITTLUNG) as [
  GewinnErmittlung,
  ...GewinnErmittlung[],
];

export const SOLL_IST_VERSTEUERUNG = {
  sollVersteuerung: "1",
  istVersteuerung: "2",
} as const;

type SollIstVersteuerung = keyof typeof SOLL_IST_VERSTEUERUNG;
export const SOLL_IST_VERSTEUERUNG_KEYS = Object.keys(SOLL_IST_VERSTEUERUNG) as [
  SollIstVersteuerung,
  ...SollIstVersteuerung[],
];

export const IST_VERSTEUERUNG_GRUND = {
  unterschreitungUmsatzgrenze: "unterschreitungUmsatzgrenze",
  befreiungBuchführungspflicht: "befreiungBuchführungspflicht",
  freiberuflicheTätigkeit: "freiberuflicheTätigkeit",
} as const;

type IstVersteuerungGrund = keyof typeof IST_VERSTEUERUNG_GRUND;
export const IST_VERSTEUERUNG_GRUND_KEYS = Object.keys(IST_VERSTEUERUNG_GRUND) as [
  IstVersteuerungGrund,
  ...IstVersteuerungGrund[],
];

export const ZAHLLAST_UEBERSCHUSS = {
  zahllast: "1",
  ueberschuss: "2",
} as const;

type ZahllastUeberschuss = keyof typeof ZAHLLAST_UEBERSCHUSS;
export const ZAHLLAST_UEBERSCHUSS_KEYS = Object.keys(ZAHLLAST_UEBERSCHUSS) as [
  ZahllastUeberschuss,
  ...ZahllastUeberschuss[],
];
