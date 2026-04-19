import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  ArbitrageGrade,
  ArbitrageConfidenceBand,
  ArbitrageSignalState,
  ArbitrageExecutionComplexity,
} from "@shared/types";

/** Shared frame: Grade, Conf., Complexity, Signal fill the same column footprint in the arb table. */
const arbitrageTierBadgeFrameClass =
  "inline-flex h-7 w-full min-w-0 shrink-0 items-center justify-center";

export function GradeBadge({ grade }: { grade: ArbitrageGrade }) {
  /** TRD: A=green, B=light green, C=yellow, D=orange, F=red — theme tokens (chart-4, status-away, chart-1, destructive). */
  const styles: Record<ArbitrageGrade, string> = {
    A: "border-chart-4/50 bg-chart-4/25 text-chart-4",
    B: "border-chart-4/40 bg-chart-4/12 text-chart-4/90",
    C: "border-status-away/50 bg-status-away/15 text-status-away",
    D: "border-chart-1/50 bg-chart-1/18 text-chart-1",
    F: "border-destructive/50 bg-destructive/15 text-destructive-foreground",
  };
  return (
    <Badge
      variant="outline"
      className={cn(
        arbitrageTierBadgeFrameClass,
        "text-center font-mono font-bold tabular-nums leading-none",
        styles[grade],
      )}
    >
      {grade}
    </Badge>
  );
}

/** Table chip labels (Medium → MED, not MEDI from a 4-char slice). */
const CONFIDENCE_BADGE_LABEL: Record<ArbitrageConfidenceBand, string> = {
  High: "HIGH",
  Medium: "MED",
  Low: "LOW",
};

/** Same cap size / weight as Complexity in the arbitrage table (Badge already sets text-xs). */
const arbitrageTableChipTextClass =
  "text-xs font-semibold tracking-wide tabular-nums leading-none";

export function ConfidenceBadge({ band }: { band: ArbitrageConfidenceBand }) {
  /** TRD: High=green, Medium=yellow, Low=red — same semantic palette as grades (chart-4 / status-away / destructive). */
  const styles: Record<ArbitrageConfidenceBand, string> = {
    High: "border-chart-4/50 bg-chart-4/25 text-chart-4",
    Medium: "border-status-away/50 bg-status-away/18 text-status-away",
    Low: "border-destructive/50 bg-destructive/18 text-destructive-foreground",
  };
  const label = CONFIDENCE_BADGE_LABEL[band];
  return (
    <Badge
      variant="outline"
      aria-label={`Confidence: ${band}`}
      className={cn(
        arbitrageTierBadgeFrameClass,
        "text-center",
        arbitrageTableChipTextClass,
        styles[band],
      )}
    >
      {label}
    </Badge>
  );
}

export function SignalBadge({ state }: { state: ArbitrageSignalState }) {
  /** TRD: four states “clearly distinguishable” — Strong aligns with chart-4; Moderate uses brand primary. */
  const styles: Record<ArbitrageSignalState, string> = {
    Strong: "border-chart-4/50 bg-chart-4/25 text-chart-4",
    Moderate: "border-primary/50 bg-primary/18 text-primary",
    Weak: "border-muted-foreground/40 bg-muted text-muted-foreground",
    Invalid: "border-destructive/50 bg-destructive/18 text-destructive-foreground",
  };
  return (
    <Badge
      variant="outline"
      className={cn(
        arbitrageTierBadgeFrameClass,
        "text-center",
        arbitrageTableChipTextClass,
        styles[state],
      )}
    >
      {state.toUpperCase()}
    </Badge>
  );
}

export function ComplexityBadge({ level }: { level: ArbitrageExecutionComplexity }) {
  const styles: Record<ArbitrageExecutionComplexity, string> = {
    Low: "border-chart-4/45 bg-chart-4/18 text-chart-4",
    Medium: "b7order-status-away/45 bg-status-away/15 text-status-away",
    High: "border-destructive/45 bg-destructive/15 text-destructive-foreground",
  };
  return (
    <Badge
      variant="outline"
      className={cn(
        arbitrageTierBadgeFrameClass,
        "text-center",
        arbitrageTableChipTextClass,
        styles[level],
      )}
    >
      {level.toUpperCase()}
    </Badge>
  );
}
