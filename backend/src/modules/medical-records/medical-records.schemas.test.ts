import { describe, expect, it } from "vitest";
import { addendumSchema, medicalRecordSchema } from "./medical-records.schemas.js";

function fieldsWithErrors(input: unknown) {
  const result = medicalRecordSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
}

describe("medicalRecordSchema", () => {
  it("requires anamnesis and diagnosis", () => {
    expect(fieldsWithErrors({})).toEqual(["anamnesis", "diagnosis"]);
    expect(fieldsWithErrors({ anamnesis: "  ", diagnosis: "  " })).toEqual([
      "anamnesis",
      "diagnosis",
    ]);
  });

  it.each([undefined, "", "   "])("stores the optional therapy %j as null", (therapy) => {
    const record = medicalRecordSchema.parse({ anamnesis: "A", diagnosis: "D", therapy });

    expect(record.therapy).toBeNull();
  });
});

describe("addendumSchema", () => {
  it("requires content", () => {
    expect(addendumSchema.safeParse({ content: "  " }).success).toBe(false);
    expect(addendumSchema.parse({ content: " Izvid " }).content).toBe("Izvid");
  });
});
