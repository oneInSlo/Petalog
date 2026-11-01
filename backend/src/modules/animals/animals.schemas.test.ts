import { afterEach, describe, expect, it, vi } from "vitest";
import { animalSchema, animalSearchSchema } from "./animals.schemas.js";

const valid = { name: "Luna", species: "DOG", sex: "FEMALE" };

function fieldsWithErrors(input: unknown) {
  const result = animalSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
}

afterEach(() => {
  vi.useRealTimers();
});

describe("animalSearchSchema", () => {
  it.each([{}, { q: "a" }, { q: " a " }])("requires at least 2 characters in %j", (input) => {
    expect(animalSearchSchema.safeParse(input).success).toBe(false);
  });

  it("trims the search text", () => {
    expect(animalSearchSchema.parse({ q: " lu " }).q).toBe("lu");
  });
});

describe("animalSchema", () => {
  it("requires only name, species and sex", () => {
    expect(fieldsWithErrors({})).toEqual(["name", "species", "sex"]);
    expect(fieldsWithErrors(valid)).toEqual([]);
  });

  it("stores empty optional fields as null", () => {
    const animal = animalSchema.parse({
      ...valid,
      breed: " ",
      dateOfBirth: "",
      microchipNumber: "",
    });

    expect(animal).toMatchObject({ breed: null, dateOfBirth: null, microchipNumber: null });
  });

  it("rejects an unknown species and sex", () => {
    expect(fieldsWithErrors({ ...valid, species: "DRAGON", sex: "X" })).toEqual(["species", "sex"]);
  });

  it("rejects a date of birth that is not a real date", () => {
    expect(fieldsWithErrors({ ...valid, dateOfBirth: "2026-02-30" })).toEqual(["dateOfBirth"]);
  });

  it("rejects a future date of birth by the clinic's calendar day", () => {
    vi.useFakeTimers();
    // 23:30 UTC is already the next day in Ljubljana
    vi.setSystemTime(new Date("2026-03-10T23:30:00Z"));

    expect(fieldsWithErrors({ ...valid, dateOfBirth: "2026-03-11" })).toEqual([]);
    expect(fieldsWithErrors({ ...valid, dateOfBirth: "2026-03-12" })).toEqual(["dateOfBirth"]);
  });

  it("requires exactly 15 digits in the microchip number", () => {
    expect(fieldsWithErrors({ ...valid, microchipNumber: "705000000000001" })).toEqual([]);
    expect(fieldsWithErrors({ ...valid, microchipNumber: "70500000000000" })).toEqual([
      "microchipNumber",
    ]);
    expect(fieldsWithErrors({ ...valid, microchipNumber: "7050000000000011" })).toEqual([
      "microchipNumber",
    ]);
    expect(fieldsWithErrors({ ...valid, microchipNumber: "70500000000000a" })).toEqual([
      "microchipNumber",
    ]);
  });
});
