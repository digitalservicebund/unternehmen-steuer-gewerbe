import { OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "hono";

const app: OpenAPIHono<Env> = new OpenAPIHono();

export type HonoAppType = typeof app;

export default app;
