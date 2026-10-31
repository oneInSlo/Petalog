import jwt, { type JwtPayload } from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { signToken } from "./auth.token.js";

describe("signToken", () => {
  it("contains the user id and role and expires after 8 hours", () => {
    const token = signToken({ userId: 7, role: "OWNER" }, "secret");
    const payload = jwt.verify(token, "secret") as JwtPayload;

    expect(payload.userId).toBe(7);
    expect(payload.role).toBe("OWNER");
    expect(payload.exp! - payload.iat!).toBe(8 * 60 * 60);
  });
});
