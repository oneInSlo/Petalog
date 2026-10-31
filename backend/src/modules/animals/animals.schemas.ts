import { Sex, Species } from "@prisma/client";
import { z } from "zod";
import { todayAtClinic } from "../../lib/dates.js";

const emptyToNull = (value: unknown) =>
  value === undefined || (typeof value === "string" && value.trim() === "") ? null : value;

export const animalSchema = z.object({
  name: z.string({ error: "Ime je obvezno" }).trim().min(1, "Ime je obvezno"),
  species: z.enum(Species, { error: "Vrsta je obvezna" }),
  sex: z.enum(Sex, { error: "Spol je obvezen" }),
  breed: z.preprocess(emptyToNull, z.string({ error: "Pasma ni veljavna" }).trim().nullable()),
  dateOfBirth: z.preprocess(
    emptyToNull,
    z.iso
      .date({ error: "Datum rojstva ni veljaven" })
      .refine((date) => date <= todayAtClinic(), "Datum rojstva ne sme biti v prihodnosti")
      .nullable(),
  ),
  microchipNumber: z.preprocess(
    emptyToNull,
    z
      .string({ error: "Številka čipa mora imeti natanko 15 števk" })
      .trim()
      .regex(/^\d{15}$/, "Številka čipa mora imeti natanko 15 števk")
      .nullable(),
  ),
});

export type AnimalInput = z.infer<typeof animalSchema>;
