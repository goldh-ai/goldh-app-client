export type ArbitrageFilterSelectOption = { value: string; label: string };

export const ARBITRAGE_GRADE_FILTER_OPTIONS: ArbitrageFilterSelectOption[] = [
  { value: "all", label: "All" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "F", label: "F" },
];

export const ARBITRAGE_CONFIDENCE_FILTER_OPTIONS: ArbitrageFilterSelectOption[] =
  [
    { value: "all", label: "All" },
    { value: "High", label: "HIGH" },
    { value: "Medium", label: "MEDIUM" },
    { value: "Low", label: "LOW" },
  ];

export const ARBITRAGE_SIGNAL_FILTER_OPTIONS: ArbitrageFilterSelectOption[] = [
  { value: "all", label: "All" },
  { value: "Strong", label: "Strong" },
  { value: "Moderate", label: "Moderate" },
  { value: "Weak", label: "Weak" },
  { value: "Invalid", label: "Invalid" },
];
