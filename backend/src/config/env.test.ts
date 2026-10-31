import { describe, expect, it } from "vitest";
import { parseEnv } from "./env.js";

describe("parseEnv", () => {
  it("uses the default port and converts a given port to a number", () => {
    expect(parseEnv({ DATABASE_URL: "postgresql://db" }).PORT).toBe(3000);
    expect(parseEnv({ DATABASE_URL: "postgresql://db", PORT: "4000" }).PORT).toBe(4000);
  });

  it("rejects a missing database URL", () => {
    expect(() => parseEnv({})).toThrow();
  });
});
