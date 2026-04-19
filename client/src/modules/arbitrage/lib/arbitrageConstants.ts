export const ARBITRAGE_OPPORTUNITIES_REFETCH_MS = 10_000;

/** Delay after pair search input changes before hitting the opportunities API. */
export const ARBITRAGE_PAIR_SEARCH_DEBOUNCE_MS = 500;

/** Default page size used when a caller doesn't specify one. */
export const ARBITRAGE_API_PAGE_SIZE = 25;

/** Allowed per-page values for the Arbitrage pager dropdown. */
export const ARBITRAGE_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;

export type ArbitragePerPageOption =
  (typeof ARBITRAGE_PER_PAGE_OPTIONS)[number];

export const ARBITRAGE_TREND_SPARKLINE = {
  width: 52,
  height: 20,
  pad: 2,
} as const;
