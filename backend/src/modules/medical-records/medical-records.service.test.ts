import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../lib/prisma.js";
import {
  addAddendum,
  closeMedicalRecord,
  createMedicalRecord,
  getTimeline,
  updateMedicalRecord,
} from "./medical-records.service.js";

vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    animal: { findUnique: vi.fn() },
    medicalRecord: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
    recordAddendum: { create: vi.fn() },
    vaccination: { findMany: vi.fn() },
  },
}));

const findAnimal = vi.mocked(prisma.animal.findUnique);
const createInDb = vi.mocked(prisma.medicalRecord.create);
const findInDb = vi.mocked(prisma.medicalRecord.findUnique);
const updateInDb = vi.mocked(prisma.medicalRecord.update);
const createAddendum = vi.mocked(prisma.recordAddendum.create);

const AUTHOR_ID = 2;
const OTHER_VET_ID = 6;

const input = { anamnesis: "Praskanje ušesa", diagnosis: "Vnetje", therapy: null };

const person = { id: AUTHOR_ID, firstName: "Marko", lastName: "Novak" };

const draft = {
  id: 1,
  animalId: 1,
  veterinarianId: AUTHOR_ID,
  ...input,
  status: "DRAFT" as const,
  closedAt: null,
  createdAt: new Date(),
  veterinarian: person,
  addenda: [],
};
const closed = { ...draft, status: "CLOSED" as const, closedAt: new Date() };

beforeEach(() => {
  vi.resetAllMocks();
});

describe("createMedicalRecord", () => {
  it("stores the record under the logged-in veterinarian", async () => {
    findAnimal.mockResolvedValue({ id: 1 } as never);
    createInDb.mockResolvedValue(draft);

    await createMedicalRecord(1, input, { id: AUTHOR_ID, role: "VETERINARIAN" });

    expect(createInDb.mock.calls[0][0].data).toEqual({
      ...input,
      animalId: 1,
      veterinarianId: AUTHOR_ID,
    });
  });

  it("returns status 404 for an unknown animal", async () => {
    findAnimal.mockResolvedValue(null);

    await expect(
      createMedicalRecord(99, input, { id: AUTHOR_ID, role: "VETERINARIAN" }),
    ).rejects.toMatchObject({ status: 404 });
  });
});

describe("updateMedicalRecord", () => {
  it("updates a draft only while it is still a draft", async () => {
    findInDb.mockResolvedValue(draft);
    updateInDb.mockResolvedValue(draft);

    await updateMedicalRecord(1, input, AUTHOR_ID);

    expect(updateInDb.mock.calls[0][0].where).toEqual({ id: 1, status: "DRAFT" });
  });

  it.each([AUTHOR_ID, OTHER_VET_ID])("rejects a closed record with status 409", async (vetId) => {
    findInDb.mockResolvedValue(closed);

    await expect(updateMedicalRecord(1, input, vetId)).rejects.toMatchObject({ status: 409 });
    expect(updateInDb).not.toHaveBeenCalled();
  });

  it("returns status 409 when the record is closed during the update", async () => {
    findInDb.mockResolvedValue(draft);
    updateInDb.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Not found", {
        code: "P2025",
        clientVersion: "test",
      }),
    );

    await expect(updateMedicalRecord(1, input, AUTHOR_ID)).rejects.toMatchObject({ status: 409 });
  });

  it("rejects another veterinarian's draft with status 403", async () => {
    findInDb.mockResolvedValue(draft);

    await expect(updateMedicalRecord(1, input, OTHER_VET_ID)).rejects.toMatchObject({
      status: 403,
    });
  });

  it("returns status 404 for an unknown record", async () => {
    findInDb.mockResolvedValue(null);

    await expect(updateMedicalRecord(99, input, AUTHOR_ID)).rejects.toMatchObject({ status: 404 });
  });
});

describe("closeMedicalRecord", () => {
  it("records the closing time", async () => {
    findInDb.mockResolvedValue(draft);
    updateInDb.mockResolvedValue(closed);

    await closeMedicalRecord(1, AUTHOR_ID);

    expect(updateInDb.mock.calls[0][0].data).toEqual({
      status: "CLOSED",
      closedAt: expect.any(Date),
    });
  });

  it("allows only the author to close", async () => {
    findInDb.mockResolvedValue(draft);

    await expect(closeMedicalRecord(1, OTHER_VET_ID)).rejects.toMatchObject({ status: 403 });
    expect(updateInDb).not.toHaveBeenCalled();
  });

  it("rejects closing a closed record with status 409", async () => {
    findInDb.mockResolvedValue(closed);

    await expect(closeMedicalRecord(1, AUTHOR_ID)).rejects.toMatchObject({ status: 409 });
  });
});

describe("getTimeline", () => {
  const findRecords = vi.mocked(prisma.medicalRecord.findMany);
  const findVaccinations = vi.mocked(prisma.vaccination.findMany);
  const veterinarian = { id: AUTHOR_ID, role: "VETERINARIAN" as const };
  const owner = { id: 4, role: "OWNER" as const };

  beforeEach(() => {
    findAnimal.mockResolvedValue({ id: 1, ownerId: 4 } as never);
    findRecords.mockResolvedValue([]);
    findVaccinations.mockResolvedValue([]);
  });

  it("shows drafts to a veterinarian", async () => {
    await getTimeline(1, {}, veterinarian);

    expect(findRecords.mock.calls[0][0]?.where).toEqual({ animalId: 1 });
  });

  it("hides drafts from the owner", async () => {
    await getTimeline(1, {}, owner);

    expect(findRecords.mock.calls[0][0]?.where).toEqual({ animalId: 1, status: "CLOSED" });
  });

  it("rejects another owner with status 403", async () => {
    await expect(getTimeline(1, {}, { id: 5, role: "OWNER" })).rejects.toMatchObject({
      status: 403,
    });
    expect(findRecords).not.toHaveBeenCalled();
  });

  it("reads only the requested type of entry", async () => {
    await getTimeline(1, { type: "RECORD" }, veterinarian);
    expect(findVaccinations).not.toHaveBeenCalled();

    findRecords.mockClear();
    await getTimeline(1, { type: "VACCINATION" }, veterinarian);
    expect(findRecords).not.toHaveBeenCalled();
  });
});

describe("addAddendum", () => {
  it("lets any veterinarian add to a closed record without changing it", async () => {
    findInDb.mockResolvedValue(closed);
    createAddendum.mockResolvedValue({
      id: 1,
      recordId: 1,
      authorId: OTHER_VET_ID,
      content: "Izvid",
      createdAt: new Date(),
    });

    await addAddendum(1, { content: "Izvid" }, OTHER_VET_ID);

    expect(createAddendum.mock.calls[0][0].data).toEqual({
      recordId: 1,
      authorId: OTHER_VET_ID,
      content: "Izvid",
    });
    expect(updateInDb).not.toHaveBeenCalled();
  });

  it("rejects an addendum to a draft with status 409", async () => {
    findInDb.mockResolvedValue(draft);

    await expect(addAddendum(1, { content: "Izvid" }, AUTHOR_ID)).rejects.toMatchObject({
      status: 409,
    });
    expect(createAddendum).not.toHaveBeenCalled();
  });
});
