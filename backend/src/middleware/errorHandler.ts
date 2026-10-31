import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../lib/errors.js";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, "Pot ne obstaja"));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Neveljavni podatki",
      details: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }

  // express.json() reports a malformed request body as a SyntaxError
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: "Neveljavni podatki" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Notranja napaka strežnika" });
}
