import type { Request, Response } from "express";
import { idParamSchema } from "../../lib/validation.js";
import { addendumSchema, medicalRecordSchema } from "./medical-records.schemas.js";
import {
  addAddendum,
  closeMedicalRecord,
  createMedicalRecord,
  getMedicalRecord,
  listMedicalRecords,
  updateMedicalRecord,
} from "./medical-records.service.js";

export async function list(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);

  res.json({ records: await listMedicalRecords(id, req.user!) });
}

export async function create(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  const record = await createMedicalRecord(
    id,
    medicalRecordSchema.parse(req.body ?? {}),
    req.user!,
  );

  res.status(201).json({ record });
}

export async function get(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);

  res.json({ record: await getMedicalRecord(id) });
}

export async function update(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  const record = await updateMedicalRecord(
    id,
    medicalRecordSchema.parse(req.body ?? {}),
    req.user!.id,
  );

  res.json({ record });
}

export async function close(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);

  res.json({ record: await closeMedicalRecord(id, req.user!.id) });
}

export async function addendum(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  const created = await addAddendum(id, addendumSchema.parse(req.body ?? {}), req.user!.id);

  res.status(201).json({ addendum: created });
}
