import { z } from "zod";

const emptyToNull = (value: unknown) =>
  value === undefined || (typeof value === "string" && value.trim() === "") ? null : value;

export const allergySchema = z.object({
  allergen: z.string({ error: "Alergen je obvezen" }).trim().min(1, "Alergen je obvezen"),
  description: z.preprocess(
    emptyToNull,
    z.string({ error: "Opis reakcije ni veljaven" }).trim().nullable(),
  ),
});

export type AllergyInput = z.infer<typeof allergySchema>;
