import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../lib/prisma.js";
import { createAllergy, listAllergies } from "./allergies.service.js";

vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    animal: { findUnique: vi.fn() },
    allergy: { create: vi.fn(), findMany: vi.fn() },
  },
}));

const findAnimal = vi.mocked(prisma.animal.findUnique);
const createInDb = vi.mocked(prisma.allergy.create);
const findAllergies = vi.mocked(prisma.allergy.findMany);

const veterinarian = { id: 2, role: "VETERINARIAN" as const };
const input = { allergen: "Penicilin", description: null };

beforeEach(() => {
  vi.resetAllMocks();
  findAnimal.mockResolvedValue({ id: 1, ownerId: 4 } as never);
});

describe("createAllergy", () => {
  it("stores the allergy under the logged-in veterinarian", async () => {
    await createAllergy(1, input, veterinarian);

    expect(createInDb.mock.calls[0][0].data).toEqual({ ...input, animalId: 1, recordedById: 2 });
  });

  it("returns status 404 for an unknown animal", async () => {
    findAnimal.mockResolvedValue(null);

    await expect(createAllergy(99, input, veterinarian)).rejects.toMatchObject({ status: 404 });
    expect(createInDb).not.toHaveBeenCalled();
  });
});

describe("listAllergies", () => {
  it("shows the allergies to the animal's owner", async () => {
    findAllergies.mockResolvedValue([]);

    await expect(listAllergies(1, { id: 4, role: "OWNER" })).resolves.toEqual([]);
    expect(findAllergies.mock.calls[0][0]?.where).toEqual({ animalId: 1 });
  });

  it("rejects another owner with status 403", async () => {
    await expect(listAllergies(1, { id: 5, role: "OWNER" })).rejects.toMatchObject({ status: 403 });
    expect(findAllergies).not.toHaveBeenCalled();
  });
});
