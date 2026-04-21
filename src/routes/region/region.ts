import { HonoAppType } from "../../app";
import { regionRoute } from "./regionRoute";
import { isSupportedRegion } from "./supportedRegions";

export function addRegionEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(regionRoute, (c) => {
    const { plz } = c.req.valid("param");
    return c.json({ supported: isSupportedRegion(plz) }, 200);
  });
  return app;
}
