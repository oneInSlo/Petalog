import type { Request, Response } from "express";
import { createStaffSchema, listStaffSchema, userIdSchema } from "./users.schemas.js";
import { createStaff, deactivateStaff, listStaff } from "./users.service.js";

export async function create(req: Request, res: Response) {
  const user = await createStaff(createStaffSchema.parse(req.body ?? {}));

  res.status(201).json({ user });
}

export async function list(req: Request, res: Response) {
  const users = await listStaff(listStaffSchema.parse(req.query));

  res.json({ users });
}

export async function deactivate(req: Request, res: Response) {
  const { id } = userIdSchema.parse(req.params);
  const user = await deactivateStaff(id, req.user!.id);

  res.json({ user });
}
