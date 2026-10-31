import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./auth.schemas.js";

const valid = {
  firstName: "Ana",
  lastName: "Horvat",
  email: "Ana@Primer.si ",
  password: "geslo1234",
};

function fieldsWithErrors(input: unknown) {
  const result = registerSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
}

describe("registerSchema", () => {
  it("normalizes the email address", () => {
    expect(registerSchema.parse(valid).email).toBe("ana@primer.si");
  });

  it("reports every missing field", () => {
    expect(fieldsWithErrors({})).toEqual(["firstName", "lastName", "email", "password"]);
  });

  it("rejects an invalid email address", () => {
    expect(fieldsWithErrors({ ...valid, email: "ni-naslov" })).toEqual(["email"]);
  });

  it("requires at least 8 characters in the password", () => {
    expect(fieldsWithErrors({ ...valid, password: "1234567" })).toEqual(["password"]);
    expect(fieldsWithErrors({ ...valid, password: "12345678" })).toEqual([]);
  });

  it("rejects a password longer than 72 bytes", () => {
    expect(fieldsWithErrors({ ...valid, password: "a".repeat(73) })).toEqual(["password"]);
  });

  it("drops a role sent by the client", () => {
    expect(registerSchema.parse({ ...valid, role: "ADMIN" })).not.toHaveProperty("role");
  });
});

describe("loginSchema", () => {
  it("accepts an address of any format", () => {
    expect(loginSchema.safeParse({ email: "ni-naslov", password: "x" }).success).toBe(true);
  });

  it("requires both fields", () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
  });
});
