/** Matches institutional score display (same numeric string as `InstitutionalScoreCell`). */
export function fmtCopyTradeScore(value: number): string {
  return String(value);
}

export function fmtCopyTradeMomentum(value: number): string {
  const withSign = value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  return withSign;
}

/** Backend-sourced ROI / return; no recomputation. */
export function fmtCopyTradeRoiPct(value: number | null, decimals = 1): string {
  if (value === null || !Number.isFinite(value)) return "—";
  const rounded = Number(value.toFixed(decimals));
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded}%`;
}

/** Max drawdown as positive magnitude when backend sends signed or unsigned %. */
export function fmtCopyTradeMaxDrawdownPct(
  value: number | null,
  decimals = 1,
): string {
  if (value === null || !Number.isFinite(value)) return "—";
  const mag = Math.abs(value);
  return `${mag.toFixed(decimals)}%`;
}

export function fmtCopyTradeUpdated(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleString("en-GB", { month: "short" }).toUpperCase();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${hh}:${mm}`;
}

/** Pulse / Streetscore-style signed return — emerald up, rose down, muted flat / missing. */
export function copyTradeSignedPctTextClass(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "text-muted-foreground";
  if (value > 0) return "text-emerald-400";
  if (value < 0) return "text-rose-400";
  return "text-muted-foreground";
}

/**
 * Same severity ladder as `RiskProfileBlock` max drawdown tile — higher magnitude = hotter tone.
 * Lower drawdown is visually calmer (neutral foreground family).
 */
export function copyTradeMaxDrawdownPctTextClass(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "text-muted-foreground";
  const mag = Math.abs(value);
  if (mag > 20) return "text-rose-400";
  if (mag > 12) return "text-amber-300";
  return "text-gray-300";
}

/** Longevity: short history reads cautious; longer track stays neutral–positive (matches decision framing). */
export function copyTradeMonthsActiveTextClass(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "text-muted-foreground";
  if (value < 6) return "text-amber-300";
  if (value >= 24) return "text-emerald-400";
  return "text-gray-300";
}

/** Thin trade count → amber (small sample); otherwise neutral mono. */
export function copyTradeTotalTradesTextClass(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "text-muted-foreground";
  if (value < 30) return "text-amber-300";
  return "text-gray-300";
}

/** Recency of leaderboard snapshot — aligned with Pulse-style freshness cues. */
export function copyTradeLastSeenTextClass(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "text-muted-foreground";
  const ageHours = (Date.now() - t) / 3_600_000;
  if (ageHours <= 24) return "text-emerald-400";
  if (ageHours <= 72) return "text-amber-300";
  if (ageHours <= 168) return "text-gray-300";
  return "text-muted-foreground";
}
