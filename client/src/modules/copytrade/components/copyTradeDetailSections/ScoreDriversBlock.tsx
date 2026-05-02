import { ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  CopyTradeScoreDriver,
  CopyTradeTraderDetail,
} from "../../lib/copyTradeDetail";

type ScoreDriversBlockProps = {
  detail: CopyTradeTraderDetail;
  fillHeight?: boolean;
};

/**
 * Falls back to numeric subscores when the API hasn't supplied
 * `score_explanation_summary.top_3_drivers` yet, so the block always renders
 * something useful instead of an empty card.
 */
function fallbackDriversFromSubscores(
  detail: CopyTradeTraderDetail,
): CopyTradeScoreDriver[] {
  return detail.subscores
    .filter((m) => {
      const label = m.label.toLowerCase();
      return !label.includes("penalty") && !label.includes("override");
    })
    .slice(0, 3)
    .map((m) => ({
      label: m.label,
      delta: null,
      raw: `${m.label} (${m.value})`,
    }));
}

function DriverRow({
  driver,
  scale,
}: {
  driver: CopyTradeScoreDriver;
  scale: number;
}) {
  const delta = driver.delta;
  const tone =
    delta == null
      ? "primary"
      : delta >= 0
        ? "positive"
        : "negative";
  const barClass =
    tone === "positive"
      ? "bg-emerald-500/70"
      : tone === "negative"
        ? "bg-rose-500/70"
        : "bg-primary/70";
  const trackClass = "bg-muted/50";
  const widthPct =
    delta == null
      ? 65
      : Math.max(8, Math.min(100, (Math.abs(delta) / scale) * 100));
  const deltaLabel =
    delta == null
      ? "Driver"
      : delta > 0
        ? `+${Math.round(delta * 10) / 10} pts`
        : `${Math.round(delta * 10) / 10} pts`;
  const deltaTone =
    delta == null
      ? "text-muted-foreground"
      : delta >= 0
        ? "text-emerald-300"
        : "text-rose-300";

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-xs font-semibold text-foreground">
          {driver.label}
        </span>
        <span
          className={cn("font-mono text-xs font-bold tabular-nums", deltaTone)}
        >
          {deltaLabel}
        </span>
      </div>
      <div
        className={cn("relative h-1.5 w-full overflow-hidden rounded-full", trackClass)}
        role="presentation"
      >
        <div
          className={cn("h-full rounded-full transition-all", barClass)}
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  );
}

function ReasonChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/20 px-2.5 py-2 ring-1 ring-inset ring-border/25">
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xs leading-snug text-foreground/90">{value}</p>
    </div>
  );
}

export function ScoreDriversBlock({ detail, fillHeight = false }: ScoreDriversBlockProps) {
  const drivers =
    detail.topDrivers.length > 0
      ? detail.topDrivers
      : fallbackDriversFromSubscores(detail);
  const scale = drivers.reduce(
    (acc, d) => Math.max(acc, Math.abs(d.delta ?? 0)),
    1,
  );
  const hasReasons =
    Boolean(detail.signalReason) || Boolean(detail.confidenceReason);

  return (
    <div className={cn("space-y-3", fillHeight && "flex min-h-0 flex-1 flex-col")}>
      <div
        className={cn(
          "rounded-xl bg-muted/10 px-3 py-2.5 ring-1 ring-inset ring-border/30",
          fillHeight && "min-h-0 flex-1",
        )}
      >
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-primary/90">
          Top contributors
        </p>
        {drivers.length > 0 ? (
          <div className="mt-2.5 space-y-2.5">
            {drivers.map((driver) => (
              <DriverRow key={driver.raw} driver={driver} scale={scale} />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            No driver breakdown info available yet.
          </p>
        )}
      </div>

      {hasReasons ? (
        <div className={cn("grid grid-cols-1 gap-2 sm:grid-cols-2", fillHeight && "shrink-0")}>
          {detail.signalReason ? (
            <ReasonChip label="Signal" value={detail.signalReason} />
          ) : null}
          {detail.confidenceReason ? (
            <ReasonChip label="Confidence" value={detail.confidenceReason} />
          ) : null}
        </div>
      ) : null}

      {detail.scoreCapApplied ? (
        <div
          className={cn(
            "flex items-start gap-2 rounded-md border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs text-amber-200",
            fillHeight && "shrink-0",
          )}
        >
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Score was capped by a guardrail rule — actual quality may sit above the
            displayed value.
          </span>
        </div>
      ) : null}

      <p
        className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground",
          fillHeight && "mt-auto border-t border-border/30 pt-3",
        )}
      >
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
        Drivers and reasons sourced directly from the score explanation snapshot.
      </p>
    </div>
  );
}
