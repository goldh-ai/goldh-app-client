import {
  createColumnHelper,
  type Column,
  type ColumnDef,
} from "@tanstack/react-table";
import type { ArbitrageOpportunity, ArbitrageSortByApi } from "@shared/types";
import {
  institutionalTableHeadLabelClass,
  institutionalTableSortGlyphActiveClass,
  institutionalTableSortGlyphMutedClass,
  institutionalTableSortHeaderButtonClass,
} from "@/lib/institutionalDataChrome";
import { cn } from "@/lib/utils";
import {
  ArbitrageComplexityCell,
  ArbitrageConfidenceCell,
  ArbitrageGradeCell,
  ArbitrageMutedTextCell,
  ArbitrageNetSpreadCell,
  ArbitragePairCell,
  ArbitragePctCell,
  ArbitrageScoreCell,
  ArbitrageSignalCell,
  ArbitrageUpdatedCell,
  ArbitrageUsdCell,
} from "./ArbitrageColumnCells";
import { arbitrageColumnLayout, type ArbitrageColumnLayoutKey } from "./arbitrageTableLayout";
import {
  ArbitrageSortBy,
  ARBITRAGE_SORTABLE_COLUMN_ID,
  ARBITRAGE_SORT_DIR,
} from "./arbitrageSort";

const columnHelper = createColumnHelper<ArbitrageOpportunity>();

type HeaderAlign = "left" | "center" | "right";

const headerAlignClass: Record<HeaderAlign, string> = {
  left: "justify-start text-left",
  center: "justify-center text-center",
  right: "justify-end text-right",
};

function arbMeta(key: ArbitrageColumnLayoutKey) {
  const L = arbitrageColumnLayout[key];
  return {
    meta: {
      arbHeadClass: L.head,
      arbCellClass: L.cell,
    },
  };
}

function StaticHeader({ label, align = "left" }: { label: string; align?: HeaderAlign }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-0 w-full min-w-0 items-center whitespace-nowrap",
        headerAlignClass[align],
        institutionalTableHeadLabelClass,
      )}
    >
      {label}
    </span>
  );
}

function SortDirectionIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === ARBITRAGE_SORT_DIR.ASC) {
    return (
      <span className={institutionalTableSortGlyphActiveClass} aria-hidden>
        {"\u2191"}
      </span>
    );
  }
  if (sorted === ARBITRAGE_SORT_DIR.DESC) {
    return (
      <span className={institutionalTableSortGlyphActiveClass} aria-hidden>
        {"\u2193"}
      </span>
    );
  }
  return (
    <span className={institutionalTableSortGlyphMutedClass} aria-hidden>
      {"\u2195"}
    </span>
  );
}

function ServerSortHeader(props: {
  label: string;
  column: Column<ArbitrageOpportunity, unknown>;
  onSortByChange: (next: ArbitrageSortByApi) => void;
  apiKey: ArbitrageSortByApi;
  align?: HeaderAlign;
  title?: string;
}) {
  const { label, column, onSortByChange, apiKey, align = "left", title } = props;
  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      title={title}
      className={cn(
        institutionalTableSortHeaderButtonClass,
        headerAlignClass[align],
        institutionalTableHeadLabelClass,
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSortByChange(apiKey);
      }}
    >
      <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap">
        <span>{label}</span>
        <span className="hidden md:inline-flex">
          <SortDirectionIcon sorted={sorted} />
        </span>
      </span>
    </button>
  );
}

export type CreateArbitrageColumnsOptions = {
  onSortByChange: (next: ArbitrageSortByApi) => void;
};

export function createArbitrageColumns(
  options: CreateArbitrageColumnsOptions,
): ColumnDef<ArbitrageOpportunity>[] {
  const { onSortByChange } = options;

  return [
    columnHelper.accessor("pair", {
      ...arbMeta("pair"),
      header: () => <StaticHeader label="Pair" align="left" />,
      enableSorting: false,
      cell: (info) => <ArbitragePairCell pair={info.getValue()} />,
    }),
    columnHelper.accessor("buyExchange", {
      ...arbMeta("buyExchange"),
      header: () => <StaticHeader label="Buy" align="left" />,
      enableSorting: false,
      cell: (info) => <ArbitrageMutedTextCell text={info.getValue()} />,
    }),
    columnHelper.accessor("sellExchange", {
      ...arbMeta("sellExchange"),
      header: () => <StaticHeader label="Sell" align="left" />,
      enableSorting: false,
      cell: (info) => <ArbitrageMutedTextCell text={info.getValue()} />,
    }),
    columnHelper.accessor("grossSpreadPct", {
      ...arbMeta("grossSpreadPct"),
      header: () => <StaticHeader label="Gross %" align="center" />,
      enableSorting: false,
      cell: (info) => <ArbitragePctCell pct={info.getValue()} align="center" />,
    }),
    columnHelper.accessor(ARBITRAGE_SORTABLE_COLUMN_ID.NET_SPREAD_PCT, {
      ...arbMeta("netSpreadPct"),
      header: ({ column }) => (
        <ServerSortHeader
          label="Net %"
          column={column}
          onSortByChange={onSortByChange}
          apiKey={ArbitrageSortBy.net_spread_desc}
          align="center"
        />
      ),
      enableSorting: true,
      cell: (info) => <ArbitrageNetSpreadCell netPct={info.getValue()} align="center" />,
    }),
    columnHelper.accessor(ARBITRAGE_SORTABLE_COLUMN_ID.LIQUIDITY_CAPACITY_USD, {
      ...arbMeta("liquidityCapacityUsd"),
      header: ({ column }) => (
        <ServerSortHeader
          label="Liquidity"
          column={column}
          onSortByChange={onSortByChange}
          apiKey={ArbitrageSortBy.liquidity_desc}
          align="center"
        />
      ),
      enableSorting: true,
      cell: (info) => <ArbitrageUsdCell usd={info.getValue()} align="center" />,
    }),
    columnHelper.accessor("executableTradeSizeUsd", {
      ...arbMeta("executableTradeSizeUsd"),
      header: () => <StaticHeader label="Exec size" align="center" />,
      enableSorting: false,
      cell: (info) => <ArbitrageUsdCell usd={info.getValue()} align="center" />,
    }),
    columnHelper.accessor(ARBITRAGE_SORTABLE_COLUMN_ID.ARBITRAGE_SCORE, {
      ...arbMeta("arbitrageScore"),
      header: ({ column }) => (
        <ServerSortHeader
          label="Score"
          column={column}
          onSortByChange={onSortByChange}
          apiKey={ArbitrageSortBy.score_desc}
          align="center"
        />
      ),
      enableSorting: true,
      cell: (info) => <ArbitrageScoreCell score={info.getValue()} />,
    }),
    columnHelper.accessor("grade", {
      ...arbMeta("grade"),
      header: () => <StaticHeader label="Grade" align="center" />,
      enableSorting: false,
      cell: (info) => <ArbitrageGradeCell grade={info.getValue()} />,
    }),
    columnHelper.accessor("confidenceBand", {
      ...arbMeta("confidenceBand"),
      header: () => <StaticHeader label="Conf." align="center" />,
      enableSorting: false,
      cell: (info) => <ArbitrageConfidenceCell band={info.getValue()} />,
    }),
    columnHelper.accessor("executionComplexity", {
      ...arbMeta("executionComplexity"),
      header: () => <StaticHeader label="Complexity" align="center" />,
      enableSorting: false,
      cell: (info) => <ArbitrageComplexityCell level={info.getValue()} />,
    }),
    columnHelper.accessor("signalState", {
      ...arbMeta("signalState"),
      header: () => <StaticHeader label="Signal" align="center" />,
      enableSorting: false,
      cell: (info) => <ArbitrageSignalCell state={info.getValue()} />,
    }),
    columnHelper.accessor("lastUpdated", {
      ...arbMeta("lastUpdated"),
      header: () => <StaticHeader label="Updated" align="right" />,
      enableSorting: false,
      cell: (info) => <ArbitrageUpdatedCell iso={info.getValue()} align="right" />,
    }),
  ] as ColumnDef<ArbitrageOpportunity>[];
}
