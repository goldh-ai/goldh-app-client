export type CopyTradeFilterState = {
  grade: string;
  confidence: string;
  signal: string;
};

export type CopyTradeFilterField = "grade" | "confidence" | "signal";

export function defaultCopyTradeFilterState(): CopyTradeFilterState {
  return {
    grade: "all",
    confidence: "all",
    signal: "all",
  };
}

export function collectActiveCopyTradeFilters(
  filters: CopyTradeFilterState,
): Array<{ field: CopyTradeFilterField; label: string; value: string }> {
  const out: Array<{
    field: CopyTradeFilterField;
    label: string;
    value: string;
  }> = [];
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
