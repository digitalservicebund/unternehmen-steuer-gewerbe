/** Converts an ISO date "YYYY-MM-DD" to German format "DD.MM.YYYY" */
export function formatDatumDE(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) throw new Error("The given date format is not supported");
  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
}

/** Helper to split street and number "Straße 123" in ["Straße", "123"] */
export function splitStrasseHausnummer(strasseUndHausnummer: string) {
  const match =
    /^(?<strasse>.+?)\s+(?<hausnummerGesamt>\d+(?:\s+\d+)?(?:\/\d+)?(?:\s*[a-zA-Z])?(?:\s*-\s*\d+)?)$/.exec(
      strasseUndHausnummer,
    );
  if (!match?.groups) throw new Error("The given address format is not supported");

  const { strasse, hausnummerGesamt } = match.groups;
  const bisMatch = /^(?<hausnummer>[^-]+?)\s*-\s*(?<hausnummerBis>\d+)$/.exec(hausnummerGesamt!);

  return {
    strasse: strasse?.trimEnd(),
    hausnummer: bisMatch?.groups?.hausnummer ?? hausnummerGesamt,
    hausnummerBis: bisMatch?.groups?.hausnummerBis,
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
  const match = /^(\+\d{1,5})\s(\d{1,5})\s(\d{1,13})(-(\d{1,5}))?$/.exec(telefonnummer);

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
