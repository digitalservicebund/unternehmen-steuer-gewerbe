import axios from "axios";

interface PvogResult {
  ags?: string;
  ars?: string;
}

export async function getAGSandARS(zipCode: string): Promise<PvogResult> {
  // https://produktportal.pvog.fitko.de/api/suchdienst/get-locations-v-2/
  const url = `https://stage.pvog.fitko.net/suchdienst/api/v2/locations?q=${encodeURIComponent(zipCode)}`;
  const { data } = await axios.get<PvogResult[]>(url);
  if (!data[0]) throw new Error(`No location found for zip code ${zipCode}`);
  return data[0];
}
