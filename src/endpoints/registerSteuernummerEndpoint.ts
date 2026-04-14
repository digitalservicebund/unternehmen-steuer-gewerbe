import { HonoAppType } from "../app";
import { registerSteuernummerRoute } from "./registerSteuernummerRoute";

export function addRegisterSteuernummerEndpoint(app: HonoAppType): HonoAppType {
  app.openapi(registerSteuernummerRoute, (c) => {
    return c.json({});
  });

  return app;
}
