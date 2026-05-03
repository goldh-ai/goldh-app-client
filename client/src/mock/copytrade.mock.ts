import type { CopyTradeTraderApiDto } from "@shared/types";

const grades = ["A", "B", "C", "D", "F"] as const;
const confidences = ["High", "Medium", "Low"] as const;
const signals = ["Strong", "Moderate", "Weak", "Invalid"] as const;
const lifecycleStates = ["active", "inactive", "reintroduced"] as const;

function makeMockTrader(index: number): CopyTradeTraderApiDto {
  const grade = grades[index % grades.length];
  const confidence = confidences[index % confidences.length];
  const signal = signals[index % signals.length];
  const lifecycle = lifecycleStates[index % lifecycleStates.length];
  const computedRank = index + 1;

  const riskLevels = ["Low", "Medium", "High"] as const;
  const capacities = ["Low", "Medium", "High"] as const;
  const profiles = ["Swing", "Position", "Scalp", "Balanced"] as const;

  return {
    trader_id: `T${String(computedRank).padStart(4, "0")}`,
    handle: `Trader_${computedRank}`,
    computed_rank: computedRank,
    rank_change_7d: (index % 11) - 5,
    grade,
    signal_state: signal,
    confidence_band: confidence,
    risk_level: riskLevels[index % riskLevels.length],
    capacity_flag: capacities[index % capacities.length],
    profile_tag: profiles[index % profiles.length],
    ema_score: Math.max(0, Math.min(100, 96 - index * 0.45)),
    score_momentum: Number((((index % 9) - 4) * 0.42).toFixed(2)),
    lifecycle_state: lifecycle,
    last_seen_at: new Date(Date.now() - index * 21 * 60_000).toISOString(),
    roi_total_pct: Number((8 + index * 0.35).toFixed(2)),
    max_drawdown_pct: Number((3.5 + (index % 12) * 0.4).toFixed(2)),
    months_active: 3 + (index % 40),
    total_trades: 40 + index * 7,
  };
}

export const COPYTRADE_MOCK_TRADERS_DTO: CopyTradeTraderApiDto[] = Array.from(
  { length: 140 },
  (_, i) => makeMockTrader(i),
);
