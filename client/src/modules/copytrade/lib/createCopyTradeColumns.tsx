import { createColumnHelper, type Column, type ColumnDef } from "@tanstack/react-table";
import type { CopyTradeSortByApi, CopyTradeTrader } from "@shared/types";
import {
  institutionalTableHeadLabelClass,
  institutionalTableSortGlyphActiveClass,
  institutionalTableSortGlyphMutedClass,
  institutionalTableSortHeaderButtonClass,
} from "@/lib/institutionalDataChrome";
import { cn } from "@/lib/utils";
import {
  COPYTRADE_SORT_BY,
  type CopyTradeSortableColumnId,
  copyTradeTableColumnIdForSortBy,
} from "./copyTradeSort";
import {
  CopyTradeConfidenceBadge,
  CopyTradeGradeBadge,
  CopyTradeSignalBadge,
  CopyTradeStatusBadge,
} from "./copyTradeBadges";
import { fmtCopyTradeMomentum, fmtCopyTradeScore, fmtCopyTradeUpdated } from "./copyTradeFormat";

const columnHelper = createColumnHelper<CopyTradeTrader>();

type HeaderAlign = "left" | "center" | "right";

const headerAlignClass: Record<HeaderAlign, string> = {
  left: "justify-start text-left",
  center: "justify-center text-center",
  right: "justify-end text-right",
};

function sortDirectionFor(
  sortBy: CopyTradeSortByApi,
  columnId: CopyTradeSortableColumnId,
): false | "asc" | "desc" {
  if (copyTradeTableColumnIdForSortBy(sortBy) !== columnId) return false;
  return sortBy.endsWith("_asc") ? "asc" : "desc";
}

function SortDirectionIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") {
    return (
      <span className={institutionalTableSortGlyphActiveClass} aria-hidden>
        {"\u2191"}
      </span>
    );
  }
  if (sorted === "desc") {
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

function ServerSortHeader(props: {
  label: string;
  column: Column<CopyTradeTrader, unknown>;
  onSortByChange: (next: CopyTradeSortByApi) => void;
  sortBy: CopyTradeSortByApi;
  sortAsc: CopyTradeSortByApi;
  sortDesc: CopyTradeSortByApi;
  columnId: CopyTradeSortableColumnId;
  align?: HeaderAlign;
}) {
  const {
    label,
    column,
    onSortByChange,
    sortBy,
    sortAsc,
    sortDesc,
    columnId,
    align = "left",
  } = props;
  const sorted = sortDirectionFor(sortBy, columnId);
  return (
    <button
      type="button"
      className={cn(
        institutionalTableSortHeaderButtonClass,
        headerAlignClass[align],
        institutionalTableHeadLabelClass,
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSortByChange(sorted === "asc" ? sortDesc : sortAsc);
      }}
    >
      <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap">
        <span>{label}</span>
        <span className="hidden md:inline-flex">
          <SortDirectionIcon sorted={column.getIsSorted() ? sorted : sorted} />
        </span>
      </span>
    </button>
  );
}

export type CreateCopyTradeColumnsOptions = {
  sortBy: CopyTradeSortByApi;
  onSortByChange: (next: CopyTradeSortByApi) => void;
  onSelectTrader?: (traderId: string) => void;
  selectedTraderId?: string | null;
};

export function createCopyTradeColumns(
  options: CreateCopyTradeColumnsOptions,
): ColumnDef<CopyTradeTrader>[] {
  const { sortBy, onSortByChange, onSelectTrader, selectedTraderId } = options;

  return [
    columnHelper.display({
      id: "name",
      header: () => <StaticHeader label="Name" />,
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onSelectTrader?.(row.original.traderId)}
          className={cn(
            "w-full min-w-[10rem] rounded-md px-2 py-1.5 text-left outline-none transition focus-visible:ring-1 focus-visible:ring-[#C7AE6A]/60",
            selectedTraderId === row.original.traderId &&
            "bg-[#C7AE6A]/12",
          )}
        >
          <p className="font-semibold leading-tight text-foreground">{row.original.handle}</p>
          <p className="mt-1 inline-flex rounded-sm border border-[#2d2716] bg-[#15120a] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[#d4bf86]">
            {row.original.traderId}
          </p>
        </button>
      ),
    }),
    columnHelper.accessor("computedRank", {
      id: "computedRank",
      header: ({ column }) => (
        <ServerSortHeader
          label="Rank"
          column={column}
          onSortByChange={onSortByChange}
          sortBy={sortBy}
          sortAsc={COPYTRADE_SORT_BY.RANK_ASC}
          sortDesc={COPYTRADE_SORT_BY.RANK_DESC}
          columnId="computedRank"
          align="center"
        />
      ),
      enableSorting: true,
      cell: (info) => <p className="text-center font-mono text-sm">#{info.getValue()}</p>,
      meta: { arbHeadClass: "min-w-[5.5rem]", arbCellClass: "min-w-[5.5rem]" },
    }),
    columnHelper.accessor("rankChange7d", {
      header: () => <StaticHeader label="Rank ↑ 7d" align="center" />,
      enableSorting: false,
      cell: (info) => {
        const value = info.getValue();
        const tone = value > 0 ? "text-chart-4" : value < 0 ? "text-destructive" : "text-muted-foreground";
        return <p className={cn("text-center font-mono text-sm", tone)}>{value > 0 ? `+${value}` : value}</p>;
      },
      meta: { arbHeadClass: "min-w-[6rem]", arbCellClass: "min-w-[6rem]" },
    }),
    columnHelper.accessor("score", {
      header: ({ column }) => (
        <ServerSortHeader
          label="Score"
          column={column}
          onSortByChange={onSortByChange}
          sortBy={sortBy}
          sortAsc={COPYTRADE_SORT_BY.SCORE_ASC}
          sortDesc={COPYTRADE_SORT_BY.SCORE_DESC}
          columnId="score"
          align="center"
        />
      ),
      enableSorting: true,
      cell: (info) => <p className="text-center font-mono text-sm">{fmtCopyTradeScore(info.getValue())}</p>,
      meta: { arbHeadClass: "min-w-[5rem]", arbCellClass: "min-w-[5rem]" },
    }),
    columnHelper.accessor("momentum", {
      header: ({ column }) => (
        <ServerSortHeader
          label="Momentum"
          column={column}
          onSortByChange={onSortByChange}
          sortBy={sortBy}
          sortAsc={COPYTRADE_SORT_BY.MOMENTUM_ASC}
          sortDesc={COPYTRADE_SORT_BY.MOMENTUM_DESC}
          columnId="momentum"
          align="center"
        />
      ),
      enableSorting: true,
      cell: (info) => <p className="text-center font-mono text-sm">{fmtCopyTradeMomentum(info.getValue())}</p>,
      meta: { arbHeadClass: "min-w-[6rem]", arbCellClass: "min-w-[6rem]" },
    }),
    columnHelper.accessor("grade", {
      header: () => <StaticHeader label="Grade" align="center" />,
      enableSorting: false,
      cell: (info) => <CopyTradeGradeBadge grade={info.getValue()} />,
      meta: { arbHeadClass: "min-w-[5.75rem]", arbCellClass: "min-w-[5.75rem]" },
    }),
    columnHelper.accessor("confidenceBand", {
      header: () => <StaticHeader label="Confidence" align="center" />,
      enableSorting: false,
      cell: (info) => <CopyTradeConfidenceBadge band={info.getValue()} />,
      meta: { arbHeadClass: "min-w-[6.25rem]", arbCellClass: "min-w-[6.25rem]" },
    }),
    columnHelper.accessor("signalState", {
      header: () => <StaticHeader label="Signal" align="center" />,
      enableSorting: false,
      cell: (info) => <CopyTradeSignalBadge state={info.getValue()} />,
      meta: { arbHeadClass: "min-w-[6.25rem]", arbCellClass: "min-w-[6.25rem]" },
    }),
    columnHelper.accessor("lifecycleState", {
      header: () => <StaticHeader label="Status" align="center" />,
      enableSorting: false,
      cell: (info) => <CopyTradeStatusBadge status={info.getValue()} />,
      meta: { arbHeadClass: "min-w-[7rem]", arbCellClass: "min-w-[7rem]" },
    }),
    columnHelper.accessor("lastSeenAt", {
      id: "lastSeenAt",
      header: ({ column }) => (
        <ServerSortHeader
          label="Last Seen"
          column={column}
          onSortByChange={onSortByChange}
          sortBy={sortBy}
          sortAsc={COPYTRADE_SORT_BY.LAST_SEEN_ASC}
          sortDesc={COPYTRADE_SORT_BY.LAST_SEEN_DESC}
          columnId="lastSeenAt"
          align="right"
        />
      ),
      enableSorting: true,
      cell: (info) => <p className="text-right font-mono text-xs">{fmtCopyTradeUpdated(info.getValue())}</p>,
      meta: { arbHeadClass: "min-w-[6.25rem]", arbCellClass: "min-w-[6.25rem]" },
    }),
  ] as ColumnDef<CopyTradeTrader>[];
}
