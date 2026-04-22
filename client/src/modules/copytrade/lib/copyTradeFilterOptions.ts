export type CopyTradeFilterSelectOption = {
  value: string;
  label: string;
};

export const COPYTRADE_GRADE_FILTER_OPTIONS: CopyTradeFilterSelectOption[] = [
  { value: "all", label: "All" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "F", label: "F" },
];

export const COPYTRADE_CONFIDENCE_FILTER_OPTIONS: CopyTradeFilterSelectOption[] =
  [
    { value: "all", label: "All" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

export const COPYTRADE_SIGNAL_FILTER_OPTIONS: CopyTradeFilterSelectOption[] = [
  { value: "all", label: "All" },
  { value: "Strong", label: "Strong" },
  { value: "Moderate", label: "Moderate" },
  { value: "Weak", label: "Weak" },
  { value: "Invalid", label: "Invalid" },
];
