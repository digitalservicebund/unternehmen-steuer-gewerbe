interface PvogClientResult {
  ags?: string;
  ars?: string;
}

export function getAGSandARS(zipCode: string): PvogClientResult {
  return {
    ags: zipCode,
    ars: zipCode,
  };
}
