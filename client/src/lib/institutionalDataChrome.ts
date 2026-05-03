import { cn } from "@/lib/utils";

/** Matches Pulse / STREETScore feature grids: same panel, border, and glass as `PulseAssetTable` shell. */
export const INSTITUTIONAL_TABLE_SHELL =
  "bg-[#111111]/40 backdrop-blur-xl border border-[#222] rounded-2xl overflow-hidden glass-morphism shadow-2xl";

export const INSTITUTIONAL_FILTER_BAR = "bg-[#050505] py-4 mb-0 transition-all";

export const institutionalToolbarIconClass = "h-4 w-4";

export const institutionalToolbarIconButtonClass =
  "h-9 w-9 shrink-0 rounded-xl border border-border bg-card p-0 text-muted-foreground hover:bg-secondary hover:text-primary";

export const institutionalFieldLabelClass =
  "mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground";

export const institutionalFilterInputClass =
  "h-10 w-full rounded-xl border border-[#222] bg-[#111] pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:border-primary/40";

export const institutionalFilterSelectTriggerClass =
  "h-9 w-full min-w-0 rounded-xl border border-[#222] bg-[#111] px-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 data-[placeholder]:text-muted-foreground";

export const institutionalFilterSelectTriggerSheetClass =
  "h-12 w-full rounded-xl border border-[#222] bg-[#111] text-xs font-black uppercase tracking-widest text-foreground focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 data-[placeholder]:text-muted-foreground";

/** `<SelectContent />` — Portfolio Intelligence menu surface. */
export const institutionalFilterSelectContentClass =
  "rounded-xl border border-[#222] bg-[#0a0a0a] text-foreground shadow-lg";

/** Portfolio Intelligence table thead — gray microcaps, not theme muted. */
export const institutionalTableHeadLabelClass =
  "text-xs font-black uppercase tracking-[0.15em] text-gray-500";

/** Sorted and unsorted sort icons — same tone as Portfolio Intelligence column headers. */
export const institutionalTableSortGlyphActiveClass =
  "text-[0.7rem] leading-none text-gray-500";

export const institutionalTableSortGlyphMutedClass =
  "text-[0.7rem] leading-none text-gray-600";

/** No min-height here — match feature tables (e.g. Pulse) so one line + `py-3.5` sets row height. */
export const institutionalTableHeadCellBaseClass =
  "h-auto border-0 px-4 py-3.5 align-middle font-normal";

/** Row lines: `border-b` on cells — `divide-y` on tbody is unreliable with `border-separate` (sticky thead). */
export const institutionalTableBodyCellBaseClass =
  "border-x-0 border-t-0 border-b border-[#1a1a1a]/70 px-4 py-0 align-middle [&:has([role=checkbox])]:pr-0";

export const institutionalTableEntityTextClass =
  "truncate text-sm font-bold text-white transition-colors group-hover:text-primary";

export const institutionalTableCellTextClass = "text-sm text-gray-300";

export const institutionalTableCellMonoClass =
  "font-mono text-sm font-bold tabular-nums text-gray-300";

export const institutionalTableCellTertiaryClass =
  "text-xs font-bold uppercase tracking-tighter text-gray-600";

export const institutionalTableEmptyGlyphClass = "text-xs text-gray-600";

export const institutionalTableCellMonoStrongClass =
  "font-mono text-sm font-bold tabular-nums text-gray-300";

export const institutionalTableCellInnerLeftClass =
  "flex min-h-10 w-full items-center justify-start";

export const institutionalTableCellInnerCenterClass =
  "flex min-h-10 w-full items-center justify-center";

export const institutionalTableCellInnerRightClass =
  "flex min-h-10 w-full items-center justify-end";

export const institutionalTableSortHeaderButtonClass =
  "inline-flex w-full min-h-0 items-center gap-1 whitespace-nowrap hover:text-foreground transition-colors";

/** Table / shell chrome surface (sticky thead, footer strip, loading thead). */
export const institutionalTableChromeSurfaceClass = "bg-[#0c0c0c]";

export const institutionalTableStickyFirstHeadInsetClass = cn(
  "left-0 z-[41] border-r border-[#222]/50",
  institutionalTableChromeSurfaceClass,
);

/** Pair with `<tr className="group/table-row">` (see BaseTable). Matches row `hover:bg-[#161616]` under horizontal scroll. `z-20` keeps peers from painting over the lane when `overflow-x-auto` scrolls (Pulse-style). */
export const institutionalTableStickyFirstCellClass = cn(
  "sticky left-0 z-20 isolate border-r border-[#222]/50 bg-[#0a0a0a] group-hover/table-row:bg-[#161616]",
);

/** Apply to each `<th>` (not `<thead>`) — `border-collapse` breaks sticky headers. */
export const institutionalTableHeadStickyClass = cn(
  "sticky top-0 z-30 border-b border-[#222]",
  institutionalTableChromeSurfaceClass,
);

/** Strip bottom border on last row (footer strip or card edge provides closure). */
export const institutionalTableBodyDivideClass =
  "[&>tr:last-child>td]:border-b-0 [&>tr:last-child>th]:border-b-0";

/** Full-width bar under the scroll region (BaseTable footer). */
export const institutionalTableFooterStripClass = cn(
  "shrink-0 border-t border-[#222] px-4 py-3 rounded-b-2xl",
  institutionalTableChromeSurfaceClass,
);

/** Row counts, pager hints — same cadence as column headers, theme foreground. */
export const institutionalTableCaptionLabelClass =
  "text-xs font-black uppercase tracking-widest text-muted-foreground";

/** Small outline control in table chrome (clear filters, built-in Prev/Next). */
export const institutionalTableShellButtonClass =
  "rounded-xl border border-border bg-transparent font-bold text-muted-foreground hover:bg-secondary hover:text-primary";

/** Icon / numeric pager control (NumberedPager). */
export const institutionalTablePagerControlClass =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-border bg-transparent px-2 font-mono text-xs font-bold tabular-nums text-muted-foreground transition-colors hover:bg-secondary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground";

export const institutionalTablePagerControlActiveClass =
  "border-primary/70 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary";

/** Secondary callout under a table (disclaimers). */
export const institutionalTableBelowCalloutClass =
  "rounded-xl border border-border/80 bg-muted/40 px-4 py-3 text-muted-foreground";

/** Loading skeleton thead — same surface as data thead (non-sticky). */
export const institutionalTableSkeletonTheadClass = cn(
  "border-b border-[#222]",
  institutionalTableChromeSurfaceClass,
);

export const institutionalTableDataRowClass = "hover:bg-[#161616] h-[52px]";

export const institutionalSheetOutlineButtonClass =
  "h-12 w-full rounded-xl border-[#222] bg-[#111] font-bold text-foreground hover:bg-[#161616]";
