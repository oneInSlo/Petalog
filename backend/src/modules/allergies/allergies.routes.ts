import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { create, list } from "./allergies.controller.js";

export const allergiesRoutes = Router({ mergeParams: true });

allergiesRoutes.get("/allergies", requireAuth, requireRole("OWNER", "VETERINARIAN"), list);
allergiesRoutes.post("/allergies", requireAuth, requireRole("VETERINARIAN"), create);
