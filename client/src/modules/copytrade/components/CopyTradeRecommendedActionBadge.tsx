import type {
  CopyTradeCapacityFlag,
  CopyTradeConfidenceBand,
  CopyTradeGrade,
  CopyTradeLifecycleState,
  CopyTradeSignalState,
} from "@shared/types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  COPYTRADE_RECOMMENDED_ACTION_LABEL,
  getCopyTradeRecommendedAction,
  type CopyTradeRecommendedAction,
} from "../lib/copyTradeRecommendedAction";

const actionBadgeClass: Record<CopyTradeRecommendedAction, string> = {
  FOLLOW:
    "border-emerald-600/80 bg-emerald-600 font-bold text-primary-foreground shadow-sm md:text-primary-foreground/90",
  SELECTIVE:
    "border-amber-400/70 bg-amber-400 font-semibold text-neutral-900 shadow-sm md:font-bold md:text-amber-950",
  MONITOR:
    "border-orange-500/75 bg-orange-500 font-semibold text-neutral-950 shadow-sm md:font-bold",
  AVOID: "border-rose-600/85 bg-rose-600 font-bold text-primary-foreground shadow-sm",
};

const actionMobileLetter: Record<CopyTradeRecommendedAction, string> = {
  FOLLOW: "F",
  SELECTIVE: "S",
  MONITOR: "M",
  AVOID: "⊘",
};

type CopyTradeRecommendedActionBadgeProps = {
  grade: CopyTradeGrade;
  confidenceBand: CopyTradeConfidenceBand;
  signalState: CopyTradeSignalState;
  lifecycleState?: CopyTradeLifecycleState | null;
  capacityFlag?: CopyTradeCapacityFlag | null;
  className?: string;
  size?: "default" | "compact" | "hero";
  onActivate?: () => void;
  tableMode?: boolean;
};

export function CopyTradeRecommendedActionBadge({
  grade,
  confidenceBand,
  signalState,
  lifecycleState,
  capacityFlag,
  className,
  size = "default",
  onActivate,
  tableMode = true,
}: CopyTradeRecommendedActionBadgeProps) {
  const result = getCopyTradeRecommendedAction({
    grade,
    confidenceBand,
    signalState,
    lifecycleState: lifecycleState ?? undefined,
    capacityFlag: capacityFlag ?? undefined,
  });
  const { action, reason } = result;
  const label = COPYTRADE_RECOMMENDED_ACTION_LABEL[action];

  const sizeClass =
    size === "hero"
      ? "px-4 py-2 text-base tracking-wide"
      : size === "compact"
        ? "px-2 py-1 text-xs"
        : "px-2.5 py-1 text-xs";
  const widthClass =
    size === "hero"
      ? "w-32"
      : size === "compact"
        ? "w-16 md:w-24"
        : "w-20 md:w-24";

  const inner = (
    <span
      className={cn(
        "inline-flex min-w-0 max-w-full items-center justify-center rounded-md border uppercase tracking-wide",
        sizeClass,
        widthClass,
        actionBadgeClass[action],
        onActivate && "cursor-pointer transition hover:opacity-95 active:scale-[0.99]",
        className,
      )}
    >
      {tableMode ? (
        <>
          <span className="hidden md:inline">{label}</span>
          <span className="inline font-black tabular-nums md:hidden" aria-hidden>
            {actionMobileLetter[action]}
          </span>
          <span className="sr-only md:hidden">{label}</span>
        </>
      ) : (
        label
      )}
    </span>
  );

  const trigger = onActivate ? (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onActivate();
      }}
      className="inline-flex min-w-0 max-w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      {inner}
    </button>
  ) : (
    <span className="inline-flex min-w-0 max-w-full">{inner}</span>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs border border-border bg-popover text-xs text-popover-foreground"
        >
          <span className="block font-bold uppercase tracking-wider text-foreground">
            {label}
          </span>
          <span className="mt-1 block text-muted-foreground">{reason}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
