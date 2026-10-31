import { z } from "zod";
import { idParamSchema } from "../../lib/validation.js";
import { accountSchema } from "../auth/auth.schemas.js";

const staffRole = z.enum(["RECEPTIONIST", "VETERINARIAN", "ADMIN"], {
  error: "Vloga ni veljavna",
});

export const createStaffSchema = accountSchema.extend({ role: staffRole });

export const listStaffSchema = z.object({ role: staffRole.optional() });

export const userIdSchema = idParamSchema;

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type ListStaffFilter = z.infer<typeof listStaffSchema>;
