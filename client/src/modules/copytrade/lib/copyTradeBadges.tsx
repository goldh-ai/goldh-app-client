import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ConfidenceBadge as SharedConfidenceBadge,
  GradeBadge as SharedGradeBadge,
  SignalBadge as SharedSignalBadge,
} from "@/components/shared/marketBadges";
import type {
  ArbitrageConfidenceBand,
  ArbitrageGrade,
  ArbitrageSignalState,
  CopyTradeConfidenceBand,
  CopyTradeGrade,
  CopyTradeLifecycleState,
  CopyTradeSignalState,
} from "@shared/types";

const badgeFrameClass =
  "inline-flex h-7 w-full min-w-0 shrink-0 items-center justify-center text-xs font-semibold tracking-wide leading-none";

export function CopyTradeGradeBadge({ grade }: { grade: CopyTradeGrade }) {
  // Reuse shared grade semantics; cast is safe because enums share same values.
  return <SharedGradeBadge grade={grade as ArbitrageGrade} />;
}

export function CopyTradeConfidenceBadge({ band }: { band: CopyTradeConfidenceBand }) {
  return <SharedConfidenceBadge band={band as ArbitrageConfidenceBand} />;
}

export function CopyTradeSignalBadge({ state }: { state: CopyTradeSignalState }) {
  return <SharedSignalBadge state={state as ArbitrageSignalState} />;
}

export function CopyTradeStatusBadge({
  status,
}: {
  status: CopyTradeLifecycleState;
}) {
  const styles: Record<CopyTradeLifecycleState, string> = {
    active: "border-chart-4/50 bg-chart-4/20 text-chart-4",
    inactive: "border-muted-foreground/45 bg-muted text-muted-foreground",
    reintroduced: "border-primary/45 bg-primary/18 text-primary",
  };
  return (
    <Badge variant="outline" className={cn(badgeFrameClass, "uppercase", styles[status])}>
      {status}
    </Badge>
  );
}
