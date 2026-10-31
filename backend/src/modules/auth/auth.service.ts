import { Prisma, Role, type User } from "@prisma/client";
import bcrypt from "bcrypt";
import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";

const BCRYPT_ROUNDS = 10;
const UNIQUE_CONSTRAINT_VIOLATION = "P2002";

export const NOT_LOGGED_IN_MESSAGE = "Niste prijavljeni";

// Compared against when the user does not exist, so the response time does not reveal it
const UNKNOWN_USER_HASH = bcrypt.hashSync("unknown-user", BCRYPT_ROUNDS);

export type PublicUser = Pick<User, "id" | "firstName" | "lastName" | "email" | "phone" | "role">;

function toPublicUser({ id, firstName, lastName, email, phone, role }: User): PublicUser {
  return { id, firstName, lastName, email, phone, role };
}

export async function registerOwner({ password, ...data }: RegisterInput): Promise<PublicUser> {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    const user = await prisma.user.create({ data: { ...data, passwordHash, role: Role.OWNER } });
    return toPublicUser(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === UNIQUE_CONSTRAINT_VIOLATION
    ) {
      const message = "Uporabnik s tem e-poštnim naslovom že obstaja";
      throw new AppError(409, message, [{ field: "email", message }]);
    }
    throw error;
  }
}

export async function loginUser({ email, password }: LoginInput): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { email } });
  const passwordMatches = await bcrypt.compare(password, user?.passwordHash ?? UNKNOWN_USER_HASH);

  if (!user || !passwordMatches || !user.isActive) {
    throw new AppError(401, "Napačen e-poštni naslov ali geslo");
  }

  return toPublicUser(user);
}

export async function getCurrentUser(userId: number): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.isActive) {
    throw new AppError(401, NOT_LOGGED_IN_MESSAGE);
  }

  return toPublicUser(user);
}
