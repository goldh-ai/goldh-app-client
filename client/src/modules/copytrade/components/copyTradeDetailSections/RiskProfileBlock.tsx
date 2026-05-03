import { cn } from "@/lib/utils";
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  CopyTradeRiskLevel,
  CopyTradeTraderDetail,
} from "../../lib/copyTradeDetail";
import { copyTradeMaxDrawdownPctTextClass } from "../../lib/copyTradeFormat";

type RiskProfileBlockProps = {
  detail: CopyTradeTraderDetail;
  /** Stretch with paired column (insight panel) to remove dead vertical space. */
  fillHeight?: boolean;
};

const RISK_LEVEL_TOOLTIP =
  "Rolls drawdown depth, win-rate steadiness, and capacity into one copy-sizing band. Lower is milder.";

const RISK_TONE: Record<
  CopyTradeRiskLevel,
  { dotsFilled: number; tone: string }
> = {
  Low: { dotsFilled: 1, tone: "text-emerald-400" },
  Medium: { dotsFilled: 2, tone: "text-amber-300" },
  High: { dotsFilled: 3, tone: "text-rose-400" },
};

function RiskMeter({ level }: { level: CopyTradeRiskLevel }) {
  const config = RISK_TONE[level];
  return (
    <div
      className="mt-2 inline-flex items-center gap-1"
      role="img"
      aria-label={`Risk level: ${level}`}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-3.5 rounded-full",
            i < config.dotsFilled ? "bg-current" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}

function RiskTile({
  label,
  value,
  tone,
  tooltip,
  children,
}: {
  label: string;
  value: string;
  tone?: string;
  tooltip: string;
  children?: React.ReactNode;
}) {
  return (
    <UiTooltip>
      <TooltipTrigger asChild>
        <div className="flex h-full min-h-[6.25rem] w-full flex-col items-center justify-center px-3 py-3 text-center transition hover:bg-background/35 sm:min-h-0 sm:px-4 sm:py-4">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              "mt-2 font-mono text-lg font-bold tabular-nums",
              tone ?? "text-foreground",
            )}
          >
            {value}
          </p>
          {children}
        </div>
      </TooltipTrigger>
      {/* Bottom + top collision padding: stay tied to tiles, not flipped into the sticky header band. */}
      <TooltipContent
        side="bottom"
        align="center"
        sideOffset={4}
        sticky="always"
        collisionPadding={{ top: 96 }}
        className="max-w-xs text-xs"
      >
        {tooltip}
      </TooltipContent>
    </UiTooltip>
  );
}

export function RiskProfileBlock({ detail, fillHeight = false }: RiskProfileBlockProps) {
  const dd = detail.maxDrawdownPct ?? null;
  const wr = detail.winRatePct ?? null;
  const risk = detail.riskLevel ?? null;
  const hasRiskTier =
    risk === "Low" || risk === "Medium" || risk === "High";
  const ddTone =
    dd == null ? "text-muted-foreground" : copyTradeMaxDrawdownPctTextClass(dd);
  const wrTone =
    wr != null && wr >= 60
      ? "text-emerald-400"
      : wr != null && wr >= 45
        ? "text-foreground"
        : "text-rose-300";

  return (
    <TooltipProvider delayDuration={150}>
      <div
        className={cn(
          "overflow-hidden rounded-2xl bg-muted/10 ring-1 ring-inset ring-border/35",
          fillHeight && "flex min-h-0 flex-1 flex-col",
        )}
      >
        <div
          className={cn(
            "grid grid-cols-1 divide-y divide-border/45 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:items-stretch",
            fillHeight && "min-h-0 flex-1 sm:min-h-[6.75rem]",
          )}
        >
          <RiskTile
            label="Max drawdown"
            value={dd == null ? "—" : `−${Math.abs(dd).toFixed(1)}%`}
            tone={ddTone}
            tooltip="Largest peak-to-trough loss in the modeled track record. Lower is better."
          />
          <RiskTile
            label="Win rate"
            value={wr == null ? "—" : `${wr.toFixed(wr >= 20 ? 0 : 1)}%`}
            tone={wrTone}
            tooltip="Share of trades that were profitable over the evaluated window. Higher is better."
          />
          <RiskTile
            label="Risk level"
            value={hasRiskTier ? risk.toUpperCase() : "—"}
            tone={
              hasRiskTier && risk ? RISK_TONE[risk].tone : "text-muted-foreground"
            }
            tooltip={RISK_LEVEL_TOOLTIP}
          >
            {hasRiskTier && risk ? (
              <div className={cn("flex justify-center", RISK_TONE[risk].tone)}>
                <RiskMeter level={risk} />
              </div>
            ) : null}
          </RiskTile>
        </div>
      </div>
    </TooltipProvider>
  );
}
