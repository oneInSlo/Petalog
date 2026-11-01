import { Prisma } from "@prisma/client";

export type FieldError = { field: string; message: string };

export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: FieldError[],
  ) {
    super(message);
  }
}

export const UNIQUE_CONSTRAINT_VIOLATION = "P2002";
export const FOREIGN_KEY_VIOLATION = "P2003";
export const RECORD_NOT_FOUND = "P2025";

export function isPrismaError(error: unknown, code: string): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}
