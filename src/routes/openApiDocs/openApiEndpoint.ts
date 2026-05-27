import { swaggerUI } from "@hono/swagger-ui";
import { HonoAppType } from "../../honoApp";

export function addOpenApiEndpoints(app: HonoAppType): HonoAppType {
  // OpenAPI Documentation
  // 1) Serve the JSON file
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Unternehmen-Steuer-Gewerbe API",
      description: `API for communicating with Gewerbeämtern and ELSTER in order to support founders. <br>
                    <ul>
                      <li>Used by <a href="https://github.com/digitalservicebund/unternehmen-one-stop-shop">unternehmen-one-stop-shop</a>. </li>
                      <li>Repository is <a href="https://github.com/digitalservicebund/unternehmen-steuer-gewerbe">https://github.com/digitalservicebund/unternehmen-steuer-gewerbe</a>.</li>`,
    },
  });
  // 2) Serve the Swagger UI
  app.get("/ui", swaggerUI({ url: "/doc" }));

  return app;
}
