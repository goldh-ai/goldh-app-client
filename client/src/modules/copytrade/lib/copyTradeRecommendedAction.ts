import type {
  CopyTradeCapacityFlag,
  CopyTradeConfidenceBand,
  CopyTradeGrade,
  CopyTradeLifecycleState,
  CopyTradeSignalState,
} from "@shared/types";

export type CopyTradeRecommendedAction =
  | "FOLLOW"
  | "SELECTIVE"
  | "MONITOR"
  | "AVOID";

/**
 * Inputs the recommendation needs. The action itself is determined ONLY by
 * `grade` × `confidenceBand` to mirror the previously-approved leaderboard
 * distribution — additional fields are accepted only so the human-readable
 * `reason` can stay consistent with the trader's wider context.
 *
 * The Copy Trade API does not return `recommended_action`. When it does, this
 * helper should be replaced with a pass-through and the rule deleted entirely.
 */
export type CopyTradeRecommendationContext = {
  grade: CopyTradeGrade;
  confidenceBand: CopyTradeConfidenceBand;
  signalState: CopyTradeSignalState;
  lifecycleState?: CopyTradeLifecycleState | null;
  capacityFlag?: CopyTradeCapacityFlag | null;
};

export type CopyTradeRecommendedActionResult = {
  action: CopyTradeRecommendedAction;
  /** Short human-readable explanation for tooltips and the action card body. */
  reason: string;
};

const REASON_BY_ACTION: Record<CopyTradeRecommendedAction, string> = {
  FOLLOW: "Excellent strategy + High confidence.",
  SELECTIVE: "Good strategy + Medium or higher confidence.",
  MONITOR: "Fair strategy + Medium confidence, or needs closer review.",
  AVOID: "Weak strategy (D/F) or Low confidence.",
};

function pickAction(
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

export function getCopyTradeRecommendedAction(
  ctx: CopyTradeRecommendationContext,
): CopyTradeRecommendedActionResult {
  const action = pickAction(ctx.grade, ctx.confidenceBand);
  return { action, reason: REASON_BY_ACTION[action] };
}

export function getCopyTradeRecommendedActionTooltip(
  result: CopyTradeRecommendedActionResult,
): string {
  return `${result.action}: ${result.reason}`;
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
