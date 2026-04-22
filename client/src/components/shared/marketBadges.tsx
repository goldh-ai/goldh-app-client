import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  ArbitrageConfidenceBand,
  ArbitrageExecutionComplexity,
  ArbitrageGrade,
  ArbitrageSignalState,
} from "@shared/types";

const marketTierBadgeFrameClass =
  "inline-flex h-7 w-full min-w-0 shrink-0 items-center justify-center";

export const arbitragePrimeChipSignalStrongClass =
  "border-chart-4/50 bg-chart-4/25 text-chart-4";
export const arbitragePrimeChipConfidenceHighClass =
  "border-chart-4/50 bg-chart-4/25 text-chart-4";
export const arbitragePrimeChipComplexityLowClass =
  "border-chart-4/45 bg-chart-4/18 text-chart-4";
export const arbitragePrimeChipDeepLiquidityClass =
  "border-primary/50 bg-primary/18 text-primary";

export function GradeBadge({ grade }: { grade: ArbitrageGrade }) {
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
        marketTierBadgeFrameClass,
        "text-center font-mono font-bold tabular-nums leading-none",
        styles[grade],
      )}
    >
      {grade}
    </Badge>
  );
}

const CONFIDENCE_BADGE_LABEL: Record<ArbitrageConfidenceBand, string> = {
  High: "HIGH",
  Medium: "MED",
  Low: "LOW",
};

const marketTableChipTextClass =
  "text-xs font-semibold tracking-wide tabular-nums leading-none";

export function ConfidenceBadge({ band }: { band: ArbitrageConfidenceBand }) {
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
        marketTierBadgeFrameClass,
        "text-center",
        marketTableChipTextClass,
        styles[band],
      )}
    >
      {label}
    </Badge>
  );
}

export function SignalBadge({ state }: { state: ArbitrageSignalState }) {
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
        marketTierBadgeFrameClass,
        "text-center",
        marketTableChipTextClass,
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
    Medium: "border-status-away/45 bg-status-away/15 text-status-away",
    High: "border-destructive/45 bg-destructive/15 text-destructive-foreground",
  };
  return (
    <Badge
      variant="outline"
      className={cn(
        marketTierBadgeFrameClass,
        "text-center",
        marketTableChipTextClass,
        styles[level],
      )}
    >
      {level.toUpperCase()}
    </Badge>
  );
}
