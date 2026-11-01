import type { Prisma, Role } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { findViewableAnimal } from "../animals/animals.service.js";
import type { AllergyInput } from "./allergies.schemas.js";

const allergyDetails = {
  recordedBy: { select: { id: true, firstName: true, lastName: true } },
} satisfies Prisma.AllergyInclude;

export async function listAllergies(animalId: number, user: { id: number; role: Role }) {
  await findViewableAnimal(animalId, user);

  return prisma.allergy.findMany({
    where: { animalId },
    include: allergyDetails,
    orderBy: { createdAt: "asc" },
  });
}

export async function createAllergy(
  animalId: number,
  input: AllergyInput,
  veterinarian: { id: number; role: Role },
) {
  await findViewableAnimal(animalId, veterinarian);

  return prisma.allergy.create({
    data: { ...input, animalId, recordedById: veterinarian.id },
    include: allergyDetails,
  });
}
