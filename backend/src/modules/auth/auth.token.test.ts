import jwt, { type JwtPayload } from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { signToken, verifyToken } from "./auth.token.js";

describe("signToken", () => {
  it("contains the user id and role and expires after 8 hours", () => {
    const token = signToken({ userId: 7, role: "OWNER" }, "secret");
    const payload = jwt.verify(token, "secret") as JwtPayload;

    expect(payload.userId).toBe(7);
    expect(payload.role).toBe("OWNER");
    expect(payload.exp! - payload.iat!).toBe(8 * 60 * 60);
  });
});

describe("verifyToken", () => {
  it("returns the payload of a valid token", () => {
    const token = signToken({ userId: 7, role: "OWNER" }, "secret");

    expect(verifyToken(token, "secret")?.userId).toBe(7);
  });

  it("rejects a token signed with another secret", () => {
    const token = signToken({ userId: 7, role: "OWNER" }, "other");

    expect(verifyToken(token, "secret")).toBeNull();
  });

  it("rejects an expired token", () => {
    const token = jwt.sign({ userId: 7, role: "OWNER" }, "secret", { expiresIn: -1 });

    expect(verifyToken(token, "secret")).toBeNull();
  });

  it("rejects a malformed token", () => {
    expect(verifyToken("not-a-token", "secret")).toBeNull();
  });
});
