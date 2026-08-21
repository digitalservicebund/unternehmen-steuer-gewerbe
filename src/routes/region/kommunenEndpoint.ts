import { HonoAppType } from "../../honoApp";
import { kommunenRoute } from "./kommunenRoute";
import { SUPPORTED_KOMMUNEN } from "./supportedRegions";

export function addKommunenEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(kommunenRoute, (c) => {
    return c.json({ kommunen: [...SUPPORTED_KOMMUNEN] }, 200);
  });
  return app;
}
