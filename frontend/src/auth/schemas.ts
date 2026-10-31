import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "Ime je obvezno"),
  lastName: z.string().trim().min(1, "Priimek je obvezen"),
  email: z.string().trim().pipe(z.email("E-poštni naslov ni veljaven")),
  password: z.string().min(8, "Geslo mora imeti najmanj 8 znakov"),
});

export const loginSchema = z.object({
  email: z.string().trim().min(1, "E-poštni naslov je obvezen"),
  password: z.string().min(1, "Geslo je obvezno"),
});
