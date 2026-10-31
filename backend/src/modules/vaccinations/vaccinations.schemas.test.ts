import { afterEach, describe, expect, it, vi } from "vitest";
import { vaccinationSchema } from "./vaccinations.schemas.js";

function fieldsWithErrors(input: unknown) {
  const result = vaccinationSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
}

afterEach(() => {
  vi.useRealTimers();
});

describe("vaccinationSchema", () => {
  it("requires a vaccine", () => {
    expect(fieldsWithErrors({})).toEqual(["vaccineId"]);
  });

  it("defaults the date to today at the clinic", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T23:30:00Z"));

    expect(vaccinationSchema.parse({ vaccineId: 1 }).vaccinationDate).toBe("2026-03-11");
    expect(vaccinationSchema.parse({ vaccineId: 1, vaccinationDate: "" }).vaccinationDate).toBe(
      "2026-03-11",
    );
  });

  it("allows today and rejects a future date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T12:00:00Z"));

    expect(fieldsWithErrors({ vaccineId: 1, vaccinationDate: "2026-03-10" })).toEqual([]);
    expect(fieldsWithErrors({ vaccineId: 1, vaccinationDate: "2026-03-11" })).toEqual([
      "vaccinationDate",
    ]);
  });

  it("rejects a date that does not exist", () => {
    expect(fieldsWithErrors({ vaccineId: 1, vaccinationDate: "2026-02-30" })).toEqual([
      "vaccinationDate",
    ]);
  });

  it("stores an empty batch number as null", () => {
    expect(vaccinationSchema.parse({ vaccineId: 1, batchNumber: " " }).batchNumber).toBeNull();
  });
});
