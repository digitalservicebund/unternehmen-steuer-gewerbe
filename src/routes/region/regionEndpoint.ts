import { HonoAppType } from "../../honoApp";
import { regionRoute } from "./regionRoute";
import { isSupportedRegion } from "./supportedRegions";

export function addRegionEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(regionRoute, (c) => {
    const plz = Number(c.req.valid("param").plz);
    return c.json({ supported: isSupportedRegion(plz) }, 200);
  });
  return app;
}
