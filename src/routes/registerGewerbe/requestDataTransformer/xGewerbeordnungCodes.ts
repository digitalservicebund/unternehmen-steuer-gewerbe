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
// Complete Rechtsformen codelist, version 2.4. The key names are derived from the official
// German designations. We currently only support nichtEingetragenesEinzelunternehmen.
export const RECHTSFORM = {
  rechtsfaehigePersonengesellschaft: "100000",
  personenhandelsgesellschaft: "110000",
  offeneHandelsgesellschaft: "111000",
  offeneHandelsgesellschaftNatuerlichePersonHaftet: "111100",
  kapitalgesellschaftCoOhg: "111200",
  gmbhCoOhgOderUgCoOhg: "111210",
  gmbhCoOhg: "111211",
  ugCoOhg: "111212",
  agCoOhgOderSeCoOhg: "111220",
  agCoOhg: "111221",
  seCoOhg: "111222",
  kgaaCoOhg: "111230",
  limitedCoOhg: "111240",
  genossenschaftCoOhg: "111300",
  egCoOhg: "111310",
  stiftungCoOhg: "111400",
  kommanditgesellschaft: "112000",
  kommanditgesellschaftNatuerlichePersonHaftet: "112100",
  kapitalgesellschaftCoKg: "112200",
  gmbhCoKgOderUgCoKg: "112210",
  gmbhCoKg: "112211",
  ugCoKg: "112212",
  agCoKgOderSeCoKg: "112220",
  agCoKg: "112221",
  seCoKg: "112222",
  kgaaCoKg: "112230",
  limitedCoKg: "112240",
  genossenschaftCoKg: "112300",
  egCoKg: "112310",
  personengesellschaftCoKg: "112400",
  gbrCoKg: "112410",
  stiftungCoKg: "112500",
  investmentkommanditgesellschaft: "112600",
  europaeischeWirtschaftlicheInteressenvereinigung: "113000",
  partenreederei: "114000",
  gesellschaftBuergerlichenRechts: "120000",
  nichtEingetrageneGbr: "121000",
  nichtEingetrageneGbrMitBeschraenkterHaftung: "122000",
  eingetrageneGbr: "123000",
  sonstigeRechtsfaehigePersonengesellschaft: "130000",
  partnerschaftsgesellschaft: "131000",
  auffangtatbestaendePersonengesellschaft: "138000",
  sonstigeRechtsfaehigePersonengesellschaftAuffangtatbestand: "138100",
  ohgOderKgOhneNatuerlichePersonAuffangtatbestandJustiz: "138200",
  auslaendischePersonengesellschaft: "190000",
  auslaendischePersonengesellschaftEuRecht: "191000",
  auslaendischePersonengesellschaftNichtEuRecht: "192000",
  juristischePerson: "200000",
  rechtsfaehigerVerein: "210000",
  eingetragenerVerein: "211000",
  wirtschaftlicherVerein: "212000",
  versicherungsvereinAufGegenseitigkeitOderPensionsfondsverein: "213000",
  versicherungsvereinAufGegenseitigkeit: "213100",
  pensionsfondsvereinAufGegenseitigkeit: "213200",
  altrechtlicherVerein: "214000",
  kapitalgesellschaft: "220000",
  gesellschaftMitBeschraenkterHaftungOderGgmbhOderUg: "221000",
  gesellschaftMitBeschraenkterHaftungOderGgmbh: "221100",
  gesellschaftMitBeschraenkterHaftung: "221110",
  gemeinnuetzigeGesellschaftMitBeschraenkterHaftung: "221120",
  unternehmergesellschaftHaftungsbeschraenkt: "221200",
  aktiengesellschaftOderSeOderInvestmentAg: "222000",
  aktiengesellschaftOhneInvestmentAg: "222110",
  investmentaktiengesellschaft: "222120",
  europaeischeAktiengesellschaft: "222200",
  kommanditgesellschaftAufAktienOderCoKgaa: "223000",
  kommanditgesellschaftAufAktien: "223100",
  kapitalgesellschaftCoKgaa: "223200",
  gmbhCoKgaaOderUgCoKgaa: "223210",
  gmbhCoKgaa: "223211",
  ugCoKgaa: "223212",
  agCoKgaaOderSeCoKgaa: "223220",
  agCoKgaa: "223221",
  seCoKgaa: "223222",
  stiftungCoKgaa: "223400",
  sonstigeKapitalgesellschaft: "224000",
  bergrechtlicheGewerkschaft: "224100",
  kolonialgesellschaft: "224200",
  seerechtlicheGesellschaft: "224300",
  auffangtatbestaendeKapitalgesellschaft: "224800",
  sonstigeKapitalgesellschaftAuffangtatbestandSteuer: "224810",
  rechtsfaehigeStiftung: "230000",
  rechtsfaehigeStiftungDesPrivatrechts: "231000",
  imStiftungsregisterEingetrageneStiftung: "231100",
  eingetrageneStiftungES: "231110",
  eingetrageneStiftungEVS: "231120",
  rechtsfaehigeStiftungDesOeffentlichenRechts: "232000",
  koerperschaftDesOeffentlichenRechts: "240000",
  berufsstaendischeKoerperschaftDesOeffentlichenRechts: "241000",
  gebietskoerperschaft: "242000",
  bund: "242100",
  land: "242200",
  gemeinde: "242300",
  sonstigeGebietskoerperschaft: "242400",
  oeffentlichRechtlicheReligionsgesellschaft: "243000",
  genossenschaft: "250000",
  eingetrageneGenossenschaft: "251000",
  europaeischeGenossenschaft: "252000",
  auffangtatbestaendeGenossenschaft: "258000",
  sonstigeGenossenschaftAuffangtatbestandSteuer: "258100",
  sonstigeJuristischePerson: "260000",
  europaeischerVerbundFuerTerritorialeZusammenarbeit: "261000",
  rechtsfaehigeAnstaltDesOeffentlichenRechts: "262000",
  auffangtatbestaendeJuristischePerson: "268000",
  sonstigeJuristischePersonAuffangtatbestand: "268100",
  sonstigeJuristischePersonDesPrivatrechtsAuffangtatbestandSteuer: "268200",
  sonstigeJuristischePersonDesOeffentlichenRechtsAuffangtatbestandSteuer: "268300",
  sonstigeJuristischePersonHandelsregisterAbteilungAAuffangtatbestandJustiz: "268400",
  auslaendischeJuristischePerson: "290000",
  auslaendischeKoerperschaftDesOeffentlichenRechts: "291000",
  auslaendischeGenossenschaft: "292000",
  auslaendischeKapitalgesellschaft: "293000",
  limitedCompany: "293100",
  auslaendischeJuristischePersonEuRecht: "294000",
  auslaendischeJuristischePersonNichtEuRecht: "295000",
  auffangtatbestaendeAuslaendischeJuristischePerson: "298000",
  sonstigeAuslaendischeJuristischePersonDesPrivatenRechtsAuffangtatbestandSteuer: "298100",
  sonstigePersonenvereinigung: "300000",
  atypischeStilleGesellschaft: "310000",
  unterbeteiligung: "320000",
  gemeinschaft: "330000",
  gesellschaftMitBeschraenkterHaftungInGruendung: "340000",
  unternehmergesellschaftHaftungsbeschraenktInGruendung: "350000",
  nichtrechtsfaehigerVerein: "360000",
  auffangtatbestaendePersonenvereinigung: "380000",
  sonstigePersonenvereinigungAuffangtatbestand: "381000",
  wirtschaftlicheTaetigkeitNatuerlichePerson: "400000",
  gewerblichesEinzelunternehmen: "410000",
  eingetragenesEinzelunternehmen: "411000",
  eingetragenesEinzelunternehmenSitzInland: "411100",
  eingetragenesEinzelunternehmenSitzAusland: "411200",
  nichtEingetragenesEinzelunternehmen: "412000",
  nichtEingetragenesEinzelunternehmenSitzInland: "412100",
  nichtEingetragenesEinzelunternehmenSitzAusland: "412200",
  sonstigeWirtschaftlicheTaetigkeitNatuerlichePerson: "420000",
  freiberufler: "421000",
  landForstwirt: "422000",
  hausgewerbe: "423000",
  beteiligungGewerblichePersonengesellschaft: "424000",
  auffangtatbestaendeWirtschaftlicheTaetigkeitNatuerlichePerson: "428000",
  sonstigeWirtschaftlicheTaetigkeitNatuerlichePersonAuffangtatbestand: "428100",
  auslaendischeWirtschaftlicheTaetigkeitNatuerlichePerson: "490000",
  auslaendischesEinzelunternehmenEuRecht: "491000",
  auslaendischesEinzelunternehmenNichtEuRecht: "492000",
  wirtschaftlicheTaetigkeitNichtNatuerlichePerson: "500000",
  nichtrechtsfaehigeStiftungDesOeffentlichenRechts: "510000",
  nichtrechtsfaehigeStiftungDesPrivatrechts: "520000",
  nichtrechtsfaehigeAnstaltDesOeffentlichenRechts: "530000",
  gewerbebetriebKoerperschaftDesOeffentlichenRechts: "540000",
  sondervermoegen: "550000",
  sonstigesZweckvermoegen: "560000",
  auffangtatbestaendeWirtschaftlicheTaetigkeitNichtNatuerlichePerson: "580000",
  sonstigeWirtschaftlicheTaetigkeitNichtNatuerlichePersonAuffangtatbestand: "581000",
  auslaendischeWirtschaftlicheTaetigkeitNichtNatuerlichePerson: "590000",
  auslaendischeRechtsformZweckvermoegenKStg: "591000",
  auffangtatbestaendeOhneZuordnung: "600000",
  nichtrechtsfaehigerVereinAnstaltStiftungZweckvermoegen: "610000",
  auffangtatbestaendeOhneRechtsformTyp: "680000",
  freitextAuffangtatbestand: "681000",
  freitextAuffangtatbestandJustiz: "682000",
  ersatzwertAuffangtatbestandSteuer: "683000",
  sonstigeNichtNatuerlicheRechtsformAuffangtatbestandSteuer: "683100",
  auslaendischeRechtsform: "690000",
  auslaendischeRechtsformPersonenvereinigungVermoegensmasseKStg: "691000",
  rechtsformAuslaendischenRechtsJustizregister: "692000",
  rechtsformAuslaendischenRechtsGnr: "692100",
  rechtsformAuslaendischenRechtsGsr: "692200",
  rechtsformAuslaendischenRechtsHr: "692300",
  rechtsformAuslaendischenRechtsHra: "692310",
  rechtsformAuslaendischenRechtsHrb: "692320",
  rechtsformAuslaendischenRechtsPr: "692400",
  auffangtatbestaendeAuslaendischeRechtsform: "698000",
  sonstigeAuslaendischeRechtsformAuffangtatbestandSteuer: "698100",
} as const;

// https://www.xrepository.de/details/urn:xoev-de:xgewerbeordnung:codeliste:grundfueranmeldung_3
export const GRUNDANMELDUNGSSCHLUESSEL = {
  neugründung: "01",
  verlegungAusAnderemMeldebezirk: "02",
  übergangNachUmwandlungsgesetz: "03",
  wechselDerRechtsform: "04",
  gesellschaftereintritt: "05",
  übernahme: "06",
} as const;

// https://www.xrepository.de/details/urn:xoev-de:xunternehmen:codeliste:artniederlassung_1
// SCH-0256 only allows 01, 02 and 03 from 2024-05-01 on.
export const ART_BETRIEBSSTAETTE = {
  hauptniederlassung: "01",
  zweigniederlassung: "02",
  unselbstaendigeZweigstelle: "03",
  betriebsstaetteUnspezifisch: "04",
} as const;

// https://www.xrepository.de/details/urn:xoev-de:xgewerbeordnung:codeliste:beteiligungoeffentlichehand_1
export const BETEILIGUNG_OEFFENTLICHE_HAND = {
  nein: "0",
  ja: "1",
  nichtBekannt: "2",
} as const;

// https://www.xrepository.de/details/urn:xoev-de:xinneres:codeliste:geschlecht_1
export const GESCHLECHT = {
  männlich: "m",
  weiblich: "w",
  divers: "d",
  keineAngabe: "x",
} as const;
type Geschlecht = keyof typeof GESCHLECHT;
export const GESCHLECHT_KEYS = Object.keys(GESCHLECHT) as [Geschlecht, ...Geschlecht[]];

// https://www.xrepository.de/details/urn:de:bund:destatis:bevoelkerungsstatistik:schluessel:staatsangehoerigkeit_2024-08-01
export const STAATSANGEHOERIGKEIT = {
  afghanisch: "423",
  ägyptisch: "287",
  albanisch: "121",
  algerisch: "221",
  andorranisch: "123",
  angolanisch: "223",
  antiguanisch: "320",
  äquatorialguineisch: "274",
  argentinisch: "323",
  armenisch: "422",
  aserbaidschanisch: "425",
  äthiopisch: "225",
  australisch: "523",
  bahamaisch: "324",
  bahrainisch: "424",
  bangladeschisch: "460",
  barbadisch: "322",
  belarussisch: "169",
  belgisch: "124",
  belizisch: "330",
  beninisch: "229",
  bhutanisch: "426",
  bolivianisch: "326",
  bosnischHerzegowinisch: "122",
  botsuanisch: "227",
  brasilianisch: "327",
  britischBOTC: "185", // Britische Überseegebiete
  bruneiisch: "429",
  bulgarisch: "125",
  burkinisch: "258",
  burundisch: "291",
  caboVerdisch: "242",
  chilenisch: "332",
  chinesisch: "479",
  costaRicanisch: "334",
  ivorisch: "231",
  dänisch: "126",
  deutsch: "000",
  dominicanisch: "333",
  dominikanisch: "335",
  dschibutisch: "230",
  ecuadorianisch: "336",
  salvadorianisch: "337",
  eritreisch: "224",
  estnisch: "127",
  eswatinisch: "281",
  fidschianisch: "526",
  finnisch: "128",
  französisch: "129",
  // fürInterneZweckeVerwendet: "910",
  gabunisch: "236",
  gambisch: "237",
  georgisch: "430",
  ghanaisch: "238",
  grenadisch: "340",
  griechisch: "134",
  guatemaltekisch: "345",
  guineisch: "261",
  guineaBissauisch: "259",
  guyanisch: "328",
  haitianisch: "346",
  honduranisch: "347",
  chinesischHongkong: "411",
  indisch: "436",
  indonesisch: "437",
  irakisch: "438",
  iranisch: "439",
  irisch: "135",
  isländisch: "136",
  israelisch: "441",
  italienisch: "137",
  jamaikanisch: "355",
  japanisch: "442",
  jemenitisch: "421",
  jordanisch: "445",
  jugoslawisch: "120",
  jugoslawischBundesrepublik: "138",
  kambodschanisch: "446",
  kamerunisch: "262",
  kanadisch: "348",
  kasachisch: "444",
  katarisch: "447",
  kenianisch: "243",
  kirgisisch: "450",
  kiribatisch: "530",
  kolumbianisch: "349",
  komorisch: "244",
  kongolesisch: "245",
  derDemokratischenRepublikKongo: "246",
  derDemokratischenVolksrepublikKorea: "434",
  derRepublikKorea: "467",
  kosovarisch: "150",
  kroatisch: "130",
  kubanisch: "351",
  kuwaitisch: "448",
  laotisch: "449",
  lesothisch: "226",
  lettisch: "139",
  libanesisch: "451",
  liberianisch: "247",
  libysch: "248",
  liechtensteinisch: "141",
  litauisch: "142",
  luxemburgisch: "143",
  chinesischMacau: "412",
  madagassisch: "249",
  malawisch: "256",
  malaysisch: "482",
  maledivisch: "454",
  malisch: "251",
  maltesisch: "145",
  marokkanisch: "252",
  marshallisch: "544",
  mauretanisch: "239",
  mauritisch: "253",
  mexikanisch: "353",
  mikronesisch: "545",
  moldauisch: "146",
  monegassisch: "147",
  mongolisch: "457",
  montenegrinisch: "140",
  mosambikanisch: "254",
  myanmarisch: "427",
  namibisch: "267",
  nauruisch: "531",
  nepalesisch: "458",
  neuseeländisch: "536",
  nicaraguanisch: "354",
  niederländisch: "148",
  nigrisch: "255",
  nigerianisch: "232",
  mazedonisch: "144",
  norwegisch: "149",
  ohneAngabe: "999",
  omanisch: "456",
  österreichisch: "151",
  pakistanisch: "461",
  ohneBezeichnung: "459",
  palauisch: "537",
  panamaisch: "357",
  papuaNeuguineisch: "538",
  paraguayisch: "359",
  peruanisch: "361",
  philippinisch: "462",
  polnisch: "152",
  portugiesisch: "153",
  ruandisch: "265",
  rumänisch: "154",
  russisch: "160",
  salomonisch: "524",
  sambisch: "257",
  samoanisch: "543",
  sanMarinesisch: "156",
  sãoToméisch: "268",
  saudiArabisch: "472",
  schwedisch: "157",
  schweizerisch: "158",
  senegalesisch: "269",
  serbisch: "170",
  serbischKosovo: "133",
  vonSerbienUndMontenegro: "132",
  seychellisch: "271",
  sierraLeonisch: "272",
  simbabwisch: "233",
  singapurisch: "474",
  slowakisch: "155",
  slowenisch: "131",
  somalisch: "273",
  sowjetisch: "159",
  spanisch: "161",
  sriLankisch: "431",
  vonStKittsUndNevis: "370",
  lucianisch: "366",
  vincentisch: "369",
  staatenlos: "997",
  südafrikanisch: "263",
  sudanesisch: "277",
  sudanesischSüdsudan: "276",
  südsudanesisch: "278",
  surinamisch: "364",
  syrisch: "475",
  tadschikisch: "470",
  taiwanisch: "465",
  tansanisch: "282",
  thailändisch: "476",
  vonTimorLeste: "483",
  togoisch: "283",
  tongaisch: "541",
  vonTrinidadUndTobago: "371",
  tschadisch: "284",
  tschechisch: "164",
  tschechoslowakisch: "162",
  tunesisch: "285",
  türkisch: "163",
  turkmenisch: "471",
  tuvaluisch: "540",
  ugandisch: "286",
  ukrainisch: "166",
  ungarisch: "165",
  ungeklärt: "998",
  uruguayisch: "365",
  usbekisch: "477",
  vanuatuisch: "532",
  vatikanisch: "167",
  venezolanisch: "367",
  derVereinigtenArabischenEmirate: "469",
  amerikanisch: "368",
  britisch: "168",
  vietnamesisch: "432",
  zentralafrikanisch: "289",
  zyprisch: "181",
} as const;

type Staatsangehoerigkeit = keyof typeof STAATSANGEHOERIGKEIT;
export const STAATSANGEHOERIGKEIT_KEYS = Object.keys(STAATSANGEHOERIGKEIT) as [
  Staatsangehoerigkeit,
  ...Staatsangehoerigkeit[],
];

// ICAO Doc 9303 nationality code -> DESTATIS Staatsangehörigkeit code.
// ICAO takes its three-letter codes from ISO 3166-1, so the "ISO-3" column of the DESTATIS code list
// yields the mapping directly; where DESTATIS lists one ISO-3 code
// twice, the currently existing state wins (SRB, SDN), among historic ones the later (YUG), see
// https://www.xrepository.de/api/xrepository/urn:de:bund:destatis:bevoelkerungsstatistik:schluessel:staatsangehoerigkeit_2024-08-01/download/DESTATIS_Staatsangeh_rigkeit_2024-08-01.md
// The exceptions ICAO defines on top of ISO 3166-1 are added below the generated block, see Doc 9303
// Part 3 (8th ed. 2021) section 5 "Codes for Nationality, Place of Birth, Location of Issuing
// State/Authority and Other Purposes":
// https://www.icao.int/sites/default/files/publications/DocSeries/9303_p3_cons_en.pdf
export const STAATSANGEHOERIGKEIT_ICAO = {
  AFG: "423", // Afghanistan
  AGO: "223", // Angola
  ALB: "121", // Albanien
  AND: "123", // Andorra
  ARE: "469", // Vereinigte Arabische Emirate
  ARG: "323", // Argentinien
  ARM: "422", // Armenien
  ATG: "320", // Antigua und Barbuda
  AUS: "523", // Australien
  AUT: "151", // Österreich
  AZE: "425", // Aserbaidschan
  BDI: "291", // Burundi
  BEL: "124", // Belgien
  BEN: "229", // Benin
  BFA: "258", // Burkina Faso
  BGD: "460", // Bangladesch
  BGR: "125", // Bulgarien
  BHR: "424", // Bahrain
  BHS: "324", // Bahamas
  BIH: "122", // Bosnien und Herzegowina
  BLR: "169", // Belarus
  BLZ: "330", // Belize
  BOL: "326", // Plurinationaler Staat Bolivien
  BRA: "327", // Brasilien
  BRB: "322", // Barbados
  BRN: "429", // Brunei Darussalam
  BTN: "426", // Bhutan
  BWA: "227", // Botsuana
  CAF: "289", // Zentralafrikanische Republik
  CAN: "348", // Kanada
  CHE: "158", // Schweiz
  CHL: "332", // Chile
  CHN: "479", // China
  CIV: "231", // Côte d’Ivoire
  CMR: "262", // Kamerun
  COD: "246", // Demokratische Republik Kongo
  COG: "245", // Kongo
  COL: "349", // Kolumbien
  COM: "244", // Komoren
  CPV: "242", // Cabo Verde
  CRI: "334", // Costa Rica
  CSK: "162", // Tschechoslowakei (bis 1992-12-31)
  CUB: "351", // Kuba
  CYP: "181", // Zypern
  CZE: "164", // Tschechien
  DEU: "000", // Deutschland
  DJI: "230", // Dschibuti
  DMA: "333", // Dominica
  DNK: "126", // Dänemark
  DOM: "335", // Dominikanische Republik
  DZA: "221", // Algerien
  ECU: "336", // Ecuador
  EGY: "287", // Ägypten
  ERI: "224", // Eritrea
  ESP: "161", // Spanien
  EST: "127", // Estland
  ETH: "225", // Äthiopien
  FIN: "128", // Finnland
  FJI: "526", // Fidschi
  FRA: "129", // Frankreich
  FSM: "545", // Föderierte Staaten von Mikronesien
  GAB: "236", // Gabun
  GBR: "168", // Vereinigtes Königreich
  GEO: "430", // Georgien
  GHA: "238", // Ghana
  GIN: "261", // Guinea
  GMB: "237", // Gambia
  GNB: "259", // Guinea-Bissau
  GNQ: "274", // Äquatorialguinea
  GRC: "134", // Griechenland
  GRD: "340", // Grenada
  GTM: "345", // Guatemala
  GUY: "328", // Guyana
  HKG: "411", // Hongkong
  HND: "347", // Honduras
  HRV: "130", // Kroatien
  HTI: "346", // Haiti
  HUN: "165", // Ungarn
  IDN: "437", // Indonesien
  IND: "436", // Indien
  IRL: "135", // Irland
  IRN: "439", // Islamische Republik Iran
  IRQ: "438", // Irak
  ISL: "136", // Island
  ISR: "441", // Israel
  ITA: "137", // Italien
  JAM: "355", // Jamaika
  JOR: "445", // Jordanien
  JPN: "442", // Japan
  KAZ: "444", // Kasachstan
  KEN: "243", // Kenia
  KGZ: "450", // Kirgisistan
  KHM: "446", // Kambodscha
  KIR: "530", // Kiribati
  KNA: "370", // St. Kitts und Nevis
  KOR: "467", // Republik Korea
  KWT: "448", // Kuwait
  LAO: "449", // Demokratische Volksrepublik Laos
  LBN: "451", // Libanon
  LBR: "247", // Liberia
  LBY: "248", // Libyen
  LCA: "366", // St. Lucia
  LIE: "141", // Liechtenstein
  LKA: "431", // Sri Lanka
  LSO: "226", // Lesotho
  LTU: "142", // Litauen
  LUX: "143", // Luxemburg
  LVA: "139", // Lettland
  MAC: "412", // Macau
  MAR: "252", // Marokko
  MCO: "147", // Monaco
  MDA: "146", // Republik Moldau
  MDG: "249", // Madagaskar
  MDV: "454", // Malediven
  MEX: "353", // Mexiko
  MHL: "544", // Marshallinseln
  MKD: "144", // Nordmazedonien
  MLI: "251", // Mali
  MLT: "145", // Malta
  MMR: "427", // Myanmar
  MNE: "140", // Montenegro
  MNG: "457", // Mongolei
  MOZ: "254", // Mosambik
  MRT: "239", // Mauretanien
  MUS: "253", // Mauritius
  MWI: "256", // Malawi
  MYS: "482", // Malaysia
  NAM: "267", // Namibia
  NER: "255", // Niger
  NGA: "232", // Nigeria
  NIC: "354", // Nicaragua
  NLD: "148", // Königreich der Niederlande
  NOR: "149", // Norwegen
  NPL: "458", // Nepal
  NRU: "531", // Nauru
  NZL: "536", // Neuseeland
  OMN: "456", // Oman
  PAK: "461", // Pakistan
  PAN: "357", // Panama
  PER: "361", // Peru
  PHL: "462", // Philippinen
  PLW: "537", // Palau
  PNG: "538", // Papua-Neuguinea
  POL: "152", // Polen
  PRK: "434", // Demokratische Volksrepublik Korea
  PRT: "153", // Portugal
  PRY: "359", // Paraguay
  QAT: "447", // Katar
  ROU: "154", // Rumänien
  RUS: "160", // Russische Föderation
  RWA: "265", // Ruanda
  SAU: "472", // Saudi-Arabien
  SCG: "132", // Serbien und Montenegro (bis 2006-06-02)
  SDN: "277", // Sudan
  SEN: "269", // Senegal
  SGP: "474", // Singapur
  SLB: "524", // Salomonen
  SLE: "272", // Sierra Leone
  SLV: "337", // El Salvador
  SMR: "156", // San Marino
  SOM: "273", // Somalia
  SRB: "170", // Serbien
  SSD: "278", // Südsudan
  STP: "268", // São Tomé und Príncipe
  SUN: "159", // Sowjetunion (bis 1991-12-25)
  SUR: "364", // Suriname
  SVK: "155", // Slowakei
  SVN: "131", // Slowenien
  SWE: "157", // Schweden
  SWZ: "281", // Eswatini
  SYC: "271", // Seychellen
  SYR: "475", // Arabische Republik Syrien
  TCD: "284", // Tschad
  TGO: "283", // Togo
  THA: "476", // Thailand
  TJK: "470", // Tadschikistan
  TKM: "471", // Turkmenistan
  TLS: "483", // Timor-Leste
  TON: "541", // Tonga
  TTO: "371", // Trinidad und Tobago
  TUN: "285", // Tunesien
  TUR: "163", // Türkei
  TUV: "540", // Tuvalu
  TWN: "465", // Taiwan
  TZA: "282", // Vereinigte Republik Tansania
  UGA: "286", // Uganda
  UKR: "166", // Ukraine
  URY: "365", // Uruguay
  USA: "368", // Vereinigte Staaten
  UZB: "477", // Usbekistan
  VAT: "167", // Vatikanstadt
  VCT: "369", // St. Vincent und die Grenadinen
  VEN: "367", // Bolivarische Republik Venezuela
  VNM: "432", // Vietnam
  VUT: "532", // Vanuatu
  WSM: "543", // Samoa
  XXA: "997", // staatenlos
  XXK: "150", // Kosovo
  YEM: "421", // Jemen
  YUG: "138", // Bundesrepublik Jugoslawien (bis 2003-02-04)
  ZAF: "263", // Südafrika
  ZMB: "257", // Sambia
  ZWE: "233", // Simbabwe
  // Section 5 Part A: codes that deviate from ISO 3166-1
  D: "000", // Deutschland — ICAO uses "D", DEU above is the ISO alias
  GBD: "185", // British Overseas Territories Citizen -> Britische Überseegebiete
  GBN: "168", // British National (Overseas) — DESTATIS only knows "britisch"
  GBO: "168", // British Overseas Citizen
  GBP: "168", // British Protected Person
  GBS: "168", // British Subject
  RKS: "150", // Kosovo — ICAO uses RKS, XXK above is the ISO user-assigned alias
  // Section 5 Part E: persons without a defined nationality (XXA is in the generated block above)
  XXB: "998", // Refugee per 1951 Convention -> ungeklärt
  XXC: "998", // Refugee other than XXB -> ungeklärt
  XXX: "999", // Person of unspecified nationality -> ohne Angabe
  // Plain ISO 3166-1 code that the DESTATIS list carries without an ISO column entry
  PSE: "459", // Palästinensische Gebiete
} as const;

type StaatsangehoerigkeitIcao = keyof typeof STAATSANGEHOERIGKEIT_ICAO;
export const STAATSANGEHOERIGKEIT_ICAO_KEYS = Object.keys(STAATSANGEHOERIGKEIT_ICAO) as [
  StaatsangehoerigkeitIcao,
  ...StaatsangehoerigkeitIcao[],
];

// Amtlicher Gemeindeschlüssel (AGS) of Hamburg
export const HAMBURG_GEMEINDESCHLUESSEL = "02000000";
// Hamburg district (Stadtbezirke) Postleitzahlen, grouped by Gemeindeschlüssel-Ergänzung Codes
// see https://www.xrepository.de/details/urn:xoev-de:xgewerbeordnung:codeliste:gemeindeschluesselergaenzung_1
export const HAMBURG_STADTBEZIRK_PLZ: Record<string, readonly string[]> = {
  // Hamburg-Mitte
  "02100000": [
    "20095",
    "20097",
    "20099",
    "20354",
    "20355",
    "20357",
    "20359",
    "20457",
    "20459",
    "20535",
    "20537",
    "20539",
    "21107",
    "21109",
    "21129",
    "22087",
    "22089",
    "22111",
    "22115",
    "22117",
    "22119",
    "22767",
    "22769",
    "27499", // Neuwerk
  ],
  // Altona
  "02200000": [
    "20257",
    "22525",
    "22547",
    "22549",
    "22559",
    "22587",
    "22589",
    "22605",
    "22607",
    "22609",
    "22761",
    "22763",
    "22765",
  ],
  // Eimsbüttel
  "02300000": [
    "20144",
    "20146",
    "20148",
    "20149",
    "20249",
    "20253",
    "20255",
    "20259",
    "22453",
    "22455",
    "22457",
    "22459",
    "22523",
    "22527",
    "22529",
  ],
  // Hamburg-Nord
  "02400000": [
    "20251",
    "22049",
    "22081",
    "22083",
    "22085",
    "22297",
    "22299",
    "22301",
    "22303",
    "22305",
    "22307",
    "22309",
    "22335",
    "22337",
    "22339",
    "22391",
    "22415",
    "22417",
    "22419",
  ],
  // Wandsbek
  "02500000": [
    "22041",
    "22043",
    "22045",
    "22047",
    "22143",
    "22145",
    "22147",
    "22149",
    "22159",
    "22175",
    "22177",
    "22179",
    "22359",
    "22393",
    "22395",
    "22397",
    "22399",
  ],
  // Bergedorf
  "02600000": ["21029", "21031", "21033", "21035", "21037", "21039", "22113"],
  // Harburg
  "02700000": ["21073", "21075", "21077", "21079", "21147", "21149"],
};
