import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { calendar, create, listVaccines } from "./vaccinations.controller.js";

export const vaccinationsRoutes = Router({ mergeParams: true });

vaccinationsRoutes.get(
  "/vaccinations",
  requireAuth,
  requireRole("OWNER", "RECEPTIONIST", "VETERINARIAN"),
  calendar,
);
vaccinationsRoutes.post("/vaccinations", requireAuth, requireRole("VETERINARIAN"), create);
vaccinationsRoutes.get("/vaccines", requireAuth, requireRole("VETERINARIAN"), listVaccines);
