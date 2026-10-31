import type { CookieOptions, Request, Response } from "express";
import { env } from "../../config/index.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import { loginUser, registerOwner, type PublicUser } from "./auth.service.js";
import { signToken, TOKEN_LIFETIME_MS } from "./auth.token.js";

const AUTH_COOKIE = "token";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
  path: "/",
};

function setAuthCookie(res: Response, user: PublicUser) {
  const token = signToken({ userId: user.id, role: user.role }, env.JWT_SECRET);
  res.cookie(AUTH_COOKIE, token, { ...cookieOptions, maxAge: TOKEN_LIFETIME_MS });
}

export async function register(req: Request, res: Response) {
  const user = await registerOwner(registerSchema.parse(req.body ?? {}));

  setAuthCookie(res, user);
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const user = await loginUser(loginSchema.parse(req.body ?? {}));

  setAuthCookie(res, user);
  res.json({ user });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(AUTH_COOKIE, cookieOptions);
  res.status(204).end();
}
