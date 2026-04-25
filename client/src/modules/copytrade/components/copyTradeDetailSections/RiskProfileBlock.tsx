import { cn } from "@/lib/utils";
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CopyTradeTraderDetail } from "../../lib/copyTradeDetail";

type RiskProfileBlockProps = {
  detail: CopyTradeTraderDetail;
};

export function RiskProfileBlock({ detail }: RiskProfileBlockProps) {
  const dd = detail.maxDrawdownPct ?? null;
  const wr = detail.winRatePct ?? null;
  const risk = detail.riskLevel ?? "Medium";
  const ddTone =
    dd != null && Math.abs(dd) > 20
      ? "text-rose-400 font-bold"
      : "text-foreground font-semibold";
  const wrTone = "text-emerald-400 font-semibold";

  return (
    <TooltipProvider delayDuration={150}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <UiTooltip>
          <TooltipTrigger asChild>
            <div className="cursor-default rounded-xl border border-border bg-card px-3 py-3 text-center transition hover:border-primary/35">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Max drawdown
              </p>
              <p className={cn("mt-2 font-mono text-lg", ddTone)}>
                {dd == null ? "—" : `−${Math.abs(dd).toFixed(1)}%`}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">
            Largest peak-to-trough loss in the modeled track record.
          </TooltipContent>
        </UiTooltip>
        <UiTooltip>
          <TooltipTrigger asChild>
            <div className="cursor-default rounded-xl border border-border bg-card px-3 py-3 text-center transition hover:border-primary/35">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Win rate
              </p>
              <p className={cn("mt-2 font-mono text-lg", wrTone)}>
                {wr == null ? "—" : `${wr.toFixed(wr >= 20 ? 0 : 1)}%`}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">
            Share of trades that were profitable over the evaluated window.
          </TooltipContent>
        </UiTooltip>
        <UiTooltip>
          <TooltipTrigger asChild>
            <div className="cursor-default rounded-xl border border-border bg-card px-3 py-3 text-center transition hover:border-primary/35">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Risk level
              </p>
              <p
                className={cn(
                  "mt-2 font-mono text-sm font-black uppercase tracking-widest",
                  risk === "High" && "text-rose-400",
                  risk === "Medium" && "text-amber-300",
                  risk === "Low" && "text-emerald-400",
                )}
              >
                {risk}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">
            Composite view of confidence, capacity, and drawdown severity for copy
            sizing.
          </TooltipContent>
        </UiTooltip>
      </div>
      <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">Max Drawdown:</span>{" "}
          Largest loss from peak. Lower is better.
        </p>
        <p>
          <span className="font-semibold text-foreground">Win Rate:</span> Share of
          profitable trades. Higher is better.
        </p>
        <p>
          <span className="font-semibold text-foreground">Overall Risk:</span>{" "}
          Combined view of drawdown, confidence, and capacity.
        </p>
      </div>
    </TooltipProvider>
  );
}
