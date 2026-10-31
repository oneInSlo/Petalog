import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../lib/prisma.js";
import { activateStaff, createStaff, deactivateStaff, listStaff } from "./users.service.js";

vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    user: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
  },
}));

const create = vi.mocked(prisma.user.create);
const findMany = vi.mocked(prisma.user.findMany);
const findUnique = vi.mocked(prisma.user.findUnique);
const update = vi.mocked(prisma.user.update);

const veterinarian = {
  id: 2,
  firstName: "Marko",
  lastName: "Novak",
  email: "marko@primer.si",
  phone: null,
  role: "VETERINARIAN" as const,
  isActive: true,
  createdAt: new Date(),
  passwordHash: "hash",
};

const input = {
  firstName: "Marko",
  lastName: "Novak",
  email: "marko@primer.si",
  password: "geslo1234",
  role: "VETERINARIAN" as const,
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("createStaff", () => {
  it("creates an account with the given role and does not return the hash", async () => {
    create.mockResolvedValue(veterinarian);

    const user = await createStaff(input);

    expect(create.mock.calls[0][0].data.role).toBe("VETERINARIAN");
    expect(user).not.toHaveProperty("passwordHash");
    expect(user.isActive).toBe(true);
  });

  it("rejects an existing email address with status 409", async () => {
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "test",
      }),
    );

    await expect(createStaff(input)).rejects.toMatchObject({ status: 409 });
  });
});

describe("listStaff", () => {
  it("excludes owners when no role is given", async () => {
    findMany.mockResolvedValue([veterinarian]);

    const users = await listStaff({});

    expect(findMany.mock.calls[0][0]?.where).toEqual({ role: { not: "OWNER" } });
    expect(users[0]).not.toHaveProperty("passwordHash");
  });

  it("filters by the given role", async () => {
    findMany.mockResolvedValue([]);

    await listStaff({ role: "ADMIN" });

    expect(findMany.mock.calls[0][0]?.where).toEqual({ role: "ADMIN" });
  });
});

describe("deactivateStaff", () => {
  it("deactivates a staff member", async () => {
    findUnique.mockResolvedValue(veterinarian);
    update.mockResolvedValue({ ...veterinarian, isActive: false });

    const user = await deactivateStaff(2, 1);

    expect(update).toHaveBeenCalledWith({ where: { id: 2 }, data: { isActive: false } });
    expect(user.isActive).toBe(false);
  });

  it("does not let an administrator deactivate their own account", async () => {
    await expect(deactivateStaff(1, 1)).rejects.toMatchObject({ status: 409 });
    expect(update).not.toHaveBeenCalled();
  });

  it("does not deactivate an owner", async () => {
    findUnique.mockResolvedValue({ ...veterinarian, role: "OWNER" });

    await expect(deactivateStaff(2, 1)).rejects.toMatchObject({ status: 404 });
    expect(update).not.toHaveBeenCalled();
  });

  it("returns status 404 for an unknown user", async () => {
    findUnique.mockResolvedValue(null);

    await expect(deactivateStaff(99, 1)).rejects.toMatchObject({ status: 404 });
  });
});

describe("activateStaff", () => {
  it("activates a deactivated staff member", async () => {
    findUnique.mockResolvedValue({ ...veterinarian, isActive: false });
    update.mockResolvedValue(veterinarian);

    const user = await activateStaff(2);

    expect(update).toHaveBeenCalledWith({ where: { id: 2 }, data: { isActive: true } });
    expect(user.isActive).toBe(true);
  });

  it("does not activate an owner", async () => {
    findUnique.mockResolvedValue({ ...veterinarian, role: "OWNER" });

    await expect(activateStaff(2)).rejects.toMatchObject({ status: 404 });
    expect(update).not.toHaveBeenCalled();
  });

  it("returns status 404 for an unknown user", async () => {
    findUnique.mockResolvedValue(null);

    await expect(activateStaff(99)).rejects.toMatchObject({ status: 404 });
  });
});
