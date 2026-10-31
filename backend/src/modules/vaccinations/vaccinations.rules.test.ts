import { describe, expect, it } from "vitest";
import { getVaccinationStatus } from "./vaccinations.rules.js";

const TODAY = "2026-03-10";

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
