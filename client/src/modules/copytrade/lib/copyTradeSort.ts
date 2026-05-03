import type { CopyTradeSortByApi, CopyTradeTrader } from "@shared/types";

export const COPYTRADE_SORT_BY = {
  RANK_DESC: "rank_desc",
  RANK_ASC: "rank_asc",
  SCORE_DESC: "score_desc",
  SCORE_ASC: "score_asc",
  ROI_DESC: "roi_desc",
  ROI_ASC: "roi_asc",
  MAX_DRAWDOWN_DESC: "max_drawdown_desc",
  MAX_DRAWDOWN_ASC: "max_drawdown_asc",
  MONTHS_ACTIVE_DESC: "months_active_desc",
  MONTHS_ACTIVE_ASC: "months_active_asc",
  LAST_SEEN_DESC: "last_seen_desc",
  LAST_SEEN_ASC: "last_seen_asc",
} as const satisfies Record<string, CopyTradeSortByApi>;

/** Default after Rank column was removed from the leaderboard UI. */
export const COPYTRADE_DEFAULT_SORT_BY: CopyTradeSortByApi =
  COPYTRADE_SORT_BY.SCORE_DESC;

export const COPYTRADE_SORTABLE_COLUMN_ID = {
  RANK: "computedRank",
  SCORE: "score",
  ROI: "roiTotalPct",
  MAX_DRAWDOWN: "maxDrawdownPct",
  MONTHS_ACTIVE: "monthsActive",
  LAST_SEEN: "lastSeenAt",
} as const;

export type CopyTradeSortableColumnId =
  (typeof COPYTRADE_SORTABLE_COLUMN_ID)[keyof typeof COPYTRADE_SORTABLE_COLUMN_ID];

const SORT_BY_TO_COLUMN_ID = {
  [COPYTRADE_SORT_BY.RANK_DESC]: COPYTRADE_SORTABLE_COLUMN_ID.RANK,
  [COPYTRADE_SORT_BY.RANK_ASC]: COPYTRADE_SORTABLE_COLUMN_ID.RANK,
  [COPYTRADE_SORT_BY.SCORE_DESC]: COPYTRADE_SORTABLE_COLUMN_ID.SCORE,
  [COPYTRADE_SORT_BY.SCORE_ASC]: COPYTRADE_SORTABLE_COLUMN_ID.SCORE,
  [COPYTRADE_SORT_BY.ROI_DESC]: COPYTRADE_SORTABLE_COLUMN_ID.ROI,
  [COPYTRADE_SORT_BY.ROI_ASC]: COPYTRADE_SORTABLE_COLUMN_ID.ROI,
  [COPYTRADE_SORT_BY.MAX_DRAWDOWN_DESC]:
    COPYTRADE_SORTABLE_COLUMN_ID.MAX_DRAWDOWN,
  [COPYTRADE_SORT_BY.MAX_DRAWDOWN_ASC]:
    COPYTRADE_SORTABLE_COLUMN_ID.MAX_DRAWDOWN,
  [COPYTRADE_SORT_BY.MONTHS_ACTIVE_DESC]:
    COPYTRADE_SORTABLE_COLUMN_ID.MONTHS_ACTIVE,
  [COPYTRADE_SORT_BY.MONTHS_ACTIVE_ASC]:
    COPYTRADE_SORTABLE_COLUMN_ID.MONTHS_ACTIVE,
  [COPYTRADE_SORT_BY.LAST_SEEN_DESC]: COPYTRADE_SORTABLE_COLUMN_ID.LAST_SEEN,
  [COPYTRADE_SORT_BY.LAST_SEEN_ASC]: COPYTRADE_SORTABLE_COLUMN_ID.LAST_SEEN,
} as const satisfies Record<CopyTradeSortByApi, CopyTradeSortableColumnId>;

export function copyTradeTableColumnIdForSortBy(
  sortBy: CopyTradeSortByApi,
): CopyTradeSortableColumnId {
  return SORT_BY_TO_COLUMN_ID[sortBy];
}

export function nextCopyTradeSortForColumn(
  columnId: CopyTradeSortableColumnId,
  current: CopyTradeSortByApi,
): CopyTradeSortByApi {
  const currentColumn = copyTradeTableColumnIdForSortBy(current);
  if (currentColumn !== columnId) {
    if (columnId === COPYTRADE_SORTABLE_COLUMN_ID.RANK)
      return COPYTRADE_SORT_BY.RANK_ASC;
    if (columnId === COPYTRADE_SORTABLE_COLUMN_ID.SCORE)
      return COPYTRADE_SORT_BY.SCORE_DESC;
    if (columnId === COPYTRADE_SORTABLE_COLUMN_ID.ROI)
      return COPYTRADE_SORT_BY.ROI_DESC;
    if (columnId === COPYTRADE_SORTABLE_COLUMN_ID.MAX_DRAWDOWN)
      return COPYTRADE_SORT_BY.MAX_DRAWDOWN_ASC;
    if (columnId === COPYTRADE_SORTABLE_COLUMN_ID.MONTHS_ACTIVE)
      return COPYTRADE_SORT_BY.MONTHS_ACTIVE_DESC;
    return COPYTRADE_SORT_BY.LAST_SEEN_DESC;
  }

  switch (current) {
    case COPYTRADE_SORT_BY.RANK_ASC:
      return COPYTRADE_SORT_BY.RANK_DESC;
    case COPYTRADE_SORT_BY.RANK_DESC:
      return COPYTRADE_SORT_BY.RANK_ASC;
    case COPYTRADE_SORT_BY.SCORE_DESC:
      return COPYTRADE_SORT_BY.SCORE_ASC;
    case COPYTRADE_SORT_BY.SCORE_ASC:
      return COPYTRADE_SORT_BY.SCORE_DESC;
    case COPYTRADE_SORT_BY.ROI_DESC:
      return COPYTRADE_SORT_BY.ROI_ASC;
    case COPYTRADE_SORT_BY.ROI_ASC:
      return COPYTRADE_SORT_BY.ROI_DESC;
    case COPYTRADE_SORT_BY.MAX_DRAWDOWN_DESC:
      return COPYTRADE_SORT_BY.MAX_DRAWDOWN_ASC;
    case COPYTRADE_SORT_BY.MAX_DRAWDOWN_ASC:
      return COPYTRADE_SORT_BY.MAX_DRAWDOWN_DESC;
    case COPYTRADE_SORT_BY.MONTHS_ACTIVE_DESC:
      return COPYTRADE_SORT_BY.MONTHS_ACTIVE_ASC;
    case COPYTRADE_SORT_BY.MONTHS_ACTIVE_ASC:
      return COPYTRADE_SORT_BY.MONTHS_ACTIVE_DESC;
    case COPYTRADE_SORT_BY.LAST_SEEN_DESC:
      return COPYTRADE_SORT_BY.LAST_SEEN_ASC;
    case COPYTRADE_SORT_BY.LAST_SEEN_ASC:
      return COPYTRADE_SORT_BY.LAST_SEEN_DESC;
  }
}

function cmpNullableNumber(
  a: number | null,
  b: number | null,
  desc: boolean,
): number {
  const aMissing = a === null || !Number.isFinite(a);
  const bMissing = b === null || !Number.isFinite(b);
  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;
  const diff = desc ? b - a : a - b;
  return diff;
}

export function sortCopyTradeTradersForDisplay(
  rows: CopyTradeTrader[],
  sortBy: CopyTradeSortByApi,
): CopyTradeTrader[] {
  if (rows.length <= 1) return rows;
  const out = [...rows];
  const byRank = (a: CopyTradeTrader, b: CopyTradeTrader) =>
    a.computedRank - b.computedRank;
  const byScore = (a: CopyTradeTrader, b: CopyTradeTrader) => b.score - a.score;
  const byLastSeen = (a: CopyTradeTrader, b: CopyTradeTrader) =>
    b.lastSeenAt.localeCompare(a.lastSeenAt);
  const byHandle = (a: CopyTradeTrader, b: CopyTradeTrader) =>
    a.handle.localeCompare(b.handle);

  switch (sortBy) {
    case COPYTRADE_SORT_BY.RANK_ASC:
      out.sort((a, b) => byRank(a, b) || byScore(a, b) || byHandle(a, b));
      break;
    case COPYTRADE_SORT_BY.RANK_DESC:
      out.sort((a, b) => byRank(b, a) || byScore(a, b) || byHandle(a, b));
      break;
    case COPYTRADE_SORT_BY.SCORE_DESC:
      out.sort((a, b) => byScore(a, b) || byRank(a, b) || byHandle(a, b));
      break;
    case COPYTRADE_SORT_BY.SCORE_ASC:
      out.sort((a, b) => byScore(b, a) || byRank(a, b) || byHandle(a, b));
      break;
    case COPYTRADE_SORT_BY.ROI_DESC:
      out.sort(
        (a, b) =>
          cmpNullableNumber(a.roiTotalPct, b.roiTotalPct, true) ||
          byScore(a, b) ||
          byRank(a, b),
      );
      break;
    case COPYTRADE_SORT_BY.ROI_ASC:
      out.sort(
        (a, b) =>
          cmpNullableNumber(a.roiTotalPct, b.roiTotalPct, false) ||
          byScore(a, b) ||
          byRank(a, b),
      );
      break;
    case COPYTRADE_SORT_BY.MAX_DRAWDOWN_DESC:
      out.sort(
        (a, b) =>
          cmpNullableNumber(a.maxDrawdownPct, b.maxDrawdownPct, true) ||
          byScore(a, b) ||
          byRank(a, b),
      );
      break;
    case COPYTRADE_SORT_BY.MAX_DRAWDOWN_ASC:
      out.sort(
        (a, b) =>
          cmpNullableNumber(a.maxDrawdownPct, b.maxDrawdownPct, false) ||
          byScore(a, b) ||
          byRank(a, b),
      );
      break;
    case COPYTRADE_SORT_BY.MONTHS_ACTIVE_DESC:
      out.sort(
        (a, b) =>
          cmpNullableNumber(a.monthsActive, b.monthsActive, true) ||
          byScore(a, b) ||
          byRank(a, b),
      );
      break;
    case COPYTRADE_SORT_BY.MONTHS_ACTIVE_ASC:
      out.sort(
        (a, b) =>
          cmpNullableNumber(a.monthsActive, b.monthsActive, false) ||
          byScore(a, b) ||
          byRank(a, b),
      );
      break;
    case COPYTRADE_SORT_BY.LAST_SEEN_DESC:
      out.sort((a, b) => byLastSeen(a, b) || byRank(a, b) || byHandle(a, b));
      break;
    case COPYTRADE_SORT_BY.LAST_SEEN_ASC:
      out.sort((a, b) => byLastSeen(b, a) || byRank(a, b) || byHandle(a, b));
      break;
  }

  return out;
}
