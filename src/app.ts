import express, { type Express } from "express";
import helmet from "helmet";
import FitConnectClient from "./fitConnectClient";

const app: Express = express();
app.use(helmet.hidePoweredBy());

const fitConnectClient = new FitConnectClient({
  clientId: process.env.FIT_CONNECT_CLIENT_ID!,
  clientSecret: process.env.FIT_CONNECT_CLIENT_SECRET!,
  oauthTokenUrl: process.env.FIT_CONNECT_OAUTH_TOKEN_URL!,
  submissionApiUrl: process.env.FIT_CONNECT_SUBMISSION_API_URL!,
});

// routes (keep here until complex)
app.post("/api/v1/register-steuernummer", (req, res) => {
  res.json();
});

app.post("/api/v1/register-gewerbe", async (req, res) => {
  const testData = { hello: "world" };
  const fitConnectResponse = await fitConnectClient.submitData({
    destinationId: "dbc4efa5-58e7-4527-8898-00d58450c68e",
    publicService: { identifier: "urn:test", name: "Test" }, // TODO this should be the xgewerbeordnung service
    dataSchema: { schemaUri: "urn:schema", mimeType: "application/json" }, // TODO this should be the xgewerbeordnung xml schema
    data: JSON.stringify(testData), // TODO this should be the xgewerbeordnung xml
  });
  console.log(fitConnectResponse);
  res.json();
});

export default app;
