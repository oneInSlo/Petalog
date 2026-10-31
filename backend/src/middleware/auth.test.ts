import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../modules/auth/auth.token.js";
import { requireAuth, requireRole } from "./auth.js";

vi.mock("../config/index.js", () => ({ env: { JWT_SECRET: "secret" } }));
vi.mock("../lib/prisma.js", () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));

const findUnique = vi.mocked(prisma.user.findUnique);
const res = {} as Response;

const storedUser = {
  id: 1,
  firstName: "Ana",
  lastName: "Horvat",
  email: "ana@primer.si",
  phone: null,
  role: "VETERINARIAN" as const,
  isActive: true,
  createdAt: new Date(),
  passwordHash: "hash",
};

const notLoggedIn = { status: 401, message: "Niste prijavljeni" };

function requestWithToken(token?: string) {
  return { cookies: token ? { token } : {} } as unknown as Request;
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("requireAuth", () => {
  const validToken = signToken({ userId: 1, role: "VETERINARIAN" }, "secret");

  it("rejects a request without a token", async () => {
    const next = vi.fn();

    await expect(requireAuth(requestWithToken(), res, next)).rejects.toMatchObject(notLoggedIn);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an invalid token", async () => {
    const next = vi.fn();
    const forged = signToken({ userId: 1, role: "ADMIN" }, "other");

    await expect(requireAuth(requestWithToken(forged), res, next)).rejects.toMatchObject(
      notLoggedIn,
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects a valid token of a deactivated user", async () => {
    findUnique.mockResolvedValue({ ...storedUser, isActive: false });
    const next = vi.fn();

    await expect(requireAuth(requestWithToken(validToken), res, next)).rejects.toMatchObject(
      notLoggedIn,
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches the user to the request for a valid token", async () => {
    findUnique.mockResolvedValue(storedUser);
    const req = requestWithToken(validToken);
    const next = vi.fn();

    await requireAuth(req, res, next);

    expect(req.user?.id).toBe(1);
    expect(req.user).not.toHaveProperty("passwordHash");
    expect(next).toHaveBeenCalledOnce();
  });
});

describe("requireRole", () => {
  it("allows a user with one of the given roles", () => {
    const next = vi.fn();
    const req = { user: storedUser } as unknown as Request;

    requireRole("ADMIN", "VETERINARIAN")(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("rejects a user with another role with status 403", () => {
    const next = vi.fn();
    const req = { user: storedUser } as unknown as Request;

    expect(() => requireRole("ADMIN")(req, res, next)).toThrow(
      expect.objectContaining({ status: 403, message: "Nimate zadostnih pravic" }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects a request without a user with status 401", () => {
    const next = vi.fn();

    expect(() => requireRole("ADMIN")({} as Request, res, next)).toThrow(
      expect.objectContaining(notLoggedIn),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
