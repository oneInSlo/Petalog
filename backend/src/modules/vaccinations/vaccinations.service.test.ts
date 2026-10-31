import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../lib/prisma.js";
import {
  createVaccination,
  getVaccinationCalendar,
  listVaccinesForAnimal,
} from "./vaccinations.service.js";

vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    animal: { findUnique: vi.fn() },
    vaccine: { findMany: vi.fn(), findUnique: vi.fn() },
    vaccination: { create: vi.fn(), findMany: vi.fn() },
  },
}));

const findAnimal = vi.mocked(prisma.animal.findUnique);
const findVaccines = vi.mocked(prisma.vaccine.findMany);
const findVaccine = vi.mocked(prisma.vaccine.findUnique);
const createInDb = vi.mocked(prisma.vaccination.create);
const findVaccinations = vi.mocked(prisma.vaccination.findMany);

const veterinarian = { id: 2, role: "VETERINARIAN" as const };
const owner = { id: 4, role: "OWNER" as const };
const otherOwner = { id: 5, role: "OWNER" as const };
const receptionist = { id: 3, role: "RECEPTIONIST" as const };

const animal = {
  id: 1,
  ownerId: 4,
  name: "Luna",
  species: "DOG" as const,
  breed: null,
  sex: "FEMALE" as const,
  dateOfBirth: null,
  microchipNumber: null,
  createdAt: new Date(),
};

const rabies = {
  id: 10,
  name: "Steklina",
  species: "DOG" as const,
  intervalMonths: 12,
  isActive: true,
};

function storedVaccination(
  id: number,
  vaccine: { id: number; name: string },
  vaccinationDate: string,
  nextDueDate: string,
) {
  return {
    id,
    animalId: 1,
    vaccineId: vaccine.id,
    veterinarianId: 2,
    vaccinationDate: new Date(vaccinationDate),
    intervalMonths: 12,
    nextDueDate: new Date(nextDueDate),
    batchNumber: null,
    createdAt: new Date(),
    vaccine,
    veterinarian: { id: 2, firstName: "Marko", lastName: "Novak" },
  };
}

const input = { vaccineId: 10, vaccinationDate: "2026-03-10", batchNumber: null };

beforeEach(() => {
  vi.resetAllMocks();
  findAnimal.mockResolvedValue(animal);
});

describe("listVaccinesForAnimal", () => {
  it("asks only for active vaccines of the animal's species", async () => {
    findVaccines.mockResolvedValue([]);

    await listVaccinesForAnimal(1, veterinarian);

    expect(findVaccines.mock.calls[0][0]?.where).toEqual({ species: "DOG", isActive: true });
  });
});

describe("createVaccination", () => {
  it("calculates the due date and stores the interval and veterinarian", async () => {
    findVaccine.mockResolvedValue(rabies);
    createInDb.mockResolvedValue(storedVaccination(1, rabies, "2026-03-10", "2027-03-10"));

    await createVaccination(1, input, veterinarian);

    expect(createInDb.mock.calls[0][0].data).toMatchObject({
      animalId: 1,
      vaccineId: 10,
      veterinarianId: 2,
      vaccinationDate: new Date("2026-03-10"),
      intervalMonths: 12,
      nextDueDate: new Date("2027-03-10"),
    });
  });

  it.each([
    ["an unknown vaccine", null],
    ["an inactive vaccine", { ...rabies, isActive: false }],
    ["a vaccine for another species", { ...rabies, species: "CAT" as const }],
  ])("rejects %s with status 400", async (_name, vaccine) => {
    findVaccine.mockResolvedValue(vaccine);

    await expect(createVaccination(1, input, veterinarian)).rejects.toMatchObject({
      status: 400,
      details: [{ field: "vaccineId", message: "Izbrano cepivo ni na voljo za to žival" }],
    });
    expect(createInDb).not.toHaveBeenCalled();
  });

  it("returns status 404 for an unknown animal", async () => {
    findAnimal.mockResolvedValue(null);

    await expect(createVaccination(99, input, veterinarian)).rejects.toMatchObject({ status: 404 });
  });
});

describe("getVaccinationCalendar", () => {
  it("shows only the latest vaccination of each vaccine, ordered by name", async () => {
    const dhppi = { id: 11, name: "Kombinirano cepivo DHPPi" };
    findVaccinations.mockResolvedValue([
      storedVaccination(3, rabies, "2026-03-10", "2099-03-10"),
      storedVaccination(2, dhppi, "2025-03-10", "2026-03-10"),
      storedVaccination(1, rabies, "2024-03-10", "2025-03-10"),
    ]);

    const calendar = await getVaccinationCalendar(1, veterinarian);

    expect(calendar.map(({ id }) => id)).toEqual([2, 3]);
    expect(calendar[1]).toMatchObject({
      vaccinationDate: "2026-03-10",
      nextDueDate: "2099-03-10",
      status: "VALID",
    });
    expect(calendar[0].status).toBe("OVERDUE");
  });

  it("is visible to the animal's owner and the receptionist", async () => {
    findVaccinations.mockResolvedValue([]);

    await expect(getVaccinationCalendar(1, owner)).resolves.toEqual([]);
    await expect(getVaccinationCalendar(1, receptionist)).resolves.toEqual([]);
  });

  it("rejects another owner with status 403", async () => {
    await expect(getVaccinationCalendar(1, otherOwner)).rejects.toMatchObject({ status: 403 });
    expect(findVaccinations).not.toHaveBeenCalled();
  });
});
