import type { Prisma, Role } from "@prisma/client";
import { calculateAge, toIsoDate, todayAtClinic } from "../../lib/dates.js";
import {
  AppError,
  FOREIGN_KEY_VIOLATION,
  isPrismaError,
  UNIQUE_CONSTRAINT_VIOLATION,
} from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import type { AnimalInput } from "./animals.schemas.js";

const HAS_RECORDS_MESSAGE = "Živali z zdravstveno evidenco ni mogoče izbrisati";
const ANIMAL_NOT_FOUND_MESSAGE = "Žival ne obstaja";
const NO_ACCESS_MESSAGE = "Nimate dostopa do te živali";

const withRecordCounts = {
  _count: { select: { medicalRecords: true, vaccinations: true, allergies: true } },
} satisfies Prisma.AnimalInclude;

type AnimalWithCounts = Prisma.AnimalGetPayload<{ include: typeof withRecordCounts }>;

function hasRecords({ _count }: AnimalWithCounts) {
  return _count.medicalRecords + _count.vaccinations + _count.allergies > 0;
}

function toAnimalResponse(animal: AnimalWithCounts) {
  const { id, ownerId, name, species, breed, sex, microchipNumber } = animal;
  const dateOfBirth = animal.dateOfBirth ? toIsoDate(animal.dateOfBirth) : null;

  return {
    id,
    ownerId,
    name,
    species,
    breed,
    sex,
    dateOfBirth,
    age: dateOfBirth ? calculateAge(dateOfBirth, todayAtClinic()) : null,
    microchipNumber,
    canDelete: !hasRecords(animal),
  };
}

function toData({ dateOfBirth, ...input }: AnimalInput) {
  return { ...input, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null };
}

function toMicrochipConflict(error: unknown) {
  if (isPrismaError(error, UNIQUE_CONSTRAINT_VIOLATION)) {
    const message = "Ta številka čipa je že v sistemu";
    return new AppError(409, message, [{ field: "microchipNumber", message }]);
  }
  return error;
}

async function findOwnedAnimal(id: number, ownerId: number) {
  const animal = await prisma.animal.findUnique({ where: { id }, include: withRecordCounts });

  if (!animal) {
    throw new AppError(404, ANIMAL_NOT_FOUND_MESSAGE);
  }
  if (animal.ownerId !== ownerId) {
    throw new AppError(403, NO_ACCESS_MESSAGE);
  }
  return animal;
}

/** Finds an animal for a user allowed to read medical data: owners only reach their own animals. */
export async function findViewableAnimal(id: number, user: { id: number; role: Role }) {
  const animal = await prisma.animal.findUnique({ where: { id } });

  if (!animal) {
    throw new AppError(404, ANIMAL_NOT_FOUND_MESSAGE);
  }
  if (user.role === "OWNER" && animal.ownerId !== user.id) {
    throw new AppError(403, NO_ACCESS_MESSAGE);
  }
  return animal;
}

export async function listAnimals(ownerId: number) {
  const animals = await prisma.animal.findMany({
    where: { ownerId },
    include: withRecordCounts,
    orderBy: { name: "asc" },
  });

  return animals.map(toAnimalResponse);
}

export async function getAnimal(id: number, ownerId: number) {
  return toAnimalResponse(await findOwnedAnimal(id, ownerId));
}

export async function createAnimal(input: AnimalInput, ownerId: number) {
  try {
    const animal = await prisma.animal.create({
      data: { ...toData(input), ownerId },
      include: withRecordCounts,
    });
    return toAnimalResponse(animal);
  } catch (error) {
    throw toMicrochipConflict(error);
  }
}

export async function updateAnimal(id: number, input: AnimalInput, ownerId: number) {
  await findOwnedAnimal(id, ownerId);

  try {
    const animal = await prisma.animal.update({
      where: { id },
      data: toData(input),
      include: withRecordCounts,
    });
    return toAnimalResponse(animal);
  } catch (error) {
    throw toMicrochipConflict(error);
  }
}

export async function deleteAnimal(id: number, ownerId: number) {
  const animal = await findOwnedAnimal(id, ownerId);

  if (hasRecords(animal)) {
    throw new AppError(409, HAS_RECORDS_MESSAGE);
  }

  try {
    await prisma.animal.delete({ where: { id } });
  } catch (error) {
    // A record may have been added after the check above
    if (isPrismaError(error, FOREIGN_KEY_VIOLATION)) {
      throw new AppError(409, HAS_RECORDS_MESSAGE);
    }
    throw error;
  }
}
