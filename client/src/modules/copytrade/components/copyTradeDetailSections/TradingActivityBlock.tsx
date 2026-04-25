import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CopyTradeTraderDetail } from "../../lib/copyTradeDetail";

type TradingActivityBlockProps = {
  detail: CopyTradeTraderDetail;
};

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-right font-medium text-foreground",
          accent && "font-semibold text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function TradingActivityBlock({ detail }: TradingActivityBlockProps) {
  const trades = detail.totalTradesProfile ?? null;
  const months = detail.monthsActiveProfile ?? null;
  const avgTradesPerMonth = detail.avgTradesPerMonth ?? null;
  const strategy = detail.strategyLabel ?? "—";
  const consistency =
    avgTradesPerMonth != null
      ? `Backend average: ${avgTradesPerMonth.toFixed(1)} trades / month`
      : "Backend activity average is not available.";

  return (
    <div className="space-y-2.5 text-sm">
      <div className="flex flex-col gap-1 rounded-lg border border-border bg-card px-3 py-2.5">
        <Row label="Total trades" value={trades == null ? "—" : String(trades)} />
        <Row label="Months active" value={months == null ? "—" : String(months)} />
        <Row
          label="Avg trades / month"
          value={avgTradesPerMonth == null ? "—" : avgTradesPerMonth.toFixed(1)}
        />
        <Row label="Strategy profile" value={strategy} accent />
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{consistency}</p>
      <p className="flex items-center gap-2 text-xs font-medium text-primary/90">
        <Activity className="h-3.5 w-3.5" />
        Activity indicator from backend-provided monthly average.
      </p>
    </div>
  );
}
