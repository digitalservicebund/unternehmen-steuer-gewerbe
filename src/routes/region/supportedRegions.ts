interface PLZRange {
  from: string;
  to: string;
}

// There is no good single source of truth, unfortunately. When adding new supported regions, a
// good starting point is Wikipedia to get the Postleitzahlen (ranges) and then verify them one by
// one against other sources from the cities/regions themselves
const SUPPORTED_REGIONS = {
  aachen: [rangeOfPLZs("52062", "52080")],
  dresden: [rangeOfPLZs("01067", "01328"), "01465"],
  fulda: [rangeOfPLZs("36037", "36043")],
  münchen: [rangeOfPLZs("80331", "81929")],
  nordfriesland: [rangeOfPLZs("25811", "25999")],
  düsseldorf: [rangeOfPLZs("40210", "40629")],
  goslar: ["38640", "38642", "38644", "38690"],
  hamburg: [rangeOfPLZs("20095", "21149"), rangeOfPLZs("22041", "22769"), "27499"],
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
