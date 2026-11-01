import type { Prisma, Role } from "@prisma/client";
import { AppError, isPrismaError, RECORD_NOT_FOUND } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import { findViewableAnimal } from "../animals/animals.service.js";
import type { AddendumInput, MedicalRecordInput } from "./medical-records.schemas.js";

const CLOSED_RECORD_MESSAGE = "Zaključenega zapisa ni mogoče urejati";

const personName = { select: { id: true, firstName: true, lastName: true } };

const recordDetails = {
  veterinarian: personName,
  addenda: { include: { author: personName }, orderBy: { createdAt: "asc" } },
} satisfies Prisma.MedicalRecordInclude;

async function findRecord(id: number) {
  const record = await prisma.medicalRecord.findUnique({ where: { id }, include: recordDetails });

  if (!record) {
    throw new AppError(404, "Zapis ne obstaja");
  }
  return record;
}

/** Writes only while the record is a draft, so a close cannot slip in between check and write. */
async function updateDraft(id: number, data: Prisma.MedicalRecordUpdateInput) {
  try {
    return await prisma.medicalRecord.update({
      where: { id, status: "DRAFT" },
      data,
      include: recordDetails,
    });
  } catch (error) {
    if (isPrismaError(error, RECORD_NOT_FOUND)) {
      throw new AppError(409, CLOSED_RECORD_MESSAGE);
    }
    throw error;
  }
}

export async function listMedicalRecords(animalId: number, user: { id: number; role: Role }) {
  await findViewableAnimal(animalId, user);

  return prisma.medicalRecord.findMany({
    where: { animalId },
    include: recordDetails,
    orderBy: { createdAt: "desc" },
  });
}

export async function getMedicalRecord(id: number) {
  return findRecord(id);
}

export async function createMedicalRecord(
  animalId: number,
  input: MedicalRecordInput,
  veterinarian: { id: number; role: Role },
) {
  await findViewableAnimal(animalId, veterinarian);

  return prisma.medicalRecord.create({
    data: { ...input, animalId, veterinarianId: veterinarian.id },
    include: recordDetails,
  });
}

export async function updateMedicalRecord(
  id: number,
  input: MedicalRecordInput,
  veterinarianId: number,
) {
  const record = await findRecord(id);

  if (record.status === "CLOSED") {
    throw new AppError(409, CLOSED_RECORD_MESSAGE);
  }
  if (record.veterinarianId !== veterinarianId) {
    throw new AppError(403, "Osnutek lahko ureja samo veterinar, ki ga je ustvaril");
  }
  return updateDraft(id, input);
}

export async function closeMedicalRecord(id: number, veterinarianId: number) {
  const record = await findRecord(id);

  if (record.veterinarianId !== veterinarianId) {
    throw new AppError(403, "Zapis lahko zaključi samo veterinar, ki ga je ustvaril");
  }
  if (record.status === "CLOSED") {
    throw new AppError(409, "Zapis je že zaključen");
  }
  return updateDraft(id, { status: "CLOSED", closedAt: new Date() });
}

export async function addAddendum(id: number, { content }: AddendumInput, authorId: number) {
  const record = await findRecord(id);

  if (record.status !== "CLOSED") {
    throw new AppError(409, "Dodatek je mogoče dodati samo zaključenemu zapisu");
  }
  return prisma.recordAddendum.create({
    data: { recordId: id, authorId, content },
    include: { author: personName },
  });
}
