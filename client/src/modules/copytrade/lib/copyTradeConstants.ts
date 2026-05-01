export const COPYTRADE_API_PAGE_SIZE = 25;
export const COPYTRADE_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;
export type CopyTradePerPageOption =
  (typeof COPYTRADE_PER_PAGE_OPTIONS)[number];
