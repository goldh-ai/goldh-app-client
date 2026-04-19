import { memo } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ArbitrageOpportunity } from "@shared/types";
import { cn } from "@/lib/utils";
import {
  arbitragePrimeChipComplexityLowClass,
  arbitragePrimeChipConfidenceHighClass,
  arbitragePrimeChipDeepLiquidityClass,
  arbitragePrimeChipSignalStrongClass,
} from "../lib/badges";
import {
  arbitrageNetSpreadToneClass,
  fmtArbitragePct,
  fmtArbitrageUsd,
} from "../lib/arbitrageFormat";
import { pickPrimeTop } from "../lib/arbitrageRanking";

type ReasonChip = { key: string; label: string; className: string };

function reasonsFor(o: ArbitrageOpportunity): ReasonChip[] {
  const chips: ReasonChip[] = [];
  if (o.signalState === "Strong") {
    chips.push({
      key: "signal",
      label: "Strong signal",
      className: arbitragePrimeChipSignalStrongClass,
    });
  }
  if (o.confidenceBand === "High") {
    chips.push({
      key: "conf",
      label: "High confidence",
      className: arbitragePrimeChipConfidenceHighClass,
    });
  }
  if (o.executionComplexity === "Low") {
    chips.push({
      key: "exec",
      label: "Low complexity",
      className: arbitragePrimeChipComplexityLowClass,
    });
  }
  if (o.liquidityCapacityUsd >= 1_000_000) {
    chips.push({
      key: "liq",
      label: `Deep liquidity ${fmtArbitrageUsd(o.liquidityCapacityUsd)}`,
      className: arbitragePrimeChipDeepLiquidityClass,
    });
  }
  return chips.slice(0, 3);
}

const PrimeCard = memo(function PrimeCard({ o }: { o: ArbitrageOpportunity }) {
  const chips = reasonsFor(o);
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-[#222] bg-[#111111]/40",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]",
        "transition-[border-color,box-shadow,transform] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-[#2a2a2a] hover:shadow-[0_12px_40px_-14px_rgba(0,0,0,0.45)]",
      )}
    >
      {/* Tier bar: brand primary (gold) — scanner chrome; body chips reuse table badge tokens */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 border-b border-primary/20 px-3 py-2.5",
          "bg-gradient-to-b from-primary/[0.14] via-primary/[0.05] to-muted",
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span
            className="text-[11px] font-black uppercase tracking-[0.22em] text-primary"
            title="Prime opportunity"
          >
            Prime
          </span>
        </div>
        <span
          className="shrink-0 font-mono text-xl font-black tabular-nums leading-none tracking-tight text-primary"
          title={`Grade ${o.grade}`}
        >
          {o.grade}
        </span>
      </div>

      <div className="flex flex-col gap-3 bg-[#0a0a0a]/80 p-3.5 pt-3">
        <header className="min-w-0">
          <span
            className="block truncate font-mono text-sm font-bold tracking-tight text-foreground"
            title={o.pair}
          >
            {o.pair}
          </span>
        </header>

        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="min-w-0 truncate" title={o.buyExchange}>
            {o.buyExchange}
          </span>
          <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/70" aria-hidden />
          <span className="min-w-0 truncate" title={o.sellExchange}>
            {o.sellExchange}
          </span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Net spread
            </p>
            <p
              className={cn(
                "font-mono text-2xl font-bold tabular-nums tracking-tight",
                arbitrageNetSpreadToneClass(o.netSpreadPct),
              )}
            >
              {fmtArbitragePct(o.netSpreadPct)}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-right font-mono tabular-nums">
            <dt className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Score
            </dt>
            <dd className="text-sm font-bold text-foreground">{o.arbitrageScore}</dd>
            <dt className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Liq.
            </dt>
            <dd className="text-xs text-muted-foreground">
              {fmtArbitrageUsd(o.liquidityCapacityUsd)}
            </dd>
          </dl>
        </div>

        {chips.length > 0 ? (
          <ul className="mt-0.5 flex flex-wrap gap-1.5 border-t border-[#222]/80 pt-2.5">
            {chips.map((c) => (
              <li
                key={c.key}
                className={cn(
                  "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide backdrop-blur-[2px]",
                  c.className,
                )}
              >
                {c.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
});

function ArbitragePrimeStripInner({
  items,
  max = 3,
}: {
  items: ArbitrageOpportunity[];
  max?: number;
}) {
  const top = pickPrimeTop(items, max);
  if (top.length === 0) return null;

  return (
    <section
      aria-label="Prime arbitrage opportunities"
      className="py-3 sm:py-4"
    >
      <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#C7AE6A]" aria-hidden />
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#C7AE6A]">
          Prime opportunities
        </h4>
        <span className="hidden h-3 w-px shrink-0 bg-[#222] sm:block" aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6b6b6b]">
          Top picks by composite score
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {top.map((o, i) => (
          <PrimeCard
            key={`${o.pair}-${o.buyExchange}-${o.sellExchange}-${i}`}
            o={o}
          />
        ))}
      </div>
    </section>
  );
}

export const ArbitragePrimeStrip = memo(ArbitragePrimeStripInner);
