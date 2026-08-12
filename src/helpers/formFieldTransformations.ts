/** Converts an ISO date "YYYY-MM-DD" to German format "DD.MM.YYYY" */
export function formatDatumDE(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) throw new Error("The given date format is not supported");
  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
}

/** Helper to split street and number "Straße 123" in ["Straße", "123"] */

interface SplitStrasseHausnummer {
  strasse?: string;
  hausnummer?: string;
  hausnummerBis?: string;
  hausnummerZusatz?: string;
}

export function splitStrasseHausnummer(strasseUndHausnummer: string): SplitStrasseHausnummer {
  const upToSixNumbers = String.raw`\d{1,6}`;
  // Zusatz allows whitespace around the slash, up to three letters after it and a trailing dot.
  // The letters are capped because XGewerbe puts Hausnummer + Zusatz into hausnummerVon (max 10).
  const zusatzPattern = String.raw`(?:\s+${upToSixNumbers})?(?:\s*/\s*(?:${upToSixNumbers}|[a-z]{1,3}))?(?:\s*[a-z]\.?)?`;
  const addressPattern = new RegExp(
    String.raw`^(?<strasse>.{1,100}?)\s+(?<hausnummer>${upToSixNumbers})(?<hausnummerZusatz>${zusatzPattern})(?:\s*-\s*(?<hausnummerBis>${upToSixNumbers}(?:\s*[a-z])?))?$`,
    "i",
  );

  const match = addressPattern.exec(strasseUndHausnummer);
  if (!match?.groups) throw new Error("The given address format is not supported");

  const { strasse, hausnummer, hausnummerBis, hausnummerZusatz } = match.groups;

  return {
    strasse,
    hausnummer,
    hausnummerBis,
    hausnummerZusatz: hausnummerZusatz === "" ? undefined : hausnummerZusatz,
  };
}

interface SplitHausnummer {
  hausnummer?: string;
  hausnummerBis?: string;
  hausnummerZusatz?: string;
}

/**
 * Splits a house number into von and bis at "-" or "/" ("8-14", "8/14") and separates a trailing
 * Zusatz ("42a"). Only the von part is broken down, the bis part is passed through as given.
 */
export function splitHausnummer(hausnummer: string): SplitHausnummer {
  const rangeMatch = /^(?<von>[^-/]*)(?:[-/](?<bis>.*))?$/.exec(hausnummer);
  const von = rangeMatch?.groups?.von?.trim() ?? "";
  const bis = rangeMatch?.groups?.bis?.trim();
  const vonMatch = /^(?<nummer>\d+)(?<zusatz>\D.*)?$/.exec(von);

  return {
    hausnummer: (vonMatch?.groups?.nummer ?? von) || undefined,
    hausnummerBis: bis || undefined,
    hausnummerZusatz: vonMatch?.groups?.zusatz?.trim() || undefined,
  };
}

/** Joins street and house number into "Straße 123", omitting missing parts */
export function joinStrasseUndHausnummer(
  strasse?: string,
  hausnummer?: string,
): string | undefined {
  const presentParts = [strasse, hausnummer].filter(
    (part) => part !== undefined && part.trim() !== "",
  );
  return presentParts.length === 0 ? undefined : presentParts.join(" ");
}

/** Address with street and house number in one string */
export interface Adresse {
  strasseUndHausnummer: string;
  postleitzahl: string;
  ort: string;
}

/** Address with street and house number as separate fields */
export interface BetriebsAdresse {
  strasse: string;
  hausnummer: string;
  postleitzahl: string;
  ort: string;
}

/** Resolved business address, house number already split into von, bis and Zusatz */
export interface SplitAdresse {
  strasse?: string;
  hausnummer?: string;
  hausnummerBis?: string;
  hausnummerZusatz?: string;
  postleitzahl: string;
  ort: string;
}

interface BetriebsAdresseInput {
  adresse?: BetriebsAdresse;
  /** Deprecated, only read while `adresse` is optional */
  adresseAbweichend?: Adresse;
  persönlicheAdresse: Adresse;
}

/**
 * Resolves the address of the business: `adresse` wins, then the deprecated `adresseAbweichend`,
 * then the persönliche Adresse.
 */
export function getBetriebsAdresse({
  adresse,
  adresseAbweichend,
  persönlicheAdresse,
}: BetriebsAdresseInput): SplitAdresse {
  if (adresse === undefined) {
    // TODO: stop reading adresseAbweichend once the deprecated field is removed
    const kombinierteAdresse = adresseAbweichend ?? persönlicheAdresse;
    return {
      ...splitStrasseHausnummer(kombinierteAdresse.strasseUndHausnummer),
      postleitzahl: kombinierteAdresse.postleitzahl,
      ort: kombinierteAdresse.ort,
    };
  }

  return {
    strasse: adresse.strasse,
    ...splitHausnummer(adresse.hausnummer),
    postleitzahl: adresse.postleitzahl,
    ort: adresse.ort,
  };
}

export function splitTelefonnummer(telefonnummer: string) {
  const match =
    /^(?<intVorw>\+\d{1,5})\s(?<natVorw>\d{1,5})\s(?<rufNr>\d{1,13})(?:-(?<durchwahl>\d{1,5}))?$/.exec(
      telefonnummer,
    );

  if (!match?.groups) {
    throw new Error("The given Phone number format is not supported");
  }

  const { intVorw, natVorw, rufNr, durchwahl } = match.groups;

  return {
    intVorw: intVorw?.trimEnd(),
    natVorw: natVorw?.trimEnd(),
    rufNr: rufNr?.trimEnd(),
    durchwahl: durchwahl?.trimEnd(),
  };
}
