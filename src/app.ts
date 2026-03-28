import express, { type Express } from "express";
import helmet from "helmet";

const app: Express = express();
app.use(helmet.hidePoweredBy());

// routes (keep here until complex)
app.post("/register-steuernummer", (req, res) => {
  res.sendStatus(200);
});

export default app;
