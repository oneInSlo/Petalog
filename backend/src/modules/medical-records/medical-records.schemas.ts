import { z } from "zod";

const emptyToNull = (value: unknown) =>
  value === undefined || (typeof value === "string" && value.trim() === "") ? null : value;

function requiredText(message: string) {
  return z.string({ error: message }).trim().min(1, message);
}

export const medicalRecordSchema = z.object({
  anamnesis: requiredText("Anamneza je obvezna"),
  diagnosis: requiredText("Diagnoza je obvezna"),
  therapy: z.preprocess(
    emptyToNull,
    z.string({ error: "Terapija ni veljavna" }).trim().nullable(),
  ),
});

export const addendumSchema = z.object({
  content: requiredText("Vsebina dodatka je obvezna"),
});

export type MedicalRecordInput = z.infer<typeof medicalRecordSchema>;
export type AddendumInput = z.infer<typeof addendumSchema>;
