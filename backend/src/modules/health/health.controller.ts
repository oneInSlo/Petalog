import type { Request, Response } from "express";
import { isDatabaseReachable } from "./health.service.js";

export async function getHealth(_req: Request, res: Response) {
  const databaseOk = await isDatabaseReachable();

  res.status(databaseOk ? 200 : 503).json({
    status: databaseOk ? "ok" : "error",
    database: databaseOk ? "ok" : "error",
  });
}
