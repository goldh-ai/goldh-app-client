export type ArbitrageFilterState = {
  pairQuery: string;
  grade: string;
  confidence: string;
  signal: string;
};

export type ArbitrageFilterField = "pair" | "grade" | "confidence" | "signal";

export function defaultArbitrageFilterState(): ArbitrageFilterState {
  return {
    pairQuery: "",
    grade: "all",
    confidence: "all",
    signal: "all",
  };
}

export function collectActiveArbitrageFilters(
  filters: ArbitrageFilterState,
): Array<{ field: ArbitrageFilterField; label: string; value: string }> {
  const out: Array<{
    field: ArbitrageFilterField;
    label: string;
    value: string;
  }> = [];
  const pair = filters.pairQuery.trim();
  if (pair) {
    out.push({ field: "pair", label: "Pair", value: pair });
  }
  if (filters.grade !== "all") {
    out.push({ field: "grade", label: "Grade", value: filters.grade });
  }
  if (filters.confidence !== "all") {
    out.push({
      field: "confidence",
      label: "Confidence",
      value: filters.confidence,
    });
  }
  if (filters.signal !== "all") {
    out.push({ field: "signal", label: "Signal", value: filters.signal });
  }
  return out;
}
