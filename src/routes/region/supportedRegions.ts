type RangeOfPLZs = [string, string];

const SUPPORTED_REGIONS = {
  aachen: [["52062", "52080"]],
  dresden: [["01067", "01328"], "01465"],
  fulda: [["36037", "36043"]],
  muenchen: [["80331", "81929"]],
  nordfriesland: [["25811", "25999"]],
  duesseldorf: [["40210", "40629"]],
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
    ["20144", "20259"],
    "21029",
    ["21031", "21039"],
    ["21073", "21079"],
    "21107",
    "21109",
    "21129",
    "21147",
    "21149",
    ["22041", "22179"],
    ["22297", "22459"],
    ["22523", "22769"],
    "27499",
  ],
  mannheim: [["68159", "68309"]],
} as const satisfies Record<string, ReadonlyArray<string | RangeOfPLZs>>;

export function isSupportedRegion(plz: number): boolean {
  const allSupportedPlzEntries = Object.values(SUPPORTED_REGIONS).flat();

  return allSupportedPlzEntries.some((entry) => {
    const isRangeOfPLZs = Array.isArray(entry);
    if (isRangeOfPLZs) {
      return plz >= Number(entry[0]) && plz <= Number(entry[1]);
    }
    return plz === Number(entry);
  });
}
