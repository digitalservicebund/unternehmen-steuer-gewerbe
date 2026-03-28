import express, { type Express } from "express";
import helmet from "helmet";

/* v8 ignore next 2 */
const app: Express = express();
app.use(helmet.hidePoweredBy());

export default app;
