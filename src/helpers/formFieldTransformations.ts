/** Converts an ISO date "YYYY-MM-DD" to German format "DD.MM.YYYY" */
export function formatDatumDE(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) throw new Error("The given date format is not supported");
  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
}

/** Helper to split street and number "Straße 123" in ["Straße", "123"] */
export function splitStrasseHausnummer(strasseUndHausnummer: string) {
  const match = /^(.+?)\s+(\d+(?:\s+\d+)?(?:\/\d+)?(?:\s*[a-zA-Z])?)\s*(?:-\s*(\d+))?$/.exec(
    strasseUndHausnummer,
  );
  if (!match) throw new Error("The given address format is not supported");
  return {
    strasse: match?.[1]?.trimEnd(),
    hausnummer: match?.[2],
    hausnummerBis: match?.[3],
  };
}

/** Joins street and house number into "Straße 123", omitting missing parts */
export function joinStrasseUndHausnummer(
  strasse?: string,
  hausnummer?: string,
): string | undefined {
  return [strasse, hausnummer].filter(Boolean).join(" ") || undefined;
}

export function splitTelefonnummer(telefonnummer: string) {
  const match = /^(\+[0-9]{1,5})\s([0-9]{1,5})\s([0-9]{1,13})(-([0-9]{1,5}))?$/.exec(telefonnummer);

  if (!match) {
    throw new Error("The given Phone number format is not supported");
  }

  return {
    intVorw: match?.[1]?.trimEnd(),
    natVorw: match?.[2]?.trimEnd(),
    rufNr: match?.[3]?.trimEnd(),
    durchwahl: match?.[5]?.trimEnd(),
  };
}
