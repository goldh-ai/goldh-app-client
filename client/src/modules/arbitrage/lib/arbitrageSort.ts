import {
  arbitrageSortByApiSchema,
  type ArbitrageOpportunity,
  type ArbitrageSortByApi,
} from "@shared/types";

export const ArbitrageSortBy = arbitrageSortByApiSchema.enum;

export type ArbitrageSortDir = "desc" | "asc";

export const ARBITRAGE_SORT_DIR = {
  ASC: "asc",
  DESC: "desc",
} as const satisfies Record<"ASC" | "DESC", ArbitrageSortDir>;

export const ARBITRAGE_DEFAULT_SORT_BY: ArbitrageSortByApi =
  ArbitrageSortBy.net_spread_desc;
export const ARBITRAGE_DEFAULT_SORT_DIR: ArbitrageSortDir =
  ARBITRAGE_SORT_DIR.DESC;

export const ARBITRAGE_SORTABLE_COLUMN_ID = {
  NET_SPREAD_PCT: "netSpreadPct",
  ARBITRAGE_SCORE: "arbitrageScore",
  LIQUIDITY_CAPACITY_USD: "liquidityCapacityUsd",
} as const;

export type ArbitrageSortableColumnId =
  (typeof ARBITRAGE_SORTABLE_COLUMN_ID)[keyof typeof ARBITRAGE_SORTABLE_COLUMN_ID];

const SORT_BY_TO_COLUMN_ID = {
  [ArbitrageSortBy.net_spread_desc]:
    ARBITRAGE_SORTABLE_COLUMN_ID.NET_SPREAD_PCT,
  [ArbitrageSortBy.score_desc]: ARBITRAGE_SORTABLE_COLUMN_ID.ARBITRAGE_SCORE,
  [ArbitrageSortBy.liquidity_desc]:
    ARBITRAGE_SORTABLE_COLUMN_ID.LIQUIDITY_CAPACITY_USD,
} as const satisfies Record<ArbitrageSortByApi, ArbitrageSortableColumnId>;

const COLUMN_ID_TO_SORT_BY: Record<
  ArbitrageSortableColumnId,
  ArbitrageSortByApi
> = {
  [ARBITRAGE_SORTABLE_COLUMN_ID.NET_SPREAD_PCT]:
    ArbitrageSortBy.net_spread_desc,
  [ARBITRAGE_SORTABLE_COLUMN_ID.ARBITRAGE_SCORE]: ArbitrageSortBy.score_desc,
  [ARBITRAGE_SORTABLE_COLUMN_ID.LIQUIDITY_CAPACITY_USD]:
    ArbitrageSortBy.liquidity_desc,
};

export function arbitrageTableColumnIdForSortBy(
  sortBy: ArbitrageSortByApi,
): ArbitrageSortableColumnId {
  return SORT_BY_TO_COLUMN_ID[sortBy];
}

function isArbitrageSortableColumnId(
  id: string,
): id is ArbitrageSortableColumnId {
  return (
    id === ARBITRAGE_SORTABLE_COLUMN_ID.NET_SPREAD_PCT ||
    id === ARBITRAGE_SORTABLE_COLUMN_ID.ARBITRAGE_SCORE ||
    id === ARBITRAGE_SORTABLE_COLUMN_ID.LIQUIDITY_CAPACITY_USD
  );
}

export function isSortByForColumn(
  sortBy: ArbitrageSortByApi,
  columnId: string,
): boolean {
  if (!isArbitrageSortableColumnId(columnId)) return false;
  return COLUMN_ID_TO_SORT_BY[columnId] === sortBy;
}

export function arbitrageOpportunityStableId(
  row: ArbitrageOpportunity,
): string {
  return row.id ?? `${row.pair}|${row.buyExchange}|${row.sellExchange}`;
}

export function sortArbitrageOpportunitiesForDisplay(
  rows: ArbitrageOpportunity[],
  sortBy: ArbitrageSortByApi,
  dir: ArbitrageSortDir = ARBITRAGE_SORT_DIR.DESC,
): ArbitrageOpportunity[] {
  if (rows.length <= 1) return rows;

  const out = [...rows];
  const m = dir === ARBITRAGE_SORT_DIR.DESC ? 1 : -1;
  const byLastUpdated = (a: ArbitrageOpportunity, b: ArbitrageOpportunity) =>
    b.lastUpdated.localeCompare(a.lastUpdated);
  const byPair = (a: ArbitrageOpportunity, b: ArbitrageOpportunity) =>
    a.pair.localeCompare(b.pair);

  switch (sortBy) {
    case ArbitrageSortBy.net_spread_desc:
      out.sort((a, b) => {
        const d = (b.netSpreadPct - a.netSpreadPct) * m;
        if (d !== 0) return d;
        const d2 = (b.arbitrageScore - a.arbitrageScore) * m;
        if (d2 !== 0) return d2;
        const d3 = (b.liquidityCapacityUsd - a.liquidityCapacityUsd) * m;
        if (d3 !== 0) return d3;
        const d4 = byLastUpdated(a, b);
        if (d4 !== 0) return d4;
        return byPair(a, b);
      });
      break;
    case ArbitrageSortBy.score_desc:
      out.sort((a, b) => {
        const d = (b.arbitrageScore - a.arbitrageScore) * m;
        if (d !== 0) return d;
        const d2 = (b.netSpreadPct - a.netSpreadPct) * m;
        if (d2 !== 0) return d2;
        const d3 = (b.liquidityCapacityUsd - a.liquidityCapacityUsd) * m;
        if (d3 !== 0) return d3;
        const d4 = byLastUpdated(a, b);
        if (d4 !== 0) return d4;
        return byPair(a, b);
      });
      break;
    case ArbitrageSortBy.liquidity_desc:
      out.sort((a, b) => {
        const d = (b.liquidityCapacityUsd - a.liquidityCapacityUsd) * m;
        if (d !== 0) return d;
        const d2 = (b.arbitrageScore - a.arbitrageScore) * m;
        if (d2 !== 0) return d2;
        const d3 = (b.netSpreadPct - a.netSpreadPct) * m;
        if (d3 !== 0) return d3;
        const d4 = byLastUpdated(a, b);
        if (d4 !== 0) return d4;
        return byPair(a, b);
      });
      break;
  }
  return out;
}
