export function fmtArbitragePct(n: number): string {
  return `${n.toFixed(2)}%`;
}

export function fmtArbitrageUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function fmtArbitragePriceUsd(n: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function fmtArbitrageUpdated(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleString("en-GB", { month: "short" }).toUpperCase();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${hh}:${mm}`;
}

/** Thresholds are product constants from Module 8 TRD. */
export function arbitrageNetSpreadToneClass(netPct: number): string {
  if (netPct > 0.15) return "text-emerald-500";
  if (netPct > 0.05) return "text-muted-foreground";
  return "text-muted-foreground/70";
}

export function arbitrageScoreBarPct(score: number): number {
  return Math.min(100, Math.max(0, score));
}
