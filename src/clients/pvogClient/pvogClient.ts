import { fetchJson } from "../../helpers/fetchJson";

interface PvogResult {
  ags: string;
  ars: string;
}

// The mapping of AGS/ARS per zip code is static, so we cache it
const cache = new Map<string, PvogResult>();
// Concurrent lookups of the same ZIP can subscribe to the same promise
const inFlight = new Map<string, Promise<PvogResult>>();

export async function getAGSandARS(zipCode: string): Promise<PvogResult> {
  const cached = cache.get(zipCode);
  if (cached) return cached;

  // can't be served from cache:
  // 1) is there a lookup already running => subscribe to the existing promise
  // 2) if not => start the lookup
  return inFlight.get(zipCode) ?? startLookup(zipCode);
}

function startLookup(zipCode: string): Promise<PvogResult> {
  const lookup = fetchAGSandARS(zipCode)
    // on success store in cache and return result
    .then((result) => {
      cache.set(zipCode, result);
      return result;
    })
    // remove from inflight if settled (success or failure)
    // we only keep concurrent lookups
    // next (non-concurrent) requests retries cleanly
    .finally(() => inFlight.delete(zipCode));

  // register before returning, so concurrent callers can subscribe to promise (and not fetch again)
  inFlight.set(zipCode, lookup);
  // first caller awaits the promise, everyone else joins
  return lookup;
}

async function fetchAGSandARS(zipCode: string): Promise<PvogResult> {
  // There is a deprecation note at
  // https://produktportal.pvog.fitko.de/api/suchdienst/get-locations-v-2/
  const url = `https://stage.pvog.fitko.net/suchdienst/api/v2/locations?q=${encodeURIComponent(zipCode)}`;
  const data = await fetchJson<PvogResult[]>(url);
  if (!data[0]) throw new Error(`No location found for zip code ${zipCode}`);
  return data[0];
}
