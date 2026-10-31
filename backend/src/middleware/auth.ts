import type { Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/index.js";
import { AppError } from "../lib/errors.js";
import { getCurrentUser, NOT_LOGGED_IN_MESSAGE } from "../modules/auth/auth.service.js";
import { AUTH_COOKIE, verifyToken } from "../modules/auth/auth.token.js";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const payload = verifyToken(req.cookies[AUTH_COOKIE] ?? "", env.JWT_SECRET);
  if (!payload) {
    throw new AppError(401, NOT_LOGGED_IN_MESSAGE);
  }

  // Loaded from the database so that deactivation and role changes apply before the token expires
  req.user = await getCurrentUser(payload.userId);
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, NOT_LOGGED_IN_MESSAGE);
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError(403, "Nimate zadostnih pravic");
    }
    next();
  };
}
