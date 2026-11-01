import cookieParser from "cookie-parser";
import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { animalsRoutes } from "./modules/animals/animals.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import { vaccinationsRoutes } from "./modules/vaccinations/vaccinations.routes.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
// Before animalsRoutes, whose owner guard catches everything else under /api/animals
app.use("/api/animals/:id", vaccinationsRoutes);
app.use("/api/animals", animalsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
