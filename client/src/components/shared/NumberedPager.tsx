import { memo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  institutionalTableCaptionLabelClass,
  institutionalTablePagerControlActiveClass,
  institutionalTablePagerControlClass,
} from "@/lib/institutionalDataChrome";

export type NumberedPagerProps = {
  /** 0-based current page. */
  pageIndex: number;
  /** Total number of pages (>= 1). */
  pageCount: number;
  /** Total number of rows across all pages. */
  totalCount: number;
  /** First row number on the current page (1-based). */
  from: number;
  /** Last row number on the current page (1-based). */
  to: number;
  /** Current per-page selection. */
  perPage: number;
  /** Available per-page values (read-only). */
  perPageOptions: readonly number[];
  /** Called with the target 0-based page index when the user requests a jump. */
  onPageChange: (nextPageIndex: number) => void;
  /** Called with the new per-page size; parent must reset to page 0 internally. */
  onPerPageChange: (nextPerPage: number) => void;
  /** When true, disables forward jumps that would require more fetches. */
  canJumpForward?: (targetPageIndex: number) => boolean;
  /** When true, renders a loading spinner on forward-walking actions. */
  isJumping?: boolean;
  /** Optional label for aria-label of the nav region. */
  label?: string;
  /** Optional className for the outer nav wrapper. */
  className?: string;
};

function buildPageSlots(pageIndex: number, pageCount: number): number[] {
  if (pageCount <= 0) return [];
  const last = pageCount - 1;
  const start = Math.max(0, Math.min(pageIndex - 1, last - 2));
  const end = Math.min(last, start + 2);
  const slots: number[] = [];
  for (let p = start; p <= end; p++) slots.push(p);
  return slots;
}

function NumberedPagerInner({
  pageIndex,
  pageCount,
  totalCount,
  from,
  to,
  perPage,
  perPageOptions,
  onPageChange,
  onPerPageChange,
  canJumpForward,
  isJumping = false,
  label = "Pagination",
  className,
}: NumberedPagerProps) {
  const atFirst = pageIndex <= 0;
  const atLast = pageIndex >= pageCount - 1;
  const slots = buildPageSlots(pageIndex, pageCount);

  const forwardAllowed = (target: number): boolean => {
    if (target <= pageIndex) return true;
    return canJumpForward ? canJumpForward(target) : true;
  };

  return (
    <nav
      className={cn(
        "flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      aria-label={label}
    >
      <div className="flex flex-wrap items-center gap-3">
        <label className={cn("flex items-center gap-2", institutionalTableCaptionLabelClass)}>
          Rows
          <Select
            value={String(perPage)}
            onValueChange={(v) => {
              const n = Number(v);
              if (!Number.isFinite(n) || n <= 0) return;
              onPerPageChange(n);
            }}
          >
            <SelectTrigger
              className="h-8 w-[72px] rounded-lg border border-[#222] bg-[#111] font-mono text-xs font-bold tabular-nums text-muted-foreground hover:text-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
              aria-label="Rows per page"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-[72px] rounded-xl border border-[#222] bg-[#0a0a0a] text-foreground shadow-lg">
              {perPageOptions.map((opt) => (
                <SelectItem
                  key={opt}
                  value={String(opt)}
                  className="font-mono text-xs font-bold tabular-nums focus:bg-accent focus:text-accent-foreground"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <p className={institutionalTableCaptionLabelClass}>
          {totalCount === 0
            ? "No rows"
            : `Showing ${from}–${to} of ${totalCount} · Page ${pageIndex + 1} of ${Math.max(1, pageCount)}`}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(institutionalTablePagerControlClass, "h-8 w-8")}
          disabled={atFirst || isJumping}
          onClick={() => onPageChange(0)}
          aria-label="First page"
          title="First page"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(institutionalTablePagerControlClass, "h-8 w-8")}
          disabled={atFirst || isJumping}
          onClick={() => onPageChange(pageIndex - 1)}
          aria-label="Previous page"
          title="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {slots.map((slot) => {
          const active = slot === pageIndex;
          const reachable = forwardAllowed(slot);
          const disabled = (!reachable && !active) || isJumping;
          return (
            <Button
              key={slot}
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                institutionalTablePagerControlClass,
                active && institutionalTablePagerControlActiveClass,
              )}
              aria-label={`Go to page ${slot + 1}`}
              aria-current={active ? "page" : undefined}
              disabled={disabled}
              onClick={() => onPageChange(slot)}
            >
              {slot + 1}
            </Button>
          );
        })}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(institutionalTablePagerControlClass, "h-8 w-8")}
          disabled={atLast || isJumping || !forwardAllowed(pageIndex + 1)}
          onClick={() => onPageChange(pageIndex + 1)}
          aria-label="Next page"
          title="Next page"
        >
          {isJumping ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(institutionalTablePagerControlClass, "h-8 w-8")}
          disabled={atLast || isJumping || !forwardAllowed(pageCount - 1)}
          onClick={() => onPageChange(pageCount - 1)}
          aria-label="Last page"
          title="Last page"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </nav>
  );
}

/** Memoized export — skips re-renders when pager props are unchanged (stabilize callbacks upstream for best effect). */
export const NumberedPager = memo(NumberedPagerInner);
