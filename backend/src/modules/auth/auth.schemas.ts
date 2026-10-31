import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;
// bcrypt ignores everything after the first 72 bytes
const MAX_PASSWORD_BYTES = 72;

const normalizedEmail = (message: string) => z.string({ error: message }).trim().toLowerCase();

export const registerSchema = z.object({
  firstName: z.string({ error: "Ime je obvezno" }).trim().min(1, "Ime je obvezno"),
  lastName: z.string({ error: "Priimek je obvezen" }).trim().min(1, "Priimek je obvezen"),
  email: normalizedEmail("E-poštni naslov ni veljaven").pipe(
    z.email("E-poštni naslov ni veljaven"),
  ),
  password: z
    .string({ error: "Geslo je obvezno" })
    .min(MIN_PASSWORD_LENGTH, `Geslo mora imeti najmanj ${MIN_PASSWORD_LENGTH} znakov`)
    .refine((password) => Buffer.byteLength(password) <= MAX_PASSWORD_BYTES, "Geslo je predolgo"),
});

// No format rules here: a wrong address must get the same response as a wrong password
export const loginSchema = z.object({
  email: normalizedEmail("E-poštni naslov je obvezen").min(1, "E-poštni naslov je obvezen"),
  password: z.string({ error: "Geslo je obvezno" }).min(1, "Geslo je obvezno"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
