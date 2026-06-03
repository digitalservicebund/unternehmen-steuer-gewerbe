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
  hamburg: [
    "20095",
    "20097",
    "20099",
    "20354",
    "20355",
    "20359",
    "20457",
    "20459",
    rangeOfPLZs("20144", "20259"),
    "21029",
    rangeOfPLZs("21031", "21039"),
    rangeOfPLZs("21073", "21079"),
    "21107",
    "21109",
    "21129",
    "21147",
    "21149",
    rangeOfPLZs("22041", "22179"),
    rangeOfPLZs("22297", "22459"),
    rangeOfPLZs("22523", "22769"),
    "27499",
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
