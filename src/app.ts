import express, { type Express } from "express";

const app = () => {
  const expressApp: Express = express();
  return expressApp;
};

export default app;
