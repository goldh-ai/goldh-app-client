import { describe, expect, it } from "vitest";
import { getCopyTradeRecommendedAction } from "../lib/copyTradeRecommendedAction";

describe("getCopyTradeRecommendedAction", () => {
  it("returns FOLLOW for grade A + High confidence", () => {
    const result = getCopyTradeRecommendedAction({
      grade: "A",
      confidenceBand: "High",
      signalState: "Strong",
    });
    expect(result.action).toBe("FOLLOW");
  });

  it("returns SELECTIVE for grade B + High confidence", () => {
    const result = getCopyTradeRecommendedAction({
      grade: "B",
      confidenceBand: "High",
      signalState: "Moderate",
    });
    expect(result.action).toBe("SELECTIVE");
  });

  it("returns SELECTIVE for grade B + Medium confidence", () => {
    const result = getCopyTradeRecommendedAction({
      grade: "B",
      confidenceBand: "Medium",
      signalState: "Moderate",
    });
    expect(result.action).toBe("SELECTIVE");
  });

  it("returns MONITOR for grade C + Medium confidence", () => {
    const result = getCopyTradeRecommendedAction({
      grade: "C",
      confidenceBand: "Medium",
      signalState: "Weak",
    });
    expect(result.action).toBe("MONITOR");
  });

  it("returns AVOID for any Low confidence", () => {
    const result = getCopyTradeRecommendedAction({
      grade: "A",
      confidenceBand: "Low",
      signalState: "Strong",
    });
    expect(result.action).toBe("AVOID");
  });

  it("returns AVOID for grade D/F regardless of confidence", () => {
    const dResult = getCopyTradeRecommendedAction({
      grade: "D",
      confidenceBand: "High",
      signalState: "Strong",
    });
    const fResult = getCopyTradeRecommendedAction({
      grade: "F",
      confidenceBand: "Medium",
      signalState: "Moderate",
    });
    expect(dResult.action).toBe("AVOID");
    expect(fResult.action).toBe("AVOID");
  });

  it("falls back to MONITOR for non-explicit combinations", () => {
    const result = getCopyTradeRecommendedAction({
      grade: "A",
      confidenceBand: "Medium",
      signalState: "Strong",
    });
    expect(result.action).toBe("MONITOR");
  });
});
