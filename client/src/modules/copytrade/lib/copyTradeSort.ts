import type { CopyTradeSortByApi, CopyTradeTrader } from "@shared/types";

export const COPYTRADE_SORT_BY = {
  RANK_DESC: "rank_desc",
  RANK_ASC: "rank_asc",
  SCORE_DESC: "score_desc",
  SCORE_ASC: "score_asc",
  MOMENTUM_DESC: "momentum_desc",
  MOMENTUM_ASC: "momentum_asc",
  LAST_SEEN_DESC: "last_seen_desc",
  LAST_SEEN_ASC: "last_seen_asc",
} as const satisfies Record<string, CopyTradeSortByApi>;

export const COPYTRADE_DEFAULT_SORT_BY: CopyTradeSortByApi =
  COPYTRADE_SORT_BY.RANK_ASC;

export const COPYTRADE_SORTABLE_COLUMN_ID = {
  RANK: "computedRank",
  SCORE: "score",
  MOMENTUM: "momentum",
  LAST_SEEN: "lastSeenAt",
} as const;

export type CopyTradeSortableColumnId =
  (typeof COPYTRADE_SORTABLE_COLUMN_ID)[keyof typeof COPYTRADE_SORTABLE_COLUMN_ID];

const SORT_BY_TO_COLUMN_ID = {
  [COPYTRADE_SORT_BY.RANK_DESC]: COPYTRADE_SORTABLE_COLUMN_ID.RANK,
  [COPYTRADE_SORT_BY.RANK_ASC]: COPYTRADE_SORTABLE_COLUMN_ID.RANK,
  [COPYTRADE_SORT_BY.SCORE_DESC]: COPYTRADE_SORTABLE_COLUMN_ID.SCORE,
  [COPYTRADE_SORT_BY.SCORE_ASC]: COPYTRADE_SORTABLE_COLUMN_ID.SCORE,
  [COPYTRADE_SORT_BY.MOMENTUM_DESC]: COPYTRADE_SORTABLE_COLUMN_ID.MOMENTUM,
  [COPYTRADE_SORT_BY.MOMENTUM_ASC]: COPYTRADE_SORTABLE_COLUMN_ID.MOMENTUM,
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
    if (columnId === COPYTRADE_SORTABLE_COLUMN_ID.MOMENTUM)
      return COPYTRADE_SORT_BY.MOMENTUM_DESC;
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
    case COPYTRADE_SORT_BY.MOMENTUM_DESC:
      return COPYTRADE_SORT_BY.MOMENTUM_ASC;
    case COPYTRADE_SORT_BY.MOMENTUM_ASC:
      return COPYTRADE_SORT_BY.MOMENTUM_DESC;
    case COPYTRADE_SORT_BY.LAST_SEEN_DESC:
      return COPYTRADE_SORT_BY.LAST_SEEN_ASC;
    case COPYTRADE_SORT_BY.LAST_SEEN_ASC:
      return COPYTRADE_SORT_BY.LAST_SEEN_DESC;
  }
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
  const byMomentum = (a: CopyTradeTrader, b: CopyTradeTrader) =>
    b.momentum - a.momentum;
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
    case COPYTRADE_SORT_BY.MOMENTUM_DESC:
      out.sort((a, b) => byMomentum(a, b) || byScore(a, b) || byRank(a, b));
      break;
    case COPYTRADE_SORT_BY.MOMENTUM_ASC:
      out.sort((a, b) => byMomentum(b, a) || byScore(a, b) || byRank(a, b));
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
