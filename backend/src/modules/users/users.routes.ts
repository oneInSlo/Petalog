import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { activate, create, deactivate, list } from "./users.controller.js";

export const usersRoutes = Router();

usersRoutes.use(requireAuth, requireRole("ADMIN"));

usersRoutes.post("/", create);
usersRoutes.get("/", list);
usersRoutes.post("/:id/deactivate", deactivate);
usersRoutes.post("/:id/activate", activate);
