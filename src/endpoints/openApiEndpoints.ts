import { swaggerUI } from "@hono/swagger-ui";
import { HonoAppType } from "../app";

export function addOpenApiEndpoints(app: HonoAppType): HonoAppType {
  // OpenAPI Documentation
  // 1) Serve the JSON file
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "My API",
    },
  });
  // 2) Serve the Swagger UI
  app.get("/ui", swaggerUI({ url: "/doc" }));

  return app;
}
