import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../lib/prisma.js";
import { loginUser, registerOwner } from "./auth.service.js";

vi.mock("../../lib/prisma.js", () => ({
  prisma: { user: { create: vi.fn(), findUnique: vi.fn() } },
}));

const create = vi.mocked(prisma.user.create);
const findUnique = vi.mocked(prisma.user.findUnique);

const input = {
  firstName: "Ana",
  lastName: "Horvat",
  email: "ana@primer.si",
  password: "geslo1234",
};

const storedUser = {
  id: 1,
  firstName: "Ana",
  lastName: "Horvat",
  email: "ana@primer.si",
  phone: null,
  role: "OWNER" as const,
  isActive: true,
  createdAt: new Date(),
  passwordHash: bcrypt.hashSync("geslo1234", 4),
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("registerOwner", () => {
  it("always creates an owner and stores only a hash of the password", async () => {
    create.mockResolvedValue(storedUser);

    await registerOwner(input);

    const { data } = create.mock.calls[0][0];
    expect(data.role).toBe("OWNER");
    expect(data).not.toHaveProperty("password");
    expect(await bcrypt.compare(input.password, data.passwordHash)).toBe(true);
  });

  it("does not return the password hash", async () => {
    create.mockResolvedValue(storedUser);

    expect(await registerOwner(input)).not.toHaveProperty("passwordHash");
  });

  it("rejects an existing email address with status 409", async () => {
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "test",
      }),
    );

    await expect(registerOwner(input)).rejects.toMatchObject({
      status: 409,
      message: "Uporabnik s tem e-poštnim naslovom že obstaja",
      details: [{ field: "email", message: "Uporabnik s tem e-poštnim naslovom že obstaja" }],
    });
  });
});

describe("loginUser", () => {
  const credentials = { email: input.email, password: input.password };
  const invalidLogin = { status: 401, message: "Napačen e-poštni naslov ali geslo" };

  it("returns the user without the password hash for correct credentials", async () => {
    findUnique.mockResolvedValue(storedUser);

    const user = await loginUser(credentials);

    expect(user.id).toBe(1);
    expect(user).not.toHaveProperty("passwordHash");
  });

  it("gives the same error for an unknown address and a wrong password", async () => {
    findUnique.mockResolvedValue(null);
    await expect(loginUser(credentials)).rejects.toMatchObject(invalidLogin);

    findUnique.mockResolvedValue(storedUser);
    await expect(loginUser({ ...credentials, password: "napacno1" })).rejects.toMatchObject(
      invalidLogin,
    );
  });

  it("rejects a deactivated user", async () => {
    findUnique.mockResolvedValue({ ...storedUser, isActive: false });

    await expect(loginUser(credentials)).rejects.toMatchObject(invalidLogin);
  });
});
