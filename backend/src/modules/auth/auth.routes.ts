import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { login, logout, me, register } from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", requireAuth, me);
