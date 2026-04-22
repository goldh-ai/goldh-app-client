import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  CopyTradeConfidenceBand,
  CopyTradeGrade,
  CopyTradeLifecycleState,
  CopyTradeSignalState,
} from "@shared/types";

const badgeFrameClass =
  "inline-flex h-7 w-full min-w-0 shrink-0 items-center justify-center text-xs font-semibold tracking-wide leading-none";

export function CopyTradeGradeBadge({ grade }: { grade: CopyTradeGrade }) {
  const styles: Record<CopyTradeGrade, string> = {
    A: "border-chart-4/50 bg-chart-4/25 text-chart-4",
    B: "border-chart-4/40 bg-chart-4/12 text-chart-4/90",
    C: "border-status-away/50 bg-status-away/15 text-status-away",
    D: "border-chart-1/50 bg-chart-1/18 text-chart-1",
    F: "border-destructive/50 bg-destructive/15 text-destructive-foreground",
  };
  return (
    <Badge variant="outline" className={cn(badgeFrameClass, "font-mono", styles[grade])}>
      {grade}
    </Badge>
  );
}

export function CopyTradeConfidenceBadge({ band }: { band: CopyTradeConfidenceBand }) {
  const styles: Record<CopyTradeConfidenceBand, string> = {
    High: "border-chart-4/50 bg-chart-4/25 text-chart-4",
    Medium: "border-status-away/50 bg-status-away/18 text-status-away",
    Low: "border-destructive/50 bg-destructive/18 text-destructive-foreground",
  };
  const label: Record<CopyTradeConfidenceBand, string> = {
    High: "HIGH",
    Medium: "MED",
    Low: "LOW",
  };
  return (
    <Badge variant="outline" className={cn(badgeFrameClass, styles[band])}>
      {label[band]}
    </Badge>
  );
}

export function CopyTradeSignalBadge({ state }: { state: CopyTradeSignalState }) {
  const styles: Record<CopyTradeSignalState, string> = {
    Strong: "border-chart-4/50 bg-chart-4/25 text-chart-4",
    Moderate: "border-primary/50 bg-primary/18 text-primary",
    Weak: "border-muted-foreground/40 bg-muted text-muted-foreground",
    Invalid: "border-destructive/50 bg-destructive/18 text-destructive-foreground",
  };
  return (
    <Badge variant="outline" className={cn(badgeFrameClass, styles[state])}>
      {state.toUpperCase()}
    </Badge>
  );
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
