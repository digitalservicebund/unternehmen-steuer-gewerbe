import express, { type Express } from "express";
import helmet from "helmet";
import FitConnectClient from "./fitConnectClient";

const app: Express = express();
app.use(helmet.hidePoweredBy());
app.use(express.json());

const fitConnectClient = new FitConnectClient({
  clientId: process.env.FIT_CONNECT_CLIENT_ID!,
  clientSecret: process.env.FIT_CONNECT_CLIENT_SECRET!,
  oauthTokenUrl: process.env.FIT_CONNECT_OAUTH_TOKEN_URL!,
  submissionApiUrl: process.env.FIT_CONNECT_SUBMISSION_API_URL!,
  privateKey: JSON.parse(process.env.FIT_CONNECT_PRIVATE_KEY_DECRYPTION_JWK!),
});

// routes (keep here until complex)
app.post("/api/v1/register-steuernummer", (req, res) => {
  res.json();
});

app.post("/api/v1/register-gewerbe", async (req, res) => {
  try {
    const data = req.body;
    const fitConnectResponse = await fitConnectClient.submitData({
      destinationId: "dbc4efa5-58e7-4527-8898-00d58450c68e",
      publicService: { identifier: "urn:de:fim:leika:leistung:99050012104000", name: "Test" }, // TODO this should be the xgewerbeordnung service
      dataSchema: {
        schemaUri: "https://schema.fitko.de/demo/muster-fachdaten.schema.json",
        mimeType: "application/json",
      }, // TODO this should be the xgewerbeordnung xml schema
      data: JSON.stringify(data), // TODO this should be the xgewerbeordnung xml
    });
    res.json(fitConnectResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }

  res.json();
});

app.get("/api/v1/register-gewerbe/:submissionId/events", async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submissionEvents = await fitConnectClient.getSubmissionEvents(submissionId);
    res.json(submissionEvents);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default app;
