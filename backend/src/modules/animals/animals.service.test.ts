import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../lib/prisma.js";
import {
  createAnimal,
  deleteAnimal,
  getAnimal,
  listAnimals,
  updateAnimal,
} from "./animals.service.js";

vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    animal: {
      create: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const create = vi.mocked(prisma.animal.create);
const remove = vi.mocked(prisma.animal.delete);
const findMany = vi.mocked(prisma.animal.findMany);
const findUnique = vi.mocked(prisma.animal.findUnique);
const update = vi.mocked(prisma.animal.update);

const OWNER_ID = 4;
const OTHER_OWNER_ID = 5;

const noRecords = { medicalRecords: 0, vaccinations: 0, allergies: 0 };

const stored = {
  id: 1,
  ownerId: OWNER_ID,
  name: "Luna",
  species: "DOG" as const,
  breed: null,
  sex: "FEMALE" as const,
  dateOfBirth: new Date("2021-04-12"),
  microchipNumber: null,
  createdAt: new Date(),
  _count: noRecords,
};

const input = {
  name: "Luna",
  species: "DOG" as const,
  sex: "FEMALE" as const,
  breed: null,
  dateOfBirth: "2021-04-12",
  microchipNumber: null,
};

function prismaError(code: string) {
  return new Prisma.PrismaClientKnownRequestError("Constraint failed", {
    code,
    clientVersion: "test",
  });
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("listAnimals", () => {
  it("returns only the owner's animals with the date as YYYY-MM-DD", async () => {
    findMany.mockResolvedValue([stored]);

    const animals = await listAnimals(OWNER_ID);

    expect(findMany.mock.calls[0][0]?.where).toEqual({ ownerId: OWNER_ID });
    expect(animals[0].dateOfBirth).toBe("2021-04-12");
  });

  it.each(["medicalRecords", "vaccinations", "allergies"])(
    "marks an animal with %s as not deletable",
    async (relation) => {
      findMany.mockResolvedValue([stored, { ...stored, _count: { ...noRecords, [relation]: 1 } }]);

      const animals = await listAnimals(OWNER_ID);

      expect(animals.map((animal) => animal.canDelete)).toEqual([true, false]);
    },
  );
});

describe("getAnimal", () => {
  it("returns the owner's animal", async () => {
    findUnique.mockResolvedValue(stored);

    expect((await getAnimal(1, { id: OWNER_ID, role: "OWNER" })).name).toBe("Luna");
  });

  it.each(["VETERINARIAN", "RECEPTIONIST"] as const)("returns any animal to a %s", async (role) => {
    findUnique.mockResolvedValue(stored);

    expect((await getAnimal(1, { id: 2, role })).name).toBe("Luna");
  });

  it("rejects another owner's animal with status 403", async () => {
    findUnique.mockResolvedValue(stored);

    await expect(getAnimal(1, { id: OTHER_OWNER_ID, role: "OWNER" })).rejects.toMatchObject({
      status: 403,
    });
  });

  it("returns status 404 for an unknown animal", async () => {
    findUnique.mockResolvedValue(null);

    await expect(getAnimal(99, { id: OWNER_ID, role: "OWNER" })).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("createAnimal", () => {
  it("assigns the animal to the logged-in owner", async () => {
    create.mockResolvedValue(stored);

    await createAnimal(input, OWNER_ID);

    expect(create.mock.calls[0][0].data).toMatchObject({
      ownerId: OWNER_ID,
      dateOfBirth: new Date("2021-04-12"),
    });
  });

  it("rejects a microchip number already in the system with status 409", async () => {
    create.mockRejectedValue(prismaError("P2002"));

    await expect(createAnimal(input, OWNER_ID)).rejects.toMatchObject({
      status: 409,
      details: [{ field: "microchipNumber", message: "Ta številka čipa je že v sistemu" }],
    });
  });
});

describe("updateAnimal", () => {
  it("updates the owner's animal", async () => {
    findUnique.mockResolvedValue(stored);
    update.mockResolvedValue({ ...stored, name: "Lunica" });

    expect((await updateAnimal(1, input, OWNER_ID)).name).toBe("Lunica");
  });

  it("does not update another owner's animal", async () => {
    findUnique.mockResolvedValue(stored);

    await expect(updateAnimal(1, input, OTHER_OWNER_ID)).rejects.toMatchObject({ status: 403 });
    expect(update).not.toHaveBeenCalled();
  });

  it("rejects a microchip number already in the system with status 409", async () => {
    findUnique.mockResolvedValue(stored);
    update.mockRejectedValue(prismaError("P2002"));

    await expect(updateAnimal(1, input, OWNER_ID)).rejects.toMatchObject({ status: 409 });
  });
});

describe("deleteAnimal", () => {
  it("deletes an animal without records", async () => {
    findUnique.mockResolvedValue(stored);

    await deleteAnimal(1, OWNER_ID);

    expect(remove).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("does not delete an animal with records", async () => {
    const vaccinated = { ...stored, _count: { ...noRecords, vaccinations: 1 } };
    findUnique.mockResolvedValue(vaccinated);

    await expect(deleteAnimal(1, OWNER_ID)).rejects.toMatchObject({ status: 409 });
    expect(remove).not.toHaveBeenCalled();
  });

  it("does not delete another owner's animal", async () => {
    findUnique.mockResolvedValue(stored);

    await expect(deleteAnimal(1, OTHER_OWNER_ID)).rejects.toMatchObject({ status: 403 });
    expect(remove).not.toHaveBeenCalled();
  });

  it("returns status 409 when a record is added during deletion", async () => {
    findUnique.mockResolvedValue(stored);
    remove.mockRejectedValue(prismaError("P2003"));

    await expect(deleteAnimal(1, OWNER_ID)).rejects.toMatchObject({ status: 409 });
  });
});
