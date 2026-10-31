import { z } from "zod";
import { todayAtClinic } from "../../lib/dates.js";

const emptyToNull = (value: unknown) =>
  value === undefined || (typeof value === "string" && value.trim() === "") ? null : value;

export const vaccinationSchema = z.object({
  vaccineId: z.number({ error: "Cepivo je obvezno" }).int("Cepivo je obvezno").positive(),
  vaccinationDate: z.preprocess(
    (value) => emptyToNull(value) ?? todayAtClinic(),
    z.iso
      .date({ error: "Datum cepljenja ni veljaven" })
      .refine((date) => date <= todayAtClinic(), "Datum cepljenja ne sme biti v prihodnosti"),
  ),
  batchNumber: z.preprocess(emptyToNull, z.string({ error: "Serijska številka ni veljavna" }).trim().nullable()),
});

export type VaccinationInput = z.infer<typeof vaccinationSchema>;
