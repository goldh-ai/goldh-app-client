import type { ArbitrageOpportunityApiDto } from "@shared/types";

const grades = ["A", "B", "C", "D", "F"] as const;
const signals = ["Strong", "Moderate", "Weak", "Invalid"] as const;
const confidences = ["High", "Medium", "Low"] as const;
const pairs = [
  "BTC/USD",
  "ETH/USD",
  "SOL/USD",
  "XRP/USD",
  "DOGE/USD",
  "AVAX/USD",
  "LINK/USD",
  "MATIC/USD",
  "DOT/USD",
  "ATOM/USD",
];

function dto(
  i: number,
  overrides: Partial<ArbitrageOpportunityApiDto> = {},
): ArbitrageOpportunityApiDto {
  const g = grades[i % grades.length];
  const s = signals[i % signals.length];
  const c = confidences[i % confidences.length];
  const pair = pairs[i % pairs.length];
  const base = 0.12 + (i % 7) * 0.015;
  const net = base - 0.02;
  const trend = [0.1, 0.12, 0.11, 0.14, 0.13, 0.15].map(
    (v) => v + (i % 5) * 0.01,
  );
  return {
    id: `mock-${i}`,
    pair,
    buy_exchange: i % 2 === 0 ? "Binance" : "Coinbase",
    sell_exchange: i % 2 === 0 ? "Kraken" : "Binance",
    gross_spread_pct: base,
    net_spread_pct: net,
    buy_price: 42_000 + i * 17,
    sell_price: 42_050 + i * 19,
    liquidity_capacity_usd: 250_000 + i * 10_000,
    executable_trade_size_usd: 50_000 + i * 2_000,
    arbitrage_score: Math.min(100, 55 + (i % 40)),
    grade: g,
    confidence_band: c,
    signal_state: s,
    execution_complexity: i % 3 === 0 ? "Low" : i % 3 === 1 ? "Medium" : "High",
    freshness: i % 3 === 0 ? "fresh" : i % 3 === 1 ? "warm" : "stale",
    last_updated: new Date(Date.now() - i * 60_000).toISOString(),
    trend,
    ...overrides,
  };
}

export const ARBITRAGE_MOCK_OPPORTUNITIES_DTO: ArbitrageOpportunityApiDto[] =
  (() => {
    const rows: ArbitrageOpportunityApiDto[] = [];
    let idx = 0;
    for (const g of grades) {
      for (const s of signals) {
        rows.push(
          dto(idx, {
            grade: g,
            signal_state: s,
            pair: pairs[idx % pairs.length],
          }),
        );
        idx += 1;
      }
    }
    while (rows.length < 35) {
      rows.push(dto(idx));
      idx += 1;
    }
    return rows;
  })();
