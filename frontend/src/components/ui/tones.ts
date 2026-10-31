export type Tone = "ok" | "warn" | "bad" | "neutral" | "primary" | "accent";

export const toneClasses: Record<Tone, string> = {
  ok: "bg-ok text-ok-fg",
  warn: "bg-warn text-warn-fg",
  bad: "bg-bad text-bad-fg",
  neutral: "bg-neutral text-neutral-fg",
  primary: "bg-primary-tint text-primary",
  accent: "bg-accent-tint text-warn-fg",
};
