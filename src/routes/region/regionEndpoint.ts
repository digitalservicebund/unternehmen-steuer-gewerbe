import { HonoAppType } from "../../honoApp";
import { getRegionOfficesDetails } from "./getRegionOfficesDetails";
import { regionRoute } from "./regionRoute";
import { isSupportedRegion } from "./supportedRegions";

export function addRegionEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(regionRoute, async (c) => {
    const plz = c.req.valid("param").plz;
    const { ort, strasse, hausnummer, onlyBestMatch } = c.req.valid("query");

    const supported = isSupportedRegion(Number(plz));
    const { finanzaemter, gewerbeaemter } = await getRegionOfficesDetails(
      { plz, ort, strasse, hausnummer },
      onlyBestMatch,
    );

    return c.json({ supported, finanzaemter, gewerbeaemter }, 200);
  });
  return app;
}
