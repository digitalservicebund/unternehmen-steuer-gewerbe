import { Hono } from "hono";
// import helmet from "helmet";
import FitConnectClient from "./fitConnectClient";
import type { Environment } from "./fitConnectClient/environments";
import { getSecret } from "./secrets";

const app = new Hono();
// app.use(helmet.hidePoweredBy());
// app.use(express.json());

const fitConnectClient = new FitConnectClient({
  environment: (getSecret("FIT_CONNECT_ENV") || "test") as Environment,
  clientId: getSecret("FIT_CONNECT_CLIENT_ID"),
  clientSecret: getSecret("FIT_CONNECT_CLIENT_SECRET"),
  privateKey: getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK")
    ? JSON.parse(getSecret("FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK"))
    : undefined,
});

app.get("/", (c) => {
  return c.json({
    status: "ok",
    ...(c.req.query("verbose") ? { fitConnectEnvironment: getSecret("FIT_CONNECT_ENV") } : {}),
  });
});

app.post("/api/v1/register-steuernummer", (c) => {
  return c.json({});
});

app.post("/api/v1/register-gewerbe", async (c) => {
  try {
    const data = await c.req.json();
    const fitConnectResponse = await fitConnectClient.submitData({
      // The destination varies from commune to commune.
      // We can hard‑code it here for the demo, but in the future we need to
      // use the Fit‑Connect routing API to determine the destination ID.
      destinationId: "dbc4efa5-58e7-4527-8898-00d58450c68e",
      publicService: {
        identifier: "urn:de:fim:leika:leistung:99050012104000",
        name: "Gewerbe Anmeldung",
      },
      dataSchema: {
        schemaUri: "https://schema.fitko.de/demo/muster-fachdaten.schema.json",
        mimeType: "application/json",
      },
      data: JSON.stringify(data),
    });
    return c.json(fitConnectResponse);
  } catch (error) {
    console.error(error);
    return c.text("Internal Server Error", 500);
  }
});

app.get("/api/v1/register-gewerbe/:submissionId/events", async (c) => {
  try {
    const submissionId = c.req.param("submissionId");
    const submissionEvents = await fitConnectClient.getSubmissionEvents(submissionId);
    return c.json(submissionEvents);
  } catch (error) {
    console.error(error);
    c.text("Internal Server Error", 500);
  }
});

export default app;
