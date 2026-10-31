import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { healthRoutes } from "./modules/health/health.routes.js";

export const app = express();

app.use(express.json());

app.use("/api/health", healthRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
