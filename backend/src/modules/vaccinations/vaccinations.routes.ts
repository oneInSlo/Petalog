import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { calendar, create, listDue, listVaccines } from "./vaccinations.controller.js";

export const dueVaccinationsRoutes = Router();

dueVaccinationsRoutes.get("/due", requireAuth, requireRole("VETERINARIAN"), listDue);

export const vaccinationsRoutes = Router({ mergeParams: true });

vaccinationsRoutes.get(
  "/vaccinations",
  requireAuth,
  requireRole("OWNER", "RECEPTIONIST", "VETERINARIAN"),
  calendar,
);
vaccinationsRoutes.post("/vaccinations", requireAuth, requireRole("VETERINARIAN"), create);
vaccinationsRoutes.get("/vaccines", requireAuth, requireRole("VETERINARIAN"), listVaccines);
