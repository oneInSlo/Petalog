import { describe, expect, it } from "vitest";
import { parseEnv } from "./env.js";

const required = { DATABASE_URL: "postgresql://db", JWT_SECRET: "secret" };

describe("parseEnv", () => {
  it("uses the default port and converts a given port to a number", () => {
    expect(parseEnv(required).PORT).toBe(3000);
    expect(parseEnv({ ...required, PORT: "4000" }).PORT).toBe(4000);
  });

  it("rejects a missing database URL", () => {
    expect(() => parseEnv({ JWT_SECRET: "secret" })).toThrow();
  });

  it("rejects a missing JWT secret", () => {
    expect(() => parseEnv({ DATABASE_URL: "postgresql://db" })).toThrow();
  });
});
