export type CopyTradeFilterState = {
  grade: string;
  confidence: string;
  signal: string;
  capacity: string;
  traderSearch: string;
};

export type CopyTradeFilterField =
  | "grade"
  | "confidence"
  | "signal"
  | "capacity"
  | "traderSearch";

export function defaultCopyTradeFilterState(): CopyTradeFilterState {
  return {
    grade: "all",
    confidence: "all",
    signal: "all",
    capacity: "all",
    traderSearch: "",
  };
}

export function traderMatchesCopyTradeSearch(
  row: { traderId: string; handle: string },
  rawQuery: string,
): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  return (
    row.traderId.toLowerCase().includes(q) ||
    row.handle.toLowerCase().includes(q)
  );
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
  if (filters.capacity !== "all") {
    out.push({ field: "capacity", label: "Capacity", value: filters.capacity });
  }
  const s = filters.traderSearch.trim();
  if (s.length > 0) {
    out.push({ field: "traderSearch", label: "Trader", value: s });
  }
  return out;
}
