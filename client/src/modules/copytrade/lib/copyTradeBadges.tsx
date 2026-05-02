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
  CopyTradeCapacityFlag,
  CopyTradeConfidenceBand,
  CopyTradeGrade,
  CopyTradeLifecycleState,
  CopyTradeSignalState,
} from "@shared/types";
import type { CopyTradeRiskLevel } from "./copyTradeDetail";

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

export function CopyTradeRiskLevelBadge({
  level,
}: {
  level: CopyTradeRiskLevel;
}) {
  const styles: Record<CopyTradeRiskLevel, string> = {
    Low: "border-chart-4/50 bg-chart-4/15 text-chart-4",
    Medium: "border-amber-500/50 bg-amber-500/15 text-amber-200",
    High: "border-destructive/50 bg-destructive/15 text-destructive",
  };
  return (
    <Badge variant="outline" className={cn(badgeFrameClass, "uppercase", styles[level])}>
      {level}
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

export function CopyTradeCapacityBadge({
  capacity,
}: {
  capacity: CopyTradeCapacityFlag | null;
}) {
  if (!capacity) {
    return <span className="text-xs text-muted-foreground">-</span>;
  }
  const styles: Record<CopyTradeCapacityFlag, string> = {
    Low: "border-amber-500/45 bg-amber-500/12 text-amber-200",
    Medium: "border-primary/45 bg-primary/12 text-primary",
    High: "border-chart-4/45 bg-chart-4/15 text-chart-4",
  };
  return (
    <Badge variant="outline" className={cn(badgeFrameClass, "uppercase", styles[capacity])}>
      {capacity}
    </Badge>
  );
}

type ProfileTagVisual = {
  icon: string;
  label: string;
  shortLabel: string;
  description: string;
  className: string;
};

const PROFILE_TAG_VISUALS: Record<string, ProfileTagVisual> = {
  moonshot: {
    icon: "🚀",
    label: "MOONSHOT",
    shortLabel: "MOON",
    description: "High-risk, high-reward opportunity hunting.",
    className: "border-destructive/65 bg-destructive text-destructive-foreground",
  },
  aggressive: {
    icon: "⚡",
    label: "AGGRESSIVE",
    shortLabel: "AGGR",
    description: "Directional and leveraged style with higher volatility.",
    className: "border-chart-5/65 bg-chart-5 text-background",
  },
  scalper: {
    icon: "⚙️",
    label: "SCALPER",
    shortLabel: "SCALP",
    description: "Rapid small-win execution with frequent entries.",
    className: "border-amber-500/65 bg-amber-500 text-amber-950",
  },
  swing: {
    icon: "〰️",
    label: "SWING",
    shortLabel: "SWING",
    description: "Medium-term trend riding with balanced risk.",
    className: "border-chart-1/65 bg-chart-1 text-chart-1-foreground",
  },
  hedged: {
    icon: "🛡️",
    label: "HEDGED",
    shortLabel: "HEDGE",
    description: "Risk-protected approach using offsetting exposure.",
    className:
      "border-emerald-700/55 bg-emerald-950 text-emerald-50 shadow-sm dark:border-emerald-500/40",
  },
  arbitrage: {
    icon: "⚖️",
    label: "ARBITRAGE",
    shortLabel: "ARB",
    description: "Market-neutral inefficiency capture with lower volatility.",
    className: "border-chart-2/65 bg-chart-2 text-chart-2-foreground",
  },
};

const FALLBACK_PROFILE_VISUAL: ProfileTagVisual = {
  icon: "•",
  label: "—",
  shortLabel: "—",
  description: "No profile info available.",
  className: "border-border bg-muted text-muted-foreground",
};

function normalizeProfileTag(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function getCopyTradeProfileVisual(
  profileTag: string | null | undefined,
): ProfileTagVisual {
  const key = normalizeProfileTag(profileTag);
  return (
    PROFILE_TAG_VISUALS[key] ?? {
      ...FALLBACK_PROFILE_VISUAL,
      label: key ? key.toUpperCase() : FALLBACK_PROFILE_VISUAL.label,
      shortLabel: key ? key.toUpperCase().slice(0, 4) : FALLBACK_PROFILE_VISUAL.shortLabel,
      description: key
        ? "No profile description for this tag yet."
        : FALLBACK_PROFILE_VISUAL.description,
    }
  );
}

export function CopyTradeProfileTagBadge({
  profileTag,
  compact = false,
}: {
  profileTag: string | null | undefined;
  compact?: boolean;
}) {
  const visual = getCopyTradeProfileVisual(profileTag);
  const content = compact ? visual.shortLabel : visual.label;

  return (
    <Badge
      variant="outline"
      title={`${visual.label}: ${visual.description}`}
      className={cn(
        "inline-flex h-7 min-w-0 items-center justify-center gap-1.5 px-2 text-xs font-bold uppercase tracking-wide",
        visual.className,
      )}
    >
      <span aria-hidden>{visual.icon}</span>
      <span>{content}</span>
    </Badge>
  );
}
