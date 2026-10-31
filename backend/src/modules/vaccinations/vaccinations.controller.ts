import type { Request, Response } from "express";
import { idParamSchema } from "../../lib/validation.js";
import { vaccinationSchema } from "./vaccinations.schemas.js";
import {
  createVaccination,
  getVaccinationCalendar,
  listVaccinesForAnimal,
} from "./vaccinations.service.js";

export async function listVaccines(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);

  res.json({ vaccines: await listVaccinesForAnimal(id, req.user!) });
}

export async function calendar(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);

  res.json({ calendar: await getVaccinationCalendar(id, req.user!) });
}

export async function create(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  const vaccination = await createVaccination(
    id,
    vaccinationSchema.parse(req.body ?? {}),
    req.user!,
  );

  res.status(201).json({ vaccination });
}
