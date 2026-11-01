import type { Request, Response } from "express";
import { idParamSchema } from "../../lib/validation.js";
import { allergySchema } from "./allergies.schemas.js";
import { createAllergy, listAllergies } from "./allergies.service.js";

export async function list(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);

  res.json({ allergies: await listAllergies(id, req.user!) });
}

export async function create(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  const allergy = await createAllergy(id, allergySchema.parse(req.body ?? {}), req.user!);

  res.status(201).json({ allergy });
}
