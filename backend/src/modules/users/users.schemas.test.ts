import { describe, expect, it } from "vitest";
import { createStaffSchema, listStaffSchema, userIdSchema } from "./users.schemas.js";

const valid = {
  firstName: "Ana",
  lastName: "Kovač",
  email: "ana@primer.si",
  password: "geslo1234",
};

describe("createStaffSchema", () => {
  it("accepts every staff role", () => {
    for (const role of ["RECEPTIONIST", "VETERINARIAN", "ADMIN"]) {
      expect(createStaffSchema.safeParse({ ...valid, role }).success).toBe(true);
    }
  });

  it("rejects the owner role", () => {
    expect(createStaffSchema.safeParse({ ...valid, role: "OWNER" }).success).toBe(false);
  });

  it("requires a role", () => {
    expect(createStaffSchema.safeParse(valid).success).toBe(false);
  });
});

describe("listStaffSchema", () => {
  it("does not require a role", () => {
    expect(listStaffSchema.parse({})).toEqual({});
  });

  it("rejects an unknown role", () => {
    expect(listStaffSchema.safeParse({ role: "OWNER" }).success).toBe(false);
  });
});

describe("userIdSchema", () => {
  it("converts a valid id and rejects an invalid one", () => {
    expect(userIdSchema.parse({ id: "5" }).id).toBe(5);
    expect(userIdSchema.safeParse({ id: "abc" }).success).toBe(false);
  });
});
