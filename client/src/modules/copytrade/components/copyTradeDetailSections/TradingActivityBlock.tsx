import { CalendarRange, Layers, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CopyTradeTraderDetail } from "../../lib/copyTradeDetail";
import { getCopyTradeProfileVisual } from "../../lib/copyTradeBadges";

type TradingActivityBlockProps = {
  detail: CopyTradeTraderDetail;
  fillHeight?: boolean;
};

function StatTile({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex h-full min-h-[5.25rem] items-center gap-3 px-3 py-3 sm:min-h-0 sm:px-4 sm:py-3.5">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          accent ? "bg-primary/20 text-primary shadow-sm" : "bg-background/50 text-muted-foreground ring-1 ring-inset ring-border/30",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate font-mono text-sm font-bold tabular-nums text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export function TradingActivityBlock({ detail, fillHeight = false }: TradingActivityBlockProps) {
  const trades = detail.totalTradesProfile ?? null;
  const months = detail.monthsActiveProfile ?? null;
  const strategyVisual = getCopyTradeProfileVisual(detail.strategyLabel);
  const strategyLabel = `${strategyVisual.icon} ${strategyVisual.label}`;

  return (
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
        <StatTile
          label="Total trades"
          value={trades == null ? "—" : trades.toLocaleString()}
          icon={<Repeat className="h-4 w-4" />}
        />
        <StatTile
          label="Months active"
          value={months == null ? "—" : `${months} mo`}
          icon={<CalendarRange className="h-4 w-4" />}
        />
        <StatTile
          label="Strategy"
          value={strategyLabel}
          icon={<Layers className="h-4 w-4" />}
          accent
        />
      </div>
    </div>
  );
}
