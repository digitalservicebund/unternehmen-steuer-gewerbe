import { HTTPException } from "hono/http-exception";

import { HonoAppType } from "../../app";
import { registerSteuernummerRoute } from "./registerSteuernummerRoute";

export function addRegisterSteuernummerEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(registerSteuernummerRoute, () => {
    throw new HTTPException(501, { message: "Not Implemented" });
  });

  return app;
}
