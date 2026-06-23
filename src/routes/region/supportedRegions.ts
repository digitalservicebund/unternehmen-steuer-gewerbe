interface PLZRange {
  from: string;
  to: string;
}

const SUPPORTED_REGIONS = {
  aachen: [rangeOfPLZs("52062", "52080")],
  dresden: [rangeOfPLZs("01067", "01328"), "01465"],
  fulda: [rangeOfPLZs("36037", "36043")],
  muenchen: [rangeOfPLZs("80331", "81929")],
  nordfriesland: [rangeOfPLZs("25811", "25999")],
  duesseldorf: [rangeOfPLZs("40210", "40629")],
  goslar: ["38640", "38642", "38644", "38690"],
  // Helgoland ("27499") belongs to Hamburg, but there is no gemeindeschluesselErgaenzung
  // for it. Founding there is therefore not possible, because no valid
  // xGewO XML can be generated (the rule SCH-0189 would fail)
  hamburg: [
    rangeOfPLZs("20095", "21149"),
    rangeOfPLZs("22041", "22769"),
    // "27499"
  ],
  mannheim: [rangeOfPLZs("68159", "68309")],
} as const satisfies Record<string, ReadonlyArray<string | PLZRange>>;

function rangeOfPLZs(from: string, to: string): PLZRange {
  return { from, to };
}

export function isSupportedRegion(plz: number): boolean {
  const allSupportedPlzEntries = Object.values(SUPPORTED_REGIONS).flat();

  return allSupportedPlzEntries.some((entry) => {
    const isSinglePLZ = typeof entry === "string";
    if (isSinglePLZ) {
      return plz === Number(entry);
    }
    return plz >= Number(entry.from) && plz <= Number(entry.to);
  });
}
