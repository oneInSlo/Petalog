import { Role, type User } from "@prisma/client";
import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import { createAccount } from "../auth/auth.service.js";
import type { CreateStaffInput, ListStaffFilter } from "./users.schemas.js";

export type StaffMember = Pick<
  User,
  "id" | "firstName" | "lastName" | "email" | "role" | "isActive"
>;

function toStaffMember({ id, firstName, lastName, email, role, isActive }: User): StaffMember {
  return { id, firstName, lastName, email, role, isActive };
}

export async function createStaff(input: CreateStaffInput): Promise<StaffMember> {
  return toStaffMember(await createAccount(input));
}

export async function listStaff({ role }: ListStaffFilter): Promise<StaffMember[]> {
  const users = await prisma.user.findMany({
    where: { role: role ?? { not: Role.OWNER } },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  return users.map(toStaffMember);
}

async function setStaffActive(id: number, isActive: boolean): Promise<StaffMember> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role === Role.OWNER) {
    throw new AppError(404, "Uporabnik ne obstaja");
  }

  return toStaffMember(await prisma.user.update({ where: { id }, data: { isActive } }));
}

export async function deactivateStaff(id: number, adminId: number): Promise<StaffMember> {
  if (id === adminId) {
    throw new AppError(409, "Svojega računa ne morete deaktivirati");
  }

  return setStaffActive(id, false);
}

export async function activateStaff(id: number): Promise<StaffMember> {
  return setStaffActive(id, true);
}
