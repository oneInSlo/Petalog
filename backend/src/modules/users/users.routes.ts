import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { create, deactivate, list } from "./users.controller.js";

export const usersRoutes = Router();

usersRoutes.use(requireAuth, requireRole("ADMIN"));

usersRoutes.post("/", create);
usersRoutes.get("/", list);
usersRoutes.post("/:id/deactivate", deactivate);
