import type { Prisma, Role } from "@prisma/client";
import { addMonths, toIsoDate, todayAtClinic } from "../../lib/dates.js";
import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import { findViewableAnimal } from "../animals/animals.service.js";
import type { VaccinationInput } from "./vaccinations.schemas.js";
import { getVaccinationStatus, selectDueVaccinations } from "./vaccinations.rules.js";

const vaccinationDetails = {
  vaccine: { select: { id: true, name: true } },
  veterinarian: { select: { id: true, firstName: true, lastName: true } },
} satisfies Prisma.VaccinationInclude;

type VaccinationWithDetails = Prisma.VaccinationGetPayload<{ include: typeof vaccinationDetails }>;

function toVaccinationResponse(vaccination: VaccinationWithDetails) {
  const { id, vaccine, veterinarian, intervalMonths, batchNumber } = vaccination;
  const nextDueDate = toIsoDate(vaccination.nextDueDate);

  return {
    id,
    vaccine,
    veterinarian,
    vaccinationDate: toIsoDate(vaccination.vaccinationDate),
    intervalMonths,
    nextDueDate,
    batchNumber,
    status: getVaccinationStatus(nextDueDate, todayAtClinic()),
  };
}

export async function listVaccinesForAnimal(animalId: number, user: { id: number; role: Role }) {
  const animal = await findViewableAnimal(animalId, user);

  return prisma.vaccine.findMany({
    where: { species: animal.species, isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, intervalMonths: true },
  });
}

export async function createVaccination(
  animalId: number,
  { vaccineId, vaccinationDate, batchNumber }: VaccinationInput,
  veterinarian: { id: number; role: Role },
) {
  const animal = await findViewableAnimal(animalId, veterinarian);

  const vaccine = await prisma.vaccine.findUnique({ where: { id: vaccineId } });
  if (!vaccine || !vaccine.isActive || vaccine.species !== animal.species) {
    const message = "Izbrano cepivo ni na voljo za to žival";
    throw new AppError(400, message, [{ field: "vaccineId", message }]);
  }

  const vaccination = await prisma.vaccination.create({
    data: {
      animalId,
      vaccineId,
      veterinarianId: veterinarian.id,
      vaccinationDate: new Date(vaccinationDate),
      intervalMonths: vaccine.intervalMonths,
      nextDueDate: new Date(addMonths(vaccinationDate, vaccine.intervalMonths)),
      batchNumber,
    },
    include: vaccinationDetails,
  });

  return toVaccinationResponse(vaccination);
}

export async function listDueVaccinations() {
  const vaccinations = await prisma.vaccination.findMany({
    include: {
      vaccine: { select: { id: true, name: true } },
      animal: {
        select: {
          id: true,
          name: true,
          species: true,
          owner: { select: { id: true, firstName: true, lastName: true, phone: true } },
        },
      },
    },
    orderBy: [{ vaccinationDate: "desc" }, { createdAt: "desc" }],
  });
  const today = todayAtClinic();

  return selectDueVaccinations(vaccinations, today).map(({ id, vaccine, animal, ...dates }) => {
    const nextDueDate = toIsoDate(dates.nextDueDate);

    return { id, vaccine, animal, nextDueDate, status: getVaccinationStatus(nextDueDate, today) };
  });
}

/** The latest vaccination with each vaccine, ordered by vaccine name. */
export async function getVaccinationCalendar(animalId: number, user: { id: number; role: Role }) {
  await findViewableAnimal(animalId, user);

  const vaccinations = await prisma.vaccination.findMany({
    where: { animalId },
    include: vaccinationDetails,
    orderBy: [{ vaccinationDate: "desc" }, { createdAt: "desc" }],
  });

  const latestByVaccine = new Map<number, VaccinationWithDetails>();
  for (const vaccination of vaccinations) {
    if (!latestByVaccine.has(vaccination.vaccineId)) {
      latestByVaccine.set(vaccination.vaccineId, vaccination);
    }
  }

  return [...latestByVaccine.values()]
    .map(toVaccinationResponse)
    .sort((a, b) => a.vaccine.name.localeCompare(b.vaccine.name, "sl"));
}
