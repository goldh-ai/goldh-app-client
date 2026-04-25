import { Activity } from "lucide-react";
import type { CopyTradeTraderDetail } from "../../lib/copyTradeDetail";

type ScoreDriversBlockProps = {
  detail: CopyTradeTraderDetail;
};

export function ScoreDriversBlock({ detail }: ScoreDriversBlockProps) {
  const driverCandidates = detail.subscores
    .filter((m) => {
      const label = m.label.toLowerCase();
      return !label.includes("penalty") && !label.includes("override");
    })
    .slice(0, 3);
  const drivers = driverCandidates.map((m) => `${m.label} (${m.value})`);

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-foreground/90">{detail.summary}</p>
      <div className="space-y-1.5 rounded-lg border border-border bg-card px-3 py-2.5">
        <p className="text-xs font-semibold text-primary">
          This trader scores well because:
        </p>
        <ul className="space-y-1 text-xs text-muted-foreground">
          {drivers.length > 0 ? (
            drivers.map((driver) => (
              <li key={driver} className="leading-relaxed">
                • {driver}
              </li>
            ))
          ) : (
            <li className="leading-relaxed">
              • Driver breakdown not available from source data.
            </li>
          )}
        </ul>
      </div>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Activity className="h-3.5 w-3.5 shrink-0 text-primary" />
        Driver insights sourced directly from backend score snapshots.
      </p>
    </div>
  );
}
