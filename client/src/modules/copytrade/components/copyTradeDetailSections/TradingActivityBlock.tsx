import { CalendarRange, Layers, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CopyTradeTraderDetail } from "../../lib/copyTradeDetail";
import { getCopyTradeProfileVisual } from "../../lib/copyTradeBadges";

type TradingActivityBlockProps = {
  detail: CopyTradeTraderDetail;
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
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border",
          accent ? "bg-primary/15 text-primary" : "bg-muted/40 text-muted-foreground",
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

export function TradingActivityBlock({ detail }: TradingActivityBlockProps) {
  const trades = detail.totalTradesProfile ?? null;
  const months = detail.monthsActiveProfile ?? null;
  const strategyVisual = getCopyTradeProfileVisual(detail.strategyLabel);
  const strategyLabel = `${strategyVisual.icon} ${strategyVisual.label}`;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
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
  );
}
