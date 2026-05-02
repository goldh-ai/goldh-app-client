import { createColumnHelper, type Column, type ColumnDef } from "@tanstack/react-table";
import type { CopyTradeSortByApi, CopyTradeTrader } from "@shared/types";
import {
  institutionalTableHeadLabelClass,
  institutionalTableSortGlyphActiveClass,
  institutionalTableSortGlyphMutedClass,
  institutionalTableSortHeaderButtonClass,
  institutionalTableCellInnerCenterClass,
  institutionalTableCellInnerLeftClass,
  institutionalTableCellMonoClass,
  institutionalTableEntityTextClass,
  institutionalTableCellTextClass,
} from "@/lib/institutionalDataChrome";
import { cn } from "@/lib/utils";
import {
  COPYTRADE_SORT_BY,
  type CopyTradeSortableColumnId,
  copyTradeTableColumnIdForSortBy,
} from "./copyTradeSort";
import {
  CopyTradeCapacityBadge,
  CopyTradeConfidenceBadge,
  CopyTradeGradeBadge,
  CopyTradeSignalBadge,
} from "./copyTradeBadges";
import { CopyTradeRecommendedActionBadge } from "../components/CopyTradeRecommendedActionBadge";
import { fmtCopyTradeMomentum, fmtCopyTradeScore } from "./copyTradeFormat";

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
          <SortDirectionIcon sorted={sorted} />
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
            "flex min-h-10 w-full min-w-[7.25rem] flex-col items-start justify-center rounded-md px-1 py-1 text-left outline-none transition focus-visible:ring-1 focus-visible:ring-primary/60",
            selectedTraderId === row.original.traderId &&
            "bg-primary/12",
          )}
        >
          <p className={cn("truncate leading-tight", institutionalTableEntityTextClass)}>{row.original.handle}</p>
          <p className="mt-0.5 inline-flex rounded-sm border border-primary/30 bg-primary/10 px-1 py-0.5 font-mono text-xs uppercase tracking-wide text-primary/90">
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
      cell: (info) => (
        <div className={institutionalTableCellInnerCenterClass}>
          <p className={institutionalTableCellMonoClass}>#{info.getValue()}</p>
        </div>
      ),
      meta: { arbHeadClass: "min-w-[4.75rem]", arbCellClass: "min-w-[4.75rem]" },
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
      cell: (info) => (
        <div className={institutionalTableCellInnerCenterClass}>
          <p className={institutionalTableCellMonoClass}>{fmtCopyTradeScore(info.getValue())}</p>
        </div>
      ),
      meta: { arbHeadClass: "min-w-[4.5rem]", arbCellClass: "min-w-[4.5rem]" },
    }),
    columnHelper.accessor("grade", {
      header: () => <StaticHeader label="Grade" align="center" />,
      enableSorting: false,
      cell: (info) => (
        <div className={institutionalTableCellInnerCenterClass}>
          <CopyTradeGradeBadge grade={info.getValue()} />
        </div>
      ),
      meta: { arbHeadClass: "min-w-[4.75rem]", arbCellClass: "min-w-[4.75rem]" },
    }),
    columnHelper.accessor("confidenceBand", {
      header: () => <StaticHeader label="Confidence" align="center" />,
      enableSorting: false,
      cell: (info) => (
        <div className={institutionalTableCellInnerCenterClass}>
          <CopyTradeConfidenceBadge band={info.getValue()} />
        </div>
      ),
      meta: { arbHeadClass: "min-w-[5rem]", arbCellClass: "min-w-[5rem]" },
    }),
    columnHelper.accessor("signalState", {
      header: () => <StaticHeader label="Signal" align="center" />,
      enableSorting: false,
      cell: (info) => (
        <div className={institutionalTableCellInnerCenterClass}>
          <CopyTradeSignalBadge state={info.getValue()} />
        </div>
      ),
      meta: { arbHeadClass: "min-w-[5rem]", arbCellClass: "min-w-[5rem]" },
    }),
    columnHelper.display({
      id: "recommendedAction",
      header: () => (
        <StaticHeader label="Action" align="center" />
      ),
      cell: ({ row }) => (
        <div className={cn(institutionalTableCellInnerCenterClass, "px-0.5")}>
          <CopyTradeRecommendedActionBadge
            grade={row.original.grade}
            confidenceBand={row.original.confidenceBand}
            signalState={row.original.signalState}
            lifecycleState={row.original.lifecycleState}
            capacityFlag={row.original.capacityFlag}
            size="compact"
            onActivate={
              onSelectTrader
                ? () => onSelectTrader(row.original.traderId)
                : undefined
            }
          />
        </div>
      ),
      meta: {
        arbHeadClass: "min-w-[6rem]",
        arbCellClass: "min-w-[6rem]",
      },
    }),
    columnHelper.accessor("rankChange7d", {
      header: () => <StaticHeader label="Rank ↑ 7d" align="center" />,
      enableSorting: false,
      cell: (info) => {
        const value = info.getValue();
        if (value === null) {
          return (
            <div className={institutionalTableCellInnerCenterClass}>
              <p
                className={cn(institutionalTableCellTextClass, "text-sm")}
                title="No 7-day rank change info available"
              >
                —
              </p>
            </div>
          );
        }
        const tone = value > 0 ? "text-chart-4" : value < 0 ? "text-destructive" : "text-muted-foreground";
        return (
          <div className={institutionalTableCellInnerCenterClass}>
            <p className={cn(institutionalTableCellMonoClass, tone)}>{value > 0 ? `+${value}` : value}</p>
          </div>
        );
      },
      meta: { arbHeadClass: "min-w-[4.75rem]", arbCellClass: "min-w-[4.75rem]" },
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
      cell: (info) => (
        <div className={institutionalTableCellInnerCenterClass}>
          <p className={institutionalTableCellMonoClass}>{fmtCopyTradeMomentum(info.getValue())}</p>
        </div>
      ),
      meta: { arbHeadClass: "min-w-[4.75rem]", arbCellClass: "min-w-[4.75rem]" },
    }),
    columnHelper.accessor("profileTag", {
      header: () => <StaticHeader label="Profile" align="center" />,
      enableSorting: false,
      cell: (info) => {
        const tag = info.getValue();
        return (
          <div className={institutionalTableCellInnerCenterClass}>
            <p
              className="w-full truncate text-center text-xs font-medium uppercase tracking-wide text-muted-foreground"
              title={tag ? undefined : "No profile info available"}
            >
              {tag ?? "—"}
            </p>
          </div>
        );
      },
      meta: { arbHeadClass: "min-w-[5.25rem]", arbCellClass: "min-w-[5.25rem]" },
    }),
    columnHelper.accessor("capacityFlag", {
      header: () => <StaticHeader label="Capacity" align="center" />,
      enableSorting: false,
      cell: (info) => (
        <div className={institutionalTableCellInnerCenterClass}>
          <CopyTradeCapacityBadge capacity={info.getValue()} />
        </div>
      ),
      meta: { arbHeadClass: "min-w-[5.25rem]", arbCellClass: "min-w-[5.25rem]" },
    }),
  ] as ColumnDef<CopyTradeTrader>[];
}
