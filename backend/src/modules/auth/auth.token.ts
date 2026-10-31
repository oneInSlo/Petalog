import type { Role } from "@prisma/client";
import jwt from "jsonwebtoken";

const TOKEN_LIFETIME_SECONDS = 8 * 60 * 60;

export const TOKEN_LIFETIME_MS = TOKEN_LIFETIME_SECONDS * 1000;

export type TokenPayload = { userId: number; role: Role };

export function signToken(payload: TokenPayload, secret: string): string {
  return jwt.sign(payload, secret, { expiresIn: TOKEN_LIFETIME_SECONDS });
}

export function verifyToken(token: string, secret: string): TokenPayload | null {
  try {
    return jwt.verify(token, secret, { algorithms: ["HS256"] }) as TokenPayload;
  } catch {
    return null;
  }
}
