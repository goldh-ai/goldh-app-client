import type { ArbitrageOpportunity } from "@shared/types";

export type ArbitrageTier = "prime" | "strong" | "neutral";

export function classifyArbitrageTier(o: ArbitrageOpportunity): ArbitrageTier {
  const notStale = o.freshness !== "stale";
  const usableSignal = o.signalState !== "Invalid";
  if (
    (o.grade === "A" || o.grade === "B") &&
    o.arbitrageScore >= 75 &&
    o.confidenceBand !== "Low" &&
    usableSignal &&
    notStale
  ) {
    return "prime";
  }
  if (o.arbitrageScore >= 65 && usableSignal && notStale) {
    return "strong";
  }
  return "neutral";
}

/** Top-N prime opportunities sorted by composite arbitrage score (desc). */
export function pickPrimeTop(
  items: ArbitrageOpportunity[],
  max = 3,
): ArbitrageOpportunity[] {
  return [...items]
    .filter((x) => classifyArbitrageTier(x) === "prime")
    .sort((a, b) => b.arbitrageScore - a.arbitrageScore)
    .slice(0, max);
}
