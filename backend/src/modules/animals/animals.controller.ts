import type { Request, Response } from "express";
import { idParamSchema } from "../../lib/validation.js";
import { animalSchema, animalSearchSchema } from "./animals.schemas.js";
import {
  createAnimal,
  deleteAnimal,
  getAnimal,
  listAnimals,
  searchAnimals,
  updateAnimal,
} from "./animals.service.js";

export async function list(req: Request, res: Response) {
  res.json({ animals: await listAnimals(req.user!.id) });
}

export async function search(req: Request, res: Response) {
  const { q } = animalSearchSchema.parse(req.query);

  res.json({ animals: await searchAnimals(q) });
}

export async function get(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);

  res.json({ animal: await getAnimal(id, req.user!) });
}

export async function create(req: Request, res: Response) {
  const animal = await createAnimal(animalSchema.parse(req.body ?? {}), req.user!.id);

  res.status(201).json({ animal });
}

export async function update(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  const animal = await updateAnimal(id, animalSchema.parse(req.body ?? {}), req.user!.id);

  res.json({ animal });
}

export async function remove(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  await deleteAnimal(id, req.user!.id);

  res.status(204).end();
}
