import express, { type Express } from "express";
import helmet from "helmet";

const app: Express = express();
app.use(helmet.hidePoweredBy());

// routes (keep here until complex)
app.post("/api/v1/register-steuernummer", (req, res) => {
  res.json();
});

app.post("/api/v1/register-gewerbe", (req, res) => {
  res.json();
});

export default app;
