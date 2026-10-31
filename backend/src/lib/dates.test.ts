import { describe, expect, it } from "vitest";
import { addDays, addMonths, calculateAge, todayAtClinic } from "./dates.js";

describe("addMonths", () => {
  it("adds 12 months to the example from the user story", () => {
    expect(addMonths("2026-03-10", 12)).toBe("2027-03-10");
  });

  it("crosses into the next year", () => {
    expect(addMonths("2026-11-15", 6)).toBe("2027-05-15");
  });

  it("uses the last day of a shorter target month", () => {
    expect(addMonths("2026-08-31", 6)).toBe("2027-02-28");
    expect(addMonths("2027-08-31", 6)).toBe("2028-02-29");
  });

  it("moves February 29 to February 28 in a non-leap year", () => {
    expect(addMonths("2028-02-29", 12)).toBe("2029-02-28");
  });
});

describe("addDays", () => {
  it("crosses month and year boundaries", () => {
    expect(addDays("2026-12-15", 30)).toBe("2027-01-14");
  });
});

describe("todayAtClinic", () => {
  it("uses the calendar day in Ljubljana, not in UTC", () => {
    expect(todayAtClinic(new Date("2026-03-10T23:30:00Z"))).toBe("2026-03-11");
  });
});

describe("calculateAge", () => {
  it("counts a full year on the birthday", () => {
    expect(calculateAge("2023-03-10", "2026-03-10")).toEqual({ years: 3, months: 0 });
  });

  it("does not count a year the day before the birthday", () => {
    expect(calculateAge("2023-03-10", "2026-03-09")).toEqual({ years: 2, months: 11 });
  });

  it("counts only completed months", () => {
    expect(calculateAge("2026-01-15", "2026-03-14")).toEqual({ years: 0, months: 1 });
    expect(calculateAge("2026-01-15", "2026-03-15")).toEqual({ years: 0, months: 2 });
  });

  it("returns zero for an animal younger than a month", () => {
    expect(calculateAge("2026-03-01", "2026-03-10")).toEqual({ years: 0, months: 0 });
  });

  it("handles a birth date on February 29", () => {
    expect(calculateAge("2020-02-29", "2021-03-01")).toEqual({ years: 1, months: 0 });
  });
});
