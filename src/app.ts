import express, { type Express } from "express";
import helmet from "helmet";

const app: Express = express();
app.use(helmet);

export default app;
