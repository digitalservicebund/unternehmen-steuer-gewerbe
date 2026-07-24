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
  const zusatzPattern = String.raw`(?:\s+${upToSixNumbers})?(?:/${upToSixNumbers})?(?:\s*[a-z])?`;
  const addressPattern = new RegExp(
    String.raw`^(?<strasse>.{1,100}?)\s+(?<hausnummer>${upToSixNumbers})(?<hausnummerZusatz>${zusatzPattern})(?:\s*-\s*(?<hausnummerBis>${upToSixNumbers}))?$`,
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

export function splitTelefonnummer(telefonnummer: string) {
  const match =
    /^(?<intVorw>\+\d{1,5})\s(?<natVorw>\d{1,5})\s(?<rufNr>\d{2,13})(?:-(?<durchwahl>\d{1,5}))?$/.exec(
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
