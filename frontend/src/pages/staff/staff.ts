import { z } from "zod";
import { roleLabels, type Role } from "../../auth/roles";
import { registerSchema } from "../../auth/schemas";
import type { Tone } from "../../components/ui/tones";

export const staffRoles = ["RECEPTIONIST", "VETERINARIAN", "ADMIN"] as const;

export type StaffRole = (typeof staffRoles)[number];

export type StaffMember = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  isActive: boolean;
};

export const roleTones: Record<StaffRole, Tone> = {
  RECEPTIONIST: "neutral",
  VETERINARIAN: "primary",
  ADMIN: "accent",
};

export const roleOptions = staffRoles.map((role) => ({ value: role, label: roleLabels[role] }));

export const staffSchema = registerSchema.extend({
  role: z.enum(staffRoles, { error: "Vloga ni veljavna" }),
});
