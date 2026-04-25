import type { CopyTradeConfidenceBand, CopyTradeGrade } from "@shared/types";

export type CopyTradeRecommendedAction =
  | "FOLLOW"
  | "SELECTIVE"
  | "MONITOR"
  | "AVOID";

export function getCopyTradeRecommendedAction(
  grade: CopyTradeGrade,
  confidenceBand: CopyTradeConfidenceBand,
): CopyTradeRecommendedAction {
  if (grade === "A" && confidenceBand === "High") return "FOLLOW";
  if (
    grade === "B" &&
    (confidenceBand === "High" || confidenceBand === "Medium")
  ) {
    return "SELECTIVE";
  }
  if (grade === "C" && confidenceBand === "Medium") return "MONITOR";
  if (grade === "D" || grade === "F" || confidenceBand === "Low") {
    return "AVOID";
  }
  return "MONITOR";
}

export function getCopyTradeRecommendedActionTooltip(
  action: CopyTradeRecommendedAction,
): string {
  switch (action) {
    case "FOLLOW":
      return "FOLLOW: Excellent strategy + High confidence";
    case "SELECTIVE":
      return "SELECTIVE: Good strategy + Medium or higher confidence";
    case "MONITOR":
      return "MONITOR: Fair strategy + Medium confidence, or needs closer review";
    case "AVOID":
      return "AVOID: Weak strategy (D/F) or Low confidence";
    default:
      return "";
  }
}

export const COPYTRADE_RECOMMENDED_ACTION_LABEL: Record<
  CopyTradeRecommendedAction,
  string
> = {
  FOLLOW: "FOLLOW",
  SELECTIVE: "SELECTIVE",
  MONITOR: "MONITOR",
  AVOID: "AVOID",
};
