import { describe, expect, it } from "vitest";
import { getVaccinationStatus, selectDueVaccinations } from "./vaccinations.rules.js";

const TODAY = "2026-03-10";

function vaccination(animalId: number, vaccineId: number, nextDueDate: string) {
  return { animalId, vaccineId, nextDueDate: new Date(nextDueDate) };
}

describe("getVaccinationStatus", () => {
  it("is overdue when the due date is in the past", () => {
    expect(getVaccinationStatus("2026-03-09", TODAY)).toBe("OVERDUE");
  });

  it("is due soon on the due date itself", () => {
    expect(getVaccinationStatus("2026-03-10", TODAY)).toBe("DUE_SOON");
  });

  it("is due soon on the 30th day", () => {
    expect(getVaccinationStatus("2026-04-09", TODAY)).toBe("DUE_SOON");
  });

  it("is valid from the 31st day", () => {
    expect(getVaccinationStatus("2026-04-10", TODAY)).toBe("VALID");
  });
});

describe("selectDueVaccinations", () => {
  it("keeps overdue and soon due vaccinations, oldest due date first", () => {
    const due = selectDueVaccinations(
      [
        vaccination(1, 1, "2026-04-09"),
        vaccination(2, 1, "2025-01-01"),
        vaccination(3, 1, "2026-03-10"),
      ],
      TODAY,
    );

    expect(due.map(({ animalId }) => animalId)).toEqual([2, 3, 1]);
  });

  it("leaves out vaccinations due from the 31st day", () => {
    expect(selectDueVaccinations([vaccination(1, 1, "2026-04-10")], TODAY)).toEqual([]);
  });

  it("ignores an expired vaccination replaced by a later dose", () => {
    const due = selectDueVaccinations(
      [vaccination(1, 1, "2027-03-01"), vaccination(1, 1, "2025-03-01")],
      TODAY,
    );

    expect(due).toEqual([]);
  });

  it("treats each vaccine and each animal separately", () => {
    const due = selectDueVaccinations(
      [
        vaccination(1, 1, "2027-03-01"),
        vaccination(1, 2, "2025-03-01"),
        vaccination(2, 1, "2025-04-01"),
      ],
      TODAY,
    );

    expect(due.map(({ animalId, vaccineId }) => [animalId, vaccineId])).toEqual([
      [1, 2],
      [2, 1],
    ]);
  });
});
