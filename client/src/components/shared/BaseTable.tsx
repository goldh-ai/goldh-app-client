import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  INSTITUTIONAL_TABLE_SHELL,
  institutionalTableBodyCellBaseClass,
  institutionalTableBodyDivideClass,
  institutionalTableCaptionLabelClass,
  institutionalTableDataRowClass,
  institutionalTableFooterStripClass,
  institutionalTableHeadCellBaseClass,
  institutionalTableHeadLabelClass,
  institutionalTableHeadStickyClass,
  institutionalTableShellButtonClass,
  institutionalTableSkeletonTheadClass,
} from "@/lib/institutionalDataChrome";

export type BaseTablePaginationConfig = {
  /** Rows per page (default 25). */
  pageSize: number;
  /** When this value changes, the table resets to the first page (e.g. filters or sort key). */
  resetKey?: string;
};

export type BaseTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  totalCount?: number;
  isLoading: boolean;
  isError: boolean;
  /** TanStack manual sort mode — use when sort order is controlled outside the table (e.g. server / custom headers). */
  manualSorting?: boolean;
  /** When provided with `manualSorting`, syncs TanStack sorting state so `column.getIsSorted()` reflects UI. */
  sorting?: SortingState;
  getRowId?: (row: TData, index: number) => string;
  pagination: BaseTablePaginationConfig;
  /** Min width class for horizontal scroll (e.g. wide institutional tables). */
  tableMinWidthClassName?: string;
  /** Number of skeleton columns when loading (defaults to 8). */
  skeletonColumnCount?: number;
  skeletonRowCount?: number;
  fillAvailableHeight?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onClearFilters?: () => void;
  /** Shown when `isError && data.length === 0 && !isLoading`. */
  renderError?: ReactNode;
  /** Optional footer below pagination (e.g. disclaimers). */
  children?: ReactNode;
  /** Renders below the scrollable grid at full card width (e.g. server pager + copy). */
  tableFooter?: ReactNode;
  /** Render built-in local pagination controls (defaults to true). */
  showPagination?: boolean;
};

function TableLoadingSkeleton({
  columns,
  rows,
  minWidthClassName,
}: {
  columns: number;
  rows: number;
  minWidthClassName: string;
}) {
  return (
    <table className={cn("w-full text-left", minWidthClassName)}>
      <thead className={institutionalTableSkeletonTheadClass}>
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-4 py-3.5">
              <Skeleton className="h-3 w-16 bg-white/5" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={institutionalTableBodyDivideClass}>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className="h-[52px]">
            {Array.from({ length: columns }).map((_, j) => (
              <td
                key={j}
                className={cn(
                  "border-x-0 border-t-0 border-b border-[#1a1a1a]/70 px-4 py-0",
                  i === rows - 1 && "border-b-0",
                )}
              >
                <Skeleton className="h-4 w-full max-w-[80px] bg-white/5" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function getMetaCellClass(meta: unknown): string | undefined {
  if (!meta || typeof meta !== "object") return undefined;
  const m = meta as Record<string, unknown>;
  return (
    (m.arbCellClass as string | undefined) ??
    (m.cellClass as string | undefined)
  );
}

function getMetaHeadClass(meta: unknown): string | undefined {
  if (!meta || typeof meta !== "object") return undefined;
  const m = meta as Record<string, unknown>;
  return (
    (m.arbHeadClass as string | undefined) ??
    (m.headClass as string | undefined)
  );
}

export function BaseTable<TData>({
  columns,
  data,
  totalCount,
  isLoading,
  isError,
  manualSorting = true,
  sorting,
  getRowId,
  pagination,
  tableMinWidthClassName = "min-w-[1000px] relative",
  skeletonColumnCount = 8,
  skeletonRowCount: skeletonRowCountProp,
  fillAvailableHeight = false,
  emptyTitle = "No matching rows",
  emptyDescription = "Refine filters or clear to show all rows.",
  onClearFilters,
  renderError,
  children,
  tableFooter,
  showPagination = true,
}: BaseTableProps<TData>) {
  const pageSize = pagination.pageSize;
  const effectiveSkeletonRows =
    skeletonRowCountProp ?? Math.min(Math.max(1, pageSize), 100);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  useEffect(() => {
    setPaginationState((s) => ({ ...s, pageSize }));
  }, [pageSize]);

  useEffect(() => {
    setPaginationState((s) => ({ ...s, pageIndex: 0 }));
  }, [pagination.resetKey]);

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    setPaginationState(updater);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: paginationState,
      ...(sorting !== undefined ? { sorting } : {}),
    },
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting,
    getRowId,
    defaultColumn: { enableSorting: false },
  });

  const showTableFooterWhileLoading = Boolean(
    showPagination || children || tableFooter,
  );
  const scrollAreaClass = fillAvailableHeight
    ? "custom-scrollbar min-h-0 flex-1 overflow-auto [scrollbar-gutter:stable]"
    : "custom-scrollbar max-h-[70vh] min-h-0 overflow-auto [scrollbar-gutter:stable]";

  if (isLoading) {
    return (
      <div
        className={cn(
          INSTITUTIONAL_TABLE_SHELL,
          "flex flex-col",
          fillAvailableHeight ? "h-full min-h-0 flex-1 overflow-hidden" : "overflow-visible",
        )}
      >
        <div
          className={cn(
            scrollAreaClass,
            showTableFooterWhileLoading ? "rounded-t-2xl" : "rounded-2xl",
          )}
        >
          <TableLoadingSkeleton
            columns={skeletonColumnCount}
            rows={effectiveSkeletonRows}
            minWidthClassName={tableMinWidthClassName}
          />
        </div>
        {showTableFooterWhileLoading ? (
          <div className={institutionalTableFooterStripClass}>
            <div className="space-y-3">
              {tableFooter}
              {showPagination ? (
                <nav
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                  aria-label="Table pagination"
                >
                  <p className={institutionalTableCaptionLabelClass}>Loading…</p>
                </nav>
              ) : null}
              {children}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (isError && data.length === 0) {
    return (
      <div className={INSTITUTIONAL_TABLE_SHELL}>
        {renderError ?? (
          <div className="flex min-h-[12rem] flex-col items-center justify-center gap-2 p-8 text-center text-sm text-gray-500">
            Could not load data.
          </div>
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={cn(
          INSTITUTIONAL_TABLE_SHELL,
          "flex min-h-[12rem] flex-col items-center justify-center gap-3 p-8 text-center",
        )}
      >
        <p className="text-lg font-bold uppercase tracking-widest text-gray-400">
          {emptyTitle}
        </p>
        <p className="text-sm text-gray-500">{emptyDescription}</p>
        {onClearFilters ? (
          <Button
            variant="outline"
            size="sm"
            className={institutionalTableShellButtonClass}
            onClick={onClearFilters}
          >
            Clear filters
          </Button>
        ) : null}
      </div>
    );
  }

  const pageIndex = table.getState().pagination.pageIndex;
  const total =
    typeof totalCount === "number" && totalCount >= 0
      ? totalCount
      : data.length;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const showTableFooter = Boolean(showPagination || children || tableFooter);

  return (
    <div
      className={cn(
        INSTITUTIONAL_TABLE_SHELL,
        "flex flex-col",
        fillAvailableHeight ? "h-full min-h-0 flex-1 overflow-hidden" : "overflow-visible",
      )}
    >
      <div
        className={cn(
          scrollAreaClass,
          showTableFooter ? "rounded-t-2xl" : "rounded-2xl",
        )}
      >
        <table
          className={cn(
            "relative w-full border-separate border-spacing-0 text-left",
            tableMinWidthClassName,
          )}
        >
          <thead className={institutionalTableHeadLabelClass}>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      institutionalTableHeadCellBaseClass,
                      institutionalTableHeadStickyClass,
                      "font-medium",
                      getMetaHeadClass(header.column.columnDef.meta),
                    )}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={institutionalTableBodyDivideClass}>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn("group", institutionalTableDataRowClass)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      institutionalTableBodyCellBaseClass,
                      getMetaCellClass(cell.column.columnDef.meta),
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showTableFooter ? (
        <div className={institutionalTableFooterStripClass}>
          <div className="space-y-3">
            {tableFooter}
            {showPagination ? (
              <nav
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                aria-label="Table pagination"
              >
                <p className={institutionalTableCaptionLabelClass}>
                  Page {pageIndex + 1} of {Math.max(1, pageCount)} · Showing{" "}
                  {from}–{to} of {total}
                </p>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={institutionalTableShellButtonClass}
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={institutionalTableShellButtonClass}
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}
                  >
                    Next
                  </Button>
                </div>
              </nav>
            ) : null}
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}
