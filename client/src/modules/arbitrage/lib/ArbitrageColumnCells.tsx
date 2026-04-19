import type {
  ArbitrageConfidenceBand,
  ArbitrageExecutionComplexity,
  ArbitrageFreshness,
  ArbitrageGrade,
  ArbitrageSignalState,
} from "@shared/types";
import {
  institutionalTableCellInnerCenterClass,
  institutionalTableCellInnerLeftClass,
  institutionalTableCellInnerRightClass,
  institutionalTableCellMonoClass,
  institutionalTableCellMonoStrongClass,
  institutionalTableCellTertiaryClass,
  institutionalTableCellTextClass,
  institutionalTableEmptyGlyphClass,
  institutionalTableEntityTextClass,
} from "@/lib/institutionalDataChrome";
import { cn } from "@/lib/utils";
import {
  ComplexityBadge,
  ConfidenceBadge,
  GradeBadge,
  SignalBadge,
} from "./badges";
import { ARBITRAGE_TREND_SPARKLINE } from "./arbitrageConstants";
import {
  arbitrageNetSpreadToneClass,
  arbitrageScoreBarPct,
  fmtArbitragePct,
  fmtArbitragePriceUsd,
  fmtArbitrageUpdated,
  fmtArbitrageUsd,
} from "./arbitrageFormat";

const rowInner = {
  left: institutionalTableCellInnerLeftClass,
  center: institutionalTableCellInnerCenterClass,
  right: institutionalTableCellInnerRightClass,
} as const;

type CellAlign = keyof typeof rowInner;

const freshnessClass: Record<ArbitrageFreshness, string> = {
  fresh: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  warm: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  stale: "border-muted-foreground/40 bg-muted text-muted-foreground",
};

export function ArbitragePairCell({ pair }: { pair: string }) {
  return (
    <div className={cn(rowInner.left, "min-w-0")}>
      <span className={institutionalTableEntityTextClass} title={pair}>
        {pair}
      </span>
    </div>
  );
}

export function ArbitrageMutedTextCell({ text }: { text: string }) {
  return (
    <div className={cn(rowInner.left, "min-w-0")}>
      <span
        className={cn("block min-w-0 truncate", institutionalTableCellTextClass)}
        title={text}
      >
        {text}
      </span>
    </div>
  );
}

export function ArbitragePctCell({ pct, align = "left" }: { pct: number; align?: CellAlign }) {
  return (
    <div className={rowInner[align]}>
      <span className={institutionalTableCellMonoClass}>{fmtArbitragePct(pct)}</span>
    </div>
  );
}

export function ArbitrageNetSpreadCell({
  netPct,
  align = "left",
}: {
  netPct: number;
  align?: CellAlign;
}) {
  return (
    <div className={rowInner[align]}>
      <span
        className={cn(
          "font-mono text-sm font-bold tabular-nums tracking-tight",
          arbitrageNetSpreadToneClass(netPct),
        )}
      >
        {fmtArbitragePct(netPct)}
      </span>
    </div>
  );
}

export function ArbitrageUsdCell({ usd, align = "left" }: { usd: number; align?: CellAlign }) {
  return (
    <div className={rowInner[align]}>
      <span className={cn("whitespace-nowrap", institutionalTableCellMonoClass)}>
        {fmtArbitrageUsd(usd)}
      </span>
    </div>
  );
}

export function ArbitrageScoreCell({ score }: { score: number }) {
  const widthPct = arbitrageScoreBarPct(score);
  return (
    <div className={rowInner.center}>
      <div className="flex min-w-[5.5rem] max-w-[6.5rem] items-center gap-2">
        <span className={cn("shrink-0", institutionalTableCellMonoStrongClass)}>{score}</span>
        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary/85" style={{ width: `${widthPct}%` }} />
        </div>
      </div>
    </div>
  );
}

export function ArbitrageUpdatedCell({ iso, align = "left" }: { iso: string; align?: CellAlign }) {
  return (
    <div className={rowInner[align]}>
      <span className={cn("whitespace-nowrap", institutionalTableCellTertiaryClass)}>
        {fmtArbitrageUpdated(iso)}
      </span>
    </div>
  );
}

export function ArbitrageGradeCell({ grade }: { grade: ArbitrageGrade }) {
  return (
    <div className={rowInner.center}>
      <GradeBadge grade={grade} />
    </div>
  );
}

export function ArbitrageConfidenceCell({ band }: { band: ArbitrageConfidenceBand }) {
  return (
    <div className={rowInner.center}>
      <ConfidenceBadge band={band} />
    </div>
  );
}

export function ArbitrageComplexityCell({ level }: { level: ArbitrageExecutionComplexity }) {
  return (
    <div className={rowInner.center}>
      <ComplexityBadge level={level} />
    </div>
  );
}

export function ArbitrageSignalCell({ state }: { state: ArbitrageSignalState }) {
  return (
    <div className={rowInner.center}>
      <SignalBadge state={state} />
    </div>
  );
}

export function ArbitragePricesCell({ buy, sell }: { buy?: number; sell?: number }) {
  if (buy == null || sell == null) {
    return (
      <div className={rowInner.center}>
        <span className={institutionalTableEmptyGlyphClass}>—</span>
      </div>
    );
  }
  return (
    <div className={cn(rowInner.left, "min-w-[7rem]")}>
      <div className="flex flex-col justify-center gap-0.5 text-[11px] font-mono tabular-nums leading-tight">
        <span className="text-emerald-400/90">Buy {fmtArbitragePriceUsd(buy)}</span>
        <span className="text-rose-400/90">Sell {fmtArbitragePriceUsd(sell)}</span>
      </div>
    </div>
  );
}

export function ArbitrageFreshnessCell({ freshness }: { freshness?: ArbitrageFreshness }) {
  if (!freshness) {
    return (
      <div className={rowInner.center}>
        <span className={institutionalTableEmptyGlyphClass}>—</span>
      </div>
    );
  }
  return (
    <div className={rowInner.center}>
      <span
        className={cn(
          "rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
          freshnessClass[freshness],
        )}
      >
        {freshness}
      </span>
    </div>
  );
}

export function ArbitrageTrendSparkline({ values }: { values?: number[] }) {
  const pts = values?.length ? values : [];
  if (pts.length < 2) {
    return (
      <div className={rowInner.center}>
        <span className={institutionalTableEmptyGlyphClass}>—</span>
      </div>
    );
  }
  const { width: w, height: h, pad } = ARBITRAGE_TREND_SPARKLINE;
  const innerW = w - 2 * pad;
  const innerH = h - 2 * pad;
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const coords = pts.map((v, i) => {
    const x = pad + (i / (pts.length - 1)) * innerW;
    const y =
      max === min ? pad + innerH / 2 : pad + innerH - ((v - min) / (max - min)) * innerH;
    return `${x},${y}`;
  });
  return (
    <div className={rowInner.center}>
      <svg width={w} height={h} className="shrink-0 text-primary/90" aria-hidden>
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinejoin="round"
          strokeLinecap="round"
          points={coords.join(" ")}
        />
      </svg>
    </div>
  );
}
