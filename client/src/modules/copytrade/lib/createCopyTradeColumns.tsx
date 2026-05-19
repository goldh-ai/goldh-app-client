import { createColumnHelper, type Column, type ColumnDef } from "@tanstack/react-table";
import type { CopyTradeSortByApi, CopyTradeTrader } from "@shared/types";
import {
  institutionalTableHeadLabelClass,
  institutionalTableSortGlyphActiveClass,
  institutionalTableSortGlyphMutedClass,
  institutionalTableSortHeaderButtonClass,
  institutionalTableCellInnerCenterClass,
  institutionalTableCellInnerRightClass,
  institutionalTableCellMonoClass,
  institutionalTableEntityTextClass,
  institutionalTableStickyFirstCellClass,
} from "@/lib/institutionalDataChrome";
import { arbitrageColumnLayout } from "@/modules/arbitrage/lib/arbitrageTableLayout";
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
import { InstitutionalScoreCell } from "@/components/shared/InstitutionalScoreCell";
import { CopyTradeRecommendedActionBadge } from "../components/CopyTradeRecommendedActionBadge";
import {
  copyTradeLastSeenTextClass,
  copyTradeMaxDrawdownPctTextClass,
  copyTradeMonthsActiveTextClass,
  copyTradeSignedPctTextClass,
  copyTradeTotalTradesTextClass,
  fmtCopyTradeMaxDrawdownPct,
  fmtCopyTradeRoiPct,
  fmtCopyTradeUpdated,
} from "./copyTradeFormat";

const columnHelper = createColumnHelper<CopyTradeTrader>();

/** Full field wording — shown via header `title`; visible labels stay compact. */
const CT_HDR_TIP = {
  traderIdName: "Trader ID / Name",
  roiTotalPct: "ROI Total (%)",
  maxDrawdownPct: "Max Drawdown (%)",
  monthsActive: "Months Active",
  totalTrades: "Total Trades",
  traderScore: "Trader Score (0–100)",
  grade: "Grade (A–F)",
  confidenceBand: "Confidence Band (High / Medium / Low)",
  capacityFlag: "Capacity Flag (Low / Medium / High)",
  signalState: "Signal State (Strong / Moderate / Weak / Invalid)",
  lastUpdated: "Last Updated",
  recommendedAction: "Recommended Action",
} as const;

/**
 * Same widths as Arbitrage “Pair” (`8.5rem` / `9.5rem`). Cell omits `whitespace-nowrap` so handle + ID stack;
 * header reuses Arbitrage pair thead classes.
 */
const copyTradeStickyNameMeta = {
  arbHeadClass: cn(arbitrageColumnLayout.pair.head, "overflow-hidden"),
  arbCellClass: cn(
    institutionalTableStickyFirstCellClass,
    "min-w-[8.5rem] w-[8.5rem] sm:min-w-[9.5rem] sm:w-[9.5rem]",
    "overflow-hidden",
    "shadow-[6px_0_18px_-4px_rgba(0,0,0,0.92)]",
  ),
} as const;

/** Handle + trader ID (two rows) inside Arbitrage-sized sticky lane; truncates when long. */
function CopyTradeNameCell({ handle, traderId }: { handle: string; traderId: string }) {
  return (
    <div className="flex min-h-10 w-full min-w-0 flex-col items-start justify-center gap-0.5 overflow-hidden py-0.5">
      <p className={cn("w-full min-w-0 truncate leading-tight", institutionalTableEntityTextClass)} title={handle}>
        {handle}
      </p>
      <span
        className="inline-flex max-w-full min-w-0 truncate rounded-sm border border-primary/30 bg-primary/10 px-1 py-0.5 font-mono text-xs uppercase tracking-wide text-primary/90"
        title={traderId}
      >
        {traderId}
      </span>
    </div>
  );
}

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

function StaticHeader({
  label,
  align = "left",
  title,
}: {
  label: string;
  align?: HeaderAlign;
  /** Native tooltip — typically full API / contract field wording. */
  title?: string;
}) {
  return (
    <span
      title={title}
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
  title?: string;
}) {
  const {
    label,
    column: _column,
    onSortByChange,
    sortBy,
    sortAsc,
    sortDesc,
    columnId,
    align = "left",
    title,
  } = props;
  const sorted = sortDirectionFor(sortBy, columnId);
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
        onSortByChange(sorted === "asc" ? sortDesc : sortAsc);
      }}
    >
      <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap">
        <span>{label}</span>
        <span className="hidden shrink-0 md:inline-flex">
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
};

export function createCopyTradeColumns(
  options: CreateCopyTradeColumnsOptions,
): ColumnDef<CopyTradeTrader>[] {
  const { sortBy, onSortByChange, onSelectTrader } = options;

  return [
    columnHelper.display({
      id: "name",
      header: () => (
        <StaticHeader label="Name" align="left" title={CT_HDR_TIP.traderIdName} />
      ),
      meta: copyTradeStickyNameMeta,
      cell: ({ row }) => (
        <CopyTradeNameCell handle={row.original.handle} traderId={row.original.traderId} />
      ),
    }),
    columnHelper.accessor("roiTotalPct", {
      id: "roiTotalPct",
      header: ({ column }) => (
        <ServerSortHeader
          label="ROI"
          title={CT_HDR_TIP.roiTotalPct}
          column={column}
          onSortByChange={onSortByChange}
          sortBy={sortBy}
          sortAsc={COPYTRADE_SORT_BY.ROI_ASC}
          sortDesc={COPYTRADE_SORT_BY.ROI_DESC}
          columnId="roiTotalPct"
          align="right"
        />
      ),
      enableSorting: true,
      cell: (info) => {
        const v = info.getValue();
        return (
          <div className={institutionalTableCellInnerRightClass}>
            <p
              className={cn(
                institutionalTableCellMonoClass,
                copyTradeSignedPctTextClass(v),
                "text-right",
              )}
            >
              {fmtCopyTradeRoiPct(v)}
            </p>
          </div>
        );
      },
      meta: { arbHeadClass: "min-w-[5rem]", arbCellClass: "min-w-[5rem]" },
    }),
    columnHelper.accessor("maxDrawdownPct", {
      id: "maxDrawdownPct",
      header: ({ column }) => (
        <ServerSortHeader
          label="Max DD"
          title={CT_HDR_TIP.maxDrawdownPct}
          column={column}
          onSortByChange={onSortByChange}
          sortBy={sortBy}
          sortAsc={COPYTRADE_SORT_BY.MAX_DRAWDOWN_ASC}
          sortDesc={COPYTRADE_SORT_BY.MAX_DRAWDOWN_DESC}
          columnId="maxDrawdownPct"
          align="center"
        />
      ),
      enableSorting: true,
      cell: (info) => {
        const v = info.getValue();
        return (
          <div className={institutionalTableCellInnerCenterClass}>
            <p
              className={cn(
                institutionalTableCellMonoClass,
                copyTradeMaxDrawdownPctTextClass(v),
                "text-center",
              )}
            >
              {fmtCopyTradeMaxDrawdownPct(v)}
            </p>
          </div>
        );
      },
      meta: { arbHeadClass: "min-w-[5rem]", arbCellClass: "min-w-[5rem]" },
    }),
    columnHelper.accessor("monthsActive", {
      id: "monthsActive",
      header: ({ column }) => (
        <ServerSortHeader
          label="Months"
          title={CT_HDR_TIP.monthsActive}
          column={column}
          onSortByChange={onSortByChange}
          sortBy={sortBy}
          sortAsc={COPYTRADE_SORT_BY.MONTHS_ACTIVE_ASC}
          sortDesc={COPYTRADE_SORT_BY.MONTHS_ACTIVE_DESC}
          columnId="monthsActive"
          align="center"
        />
      ),
      enableSorting: true,
      cell: (info) => {
        const v = info.getValue();
        return (
          <div className={institutionalTableCellInnerCenterClass}>
            <p
              className={cn(
                institutionalTableCellMonoClass,
                copyTradeMonthsActiveTextClass(v),
              )}
            >
              {v === null ? "—" : String(v)}
            </p>
          </div>
        );
      },
      meta: { arbHeadClass: "min-w-[4.5rem]", arbCellClass: "min-w-[4.5rem]" },
    }),
    columnHelper.accessor("totalTrades", {
      header: () => (
        <StaticHeader label="Trades" align="center" title={CT_HDR_TIP.totalTrades} />
      ),
      enableSorting: false,
      cell: (info) => {
        const v = info.getValue();
        return (
          <div className={institutionalTableCellInnerCenterClass}>
            <p
              className={cn(
                institutionalTableCellMonoClass,
                copyTradeTotalTradesTextClass(v),
              )}
            >
              {v === null ? "—" : String(v)}
            </p>
          </div>
        );
      },
      meta: { arbHeadClass: "min-w-[4.5rem]", arbCellClass: "min-w-[4.5rem]" },
    }),
    columnHelper.accessor("score", {
      header: ({ column }) => (
        <ServerSortHeader
          label="Score"
          title={CT_HDR_TIP.traderScore}
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
        <InstitutionalScoreCell score={info.getValue()} />
      ),
      meta: { arbHeadClass: "min-w-[7rem]", arbCellClass: "min-w-[7rem]" },
    }),
    columnHelper.accessor("grade", {
      header: () => (
        <StaticHeader label="Grade" align="center" title={CT_HDR_TIP.grade} />
      ),
      enableSorting: false,
      cell: (info) => (
        <div className={institutionalTableCellInnerCenterClass}>
          <CopyTradeGradeBadge grade={info.getValue()} />
        </div>
      ),
      meta: { arbHeadClass: "min-w-[4.75rem]", arbCellClass: "min-w-[4.75rem]" },
    }),
    columnHelper.accessor("confidenceBand", {
      header: () => (
        <StaticHeader
          label="Confidence"
          align="center"
          title={CT_HDR_TIP.confidenceBand}
        />
      ),
      enableSorting: false,
      cell: (info) => (
        <div className={institutionalTableCellInnerCenterClass}>
          <CopyTradeConfidenceBadge band={info.getValue()} />
        </div>
      ),
      meta: { arbHeadClass: "min-w-[5.5rem]", arbCellClass: "min-w-[5.5rem]" },
    }),
    columnHelper.accessor("capacityFlag", {
      header: () => (
        <StaticHeader label="Capacity" align="center" title={CT_HDR_TIP.capacityFlag} />
      ),
      enableSorting: false,
      cell: (info) => (
        <div className={institutionalTableCellInnerCenterClass}>
          <CopyTradeCapacityBadge capacity={info.getValue()} />
        </div>
      ),
      meta: { arbHeadClass: "min-w-[5.5rem]", arbCellClass: "min-w-[5.5rem]" },
    }),
    columnHelper.accessor("signalState", {
      header: () => (
        <StaticHeader label="Signal" align="center" title={CT_HDR_TIP.signalState} />
      ),
      enableSorting: false,
      cell: (info) => (
        <div className={institutionalTableCellInnerCenterClass}>
          <CopyTradeSignalBadge state={info.getValue()} />
        </div>
      ),
      meta: { arbHeadClass: "min-w-[6rem]", arbCellClass: "min-w-[6rem]" },
    }),
    columnHelper.accessor("lastSeenAt", {
      id: "lastSeenAt",
      header: ({ column }) => (
        <ServerSortHeader
          label="Updated"
          title={CT_HDR_TIP.lastUpdated}
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
      cell: (info) => {
        const iso = info.getValue();
        return (
          <div className={institutionalTableCellInnerRightClass}>
            <p
              className={cn(
                institutionalTableCellMonoClass,
                copyTradeLastSeenTextClass(iso),
                "whitespace-nowrap text-right text-[11px] leading-none sm:text-xs",
              )}
              title={iso}
            >
              {fmtCopyTradeUpdated(iso)}
            </p>
          </div>
        );
      },
      meta: { arbHeadClass: "min-w-[7.75rem]", arbCellClass: "min-w-[7.75rem]" },
    }),
    columnHelper.display({
      id: "recommendedAction",
      header: () => (
        <StaticHeader label="Action" align="center" title={CT_HDR_TIP.recommendedAction} />
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
  ] as ColumnDef<CopyTradeTrader>[];
}
