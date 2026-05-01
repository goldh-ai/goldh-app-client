import type { PlanTier } from "@shared/types";

export function normalizePlanTier(
  value: string | null | undefined,
): PlanTier | null {
  if (
    value === "free" ||
    value === "essential" ||
    value === "pro" ||
    value === "elite" ||
    value === "admin"
  ) {
    return value;
  }
  return null;
}
