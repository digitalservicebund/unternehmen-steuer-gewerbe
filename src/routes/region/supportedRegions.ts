interface PLZRange {
  from: string;
  to: string;
  step: number;
}

// There is no good single source of truth, unfortunately. When adding new supported regions, a
// good starting point is Wikipedia to get the Postleitzahlen (ranges) and then verify them one by
// one against other sources from the cities/regions themselves
const SUPPORTED_REGIONS = {
  aachen: [rangeOfPLZs("52062", "52080")],
  dresden: [rangeOfPLZs("01067", "01328"), "01465"],
  fulda: [rangeOfPLZs("36037", "36043")],
  muenchen: [rangeOfPLZs("80331", "81929")],
  nordfriesland: [rangeOfPLZs("25811", "25999")],
  // https://www.dasoertliche.de/?st=&ci=D%C3%BCsseldorf&form_name=search_pc
  duesseldorf: [
    rangeOfPLZs("40210", "40213"),
    rangeOfPLZs("40215", "40239", 2),
    "40468",
    rangeOfPLZs("40470", "40474", 2),
    rangeOfPLZs("40476", "40477"),
    "40479",
    "40489",
    "40545",
    rangeOfPLZs("40547", "40549", 2),
    "40589",
    rangeOfPLZs("40591", "40599", 2),
    "40625",
    rangeOfPLZs("40627", "40629", 2),
  ],
  goslar: ["38640", "38642", "38644", "38690"],
  hamburg: [rangeOfPLZs("20095", "21149"), rangeOfPLZs("22041", "22769"), "27499"],
  mannheim: [rangeOfPLZs("68159", "68309")],
} as const satisfies Record<string, ReadonlyArray<string | PLZRange>>;

export function rangeOfPLZs(from: string, to: string, step = 1): PLZRange {
  return { from, to, step };
}

export function isSupportedRegion(plz: number): boolean {
  const allSupportedPlzEntries = Object.values(SUPPORTED_REGIONS).flat();

  return allSupportedPlzEntries.some((entry) => {
    const isSinglePLZ = typeof entry === "string";
    if (isSinglePLZ) {
      return plz === Number(entry);
    }
    const from = Number(entry.from);
    const to = Number(entry.to);
    return plz >= from && plz <= to && (plz - from) % entry.step === 0;
  });
}
