import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import {
  addendum,
  close,
  create,
  get,
  list,
  timeline,
  update,
} from "./medical-records.controller.js";

const veterinarianOnly = [requireAuth, requireRole("VETERINARIAN")];

export const animalMedicalRecordsRoutes = Router({ mergeParams: true });

animalMedicalRecordsRoutes.get("/medical-records", veterinarianOnly, list);
animalMedicalRecordsRoutes.post("/medical-records", veterinarianOnly, create);
animalMedicalRecordsRoutes.get(
  "/timeline",
  requireAuth,
  requireRole("OWNER", "VETERINARIAN"),
  timeline,
);

// There is intentionally no DELETE route: medical records are never deleted
export const medicalRecordsRoutes = Router();

medicalRecordsRoutes.use(veterinarianOnly);

medicalRecordsRoutes.get("/:id", get);
medicalRecordsRoutes.put("/:id", update);
medicalRecordsRoutes.post("/:id/close", close);
medicalRecordsRoutes.post("/:id/addenda", addendum);
