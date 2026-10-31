import { LayoutDashboard, type LucideIcon } from "lucide-react";

export type Role = "OWNER" | "RECEPTIONIST" | "VETERINARIAN" | "ADMIN";

export type NavItem = { label: string; to: string; icon: LucideIcon };

export const homePaths: Record<Role, string> = {
  OWNER: "/owner",
  RECEPTIONIST: "/receptionist",
  VETERINARIAN: "/veterinarian",
  ADMIN: "/admin",
};

export const roleLabels: Record<Role, string> = {
  OWNER: "Lastnik",
  RECEPTIONIST: "Receptor",
  VETERINARIAN: "Veterinar",
  ADMIN: "Administrator",
};

export function navItems(role: Role): NavItem[] {
  return [{ label: "Nadzorna plošča", to: homePaths[role], icon: LayoutDashboard }];
}
