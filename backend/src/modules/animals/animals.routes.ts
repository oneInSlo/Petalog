import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { create, get, list, remove, search, update } from "./animals.controller.js";

export const animalsRoutes = Router();

animalsRoutes.get(
  "/search",
  requireAuth,
  requireRole("RECEPTIONIST", "VETERINARIAN"),
  search,
);
animalsRoutes.get(
  "/:id",
  requireAuth,
  requireRole("OWNER", "RECEPTIONIST", "VETERINARIAN"),
  get,
);

animalsRoutes.use(requireAuth, requireRole("OWNER"));

animalsRoutes.get("/", list);
animalsRoutes.post("/", create);
animalsRoutes.put("/:id", update);
animalsRoutes.delete("/:id", remove);
