import { HonoAppType } from "../../honoApp";
import { getRegionDetails } from "./getRegionDetails";
import { regionRoute } from "./regionRoute";
import { isSupportedRegion } from "./supportedRegions";

export function addRegionEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(regionRoute, async (c) => {
    const plz = c.req.valid("param").plz;
    const { ort, strasse, hausnummer, getAllOffices } = c.req.valid("query");

    const { arsList, finanzaemter, gewerbeaemter } = await getRegionDetails(
      { plz, ort, strasse, hausnummer },
      getAllOffices,
    );

    // Only claim support when the address resolves to exactly one Kommune: an ambiguous PLZ can
    // span a neighbouring, unsupported Kommune and we cannot tell which one it belongs to
    const supported = arsList.length === 1 && isSupportedRegion(arsList[0]!);

    return c.json({ supported, finanzaemter, gewerbeaemter }, 200);
  });
  return app;
}
