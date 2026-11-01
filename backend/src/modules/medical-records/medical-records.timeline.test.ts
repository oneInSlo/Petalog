import { describe, expect, it } from "vitest";
import { mergeTimeline } from "./medical-records.timeline.js";

const person = { id: 2, firstName: "Marko", lastName: "Novak" };

function record(id: number, createdAt: string) {
  return {
    id,
    anamnesis: "A",
    diagnosis: "D",
    therapy: null,
    status: "CLOSED" as const,
    closedAt: new Date(createdAt),
    createdAt: new Date(createdAt),
    veterinarian: person,
    addenda: [],
  };
}

function vaccination(id: number, vaccinationDate: string, createdAt: string) {
  return {
    id,
    vaccinationDate: new Date(vaccinationDate),
    nextDueDate: new Date("2027-01-01"),
    batchNumber: null,
    createdAt: new Date(createdAt),
    vaccine: { id: 1, name: "Steklina" },
    veterinarian: person,
  };
}

describe("mergeTimeline", () => {
  it("orders records and vaccinations from newest to oldest", () => {
    const entries = mergeTimeline(
      [record(1, "2026-03-03T10:00:00Z"), record(2, "2025-11-12T10:00:00Z")],
      [vaccination(1, "2026-01-15", "2026-01-15T10:00:00Z")],
    );

    expect(entries.map(({ type, id }) => [type, id])).toEqual([
      ["RECORD", 1],
      ["VACCINATION", 1],
      ["RECORD", 2],
    ]);
  });

  it("gives every entry a date and an author", () => {
    const [entry] = mergeTimeline([], [vaccination(1, "2026-01-15", "2026-01-15T10:00:00Z")]);

    expect(entry).toMatchObject({ type: "VACCINATION", date: "2026-01-15", author: person });
  });

  it("orders by the vaccination date, not the time of entry", () => {
    const entries = mergeTimeline(
      [record(1, "2026-02-01T10:00:00Z")],
      [vaccination(1, "2024-01-01", "2026-03-01T10:00:00Z")],
    );

    expect(entries.map(({ type }) => type)).toEqual(["RECORD", "VACCINATION"]);
  });

  it("puts the later entry first within the same day", () => {
    const entries = mergeTimeline(
      [record(1, "2026-03-03T08:00:00Z")],
      [vaccination(1, "2026-03-03", "2026-03-03T09:00:00Z")],
    );

    expect(entries.map(({ type }) => type)).toEqual(["VACCINATION", "RECORD"]);
  });

  it("dates a record by the calendar day at the clinic", () => {
    const [entry] = mergeTimeline([record(1, "2026-03-10T23:30:00Z")], []);

    expect(entry.date).toBe("2026-03-11");
  });
});
