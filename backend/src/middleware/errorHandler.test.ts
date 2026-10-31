import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { AppError } from "../lib/errors.js";
import { errorHandler } from "./errorHandler.js";

function handle(err: unknown) {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  errorHandler(err, {} as Request, { status } as unknown as Response, vi.fn());
  return { status, json };
}

describe("errorHandler", () => {
  it("returns validation errors per field with status 400", () => {
    const { error } = z.object({ email: z.string() }).safeParse({});
    const { status, json } = handle(error);

    expect(status).toHaveBeenCalledWith(400);
    expect(json.mock.calls[0][0].details[0].field).toBe("email");
  });

  it("returns the status and message of an AppError", () => {
    const { status, json } = handle(new AppError(409, "Konflikt"));

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({ error: "Konflikt" });
  });

  it("hides unexpected errors behind status 500", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { status, json } = handle(new Error("secret detail"));

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: "Notranja napaka strežnika" });
  });
});
