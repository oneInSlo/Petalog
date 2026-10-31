import cookieParser from "cookie-parser";
import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
