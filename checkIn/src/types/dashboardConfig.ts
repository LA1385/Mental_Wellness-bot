import type { Tier } from "./dashboard";

export const tierMeta: Record<
  Tier,
  { label: string; color: string; softColor: string }
> = {
  minimal_mild: { label: "Mild", color: "sage", softColor: "sage-soft" },
  moderate: { label: "Moderate", color: "amber", softColor: "amber-soft" },
  severe: { label: "Severe", color: "coral", softColor: "coral-soft" },
};

export const tierOrder: Tier[] = ["minimal_mild", "moderate", "severe"];

export const tierTextClasses: Record<Tier, string> = {
  minimal_mild: "text-sage",
  moderate: "text-amber",
  severe: "text-coral",
};

export const tierBarClasses: Record<Tier, string> = {
  minimal_mild: "bg-sage",
  moderate: "bg-amber",
  severe: "bg-coral",
};

export const tierSoftClasses: Record<Tier, string> = {
  minimal_mild: "bg-sage-soft",
  moderate: "bg-amber-soft",
  severe: "bg-coral-soft",
};
