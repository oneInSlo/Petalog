import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { create, get, list, remove, update } from "./animals.controller.js";

export const animalsRoutes = Router();

animalsRoutes.use(requireAuth, requireRole("OWNER"));

animalsRoutes.get("/", list);
animalsRoutes.post("/", create);
animalsRoutes.get("/:id", get);
animalsRoutes.put("/:id", update);
animalsRoutes.delete("/:id", remove);
