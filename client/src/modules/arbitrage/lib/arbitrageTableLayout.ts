import { cn } from "@/lib/utils";
import {
  institutionalTableStickyFirstCellClass,
  institutionalTableStickyFirstHeadInsetClass,
} from "@/lib/institutionalDataChrome";

export const ARBITRAGE_TABLE_MIN_WIDTH_CLASS = "min-w-[1100px] relative";

export const arbitrageStickyPairHeaderClass =
  institutionalTableStickyFirstHeadInsetClass;

/** Sticky PAIR column — shared institutional sticky first column (BaseTable row hover #161616). */
export const arbitrageStickyPairCellClass =
  institutionalTableStickyFirstCellClass;

const nw = "whitespace-nowrap";

const stickyPair = {
  head: cn(
    arbitrageStickyPairHeaderClass,
    nw,
    "min-w-[8.5rem] w-[8.5rem] sm:min-w-[9.5rem] sm:w-[9.5rem]",
  ),
  cell: cn(
    arbitrageStickyPairCellClass,
    nw,
    "min-w-[8.5rem] w-[8.5rem] sm:min-w-[9.5rem] sm:w-[9.5rem]",
  ),
};

export const arbitrageColumnLayout = {
  pair: stickyPair,
  /** Tight min width; venue names still truncate via parent `title`. */
  buyExchange: {
    head: cn(nw, "min-w-[4.75rem]"),
    cell: cn(nw, "min-w-[4.75rem]"),
  },
  sellExchange: {
    head: cn(nw, "min-w-[4.75rem]"),
    cell: cn(nw, "min-w-[4.75rem]"),
  },
  grossSpreadPct: {
    head: cn(nw, "min-w-[4.25rem]", "text-center"),
    cell: cn(nw, "min-w-[4.25rem]", "text-center"),
  },
  netSpreadPct: {
    head: cn(nw, "min-w-[4.5rem]", "text-center"),
    cell: cn(nw, "min-w-[4.5rem]", "text-center"),
  },
  liquidityCapacityUsd: {
    head: cn(nw, "min-w-[6rem]", "text-center"),
    cell: cn(nw, "min-w-[6rem]", "text-center"),
  },
  executableTradeSizeUsd: {
    head: cn(nw, "min-w-[6rem]", "text-center"),
    cell: cn(nw, "min-w-[6rem]", "text-center"),
  },
  arbitrageScore: {
    head: cn(nw, "min-w-[6.75rem]"),
    cell: cn(nw, "min-w-[6.75rem]"),
  },
  /** Same width for Grade + Conf. + Complexity + Signal so chip containers line up. */
  grade: {
    head: cn(nw, "w-[5.75rem] min-w-[5.75rem]"),
    cell: cn(nw, "w-[5.75rem] min-w-[5.75rem]"),
  },
  confidenceBand: {
    head: cn(nw, "w-[5.75rem] min-w-[5.75rem]"),
    cell: cn(nw, "w-[5.75rem] min-w-[5.75rem]"),
  },
  executionComplexity: {
    head: cn(nw, "w-[5.75rem] min-w-[5.75rem]"),
    cell: cn(nw, "w-[5.75rem] min-w-[5.75rem]"),
  },
  signalState: {
    head: cn(nw, "w-[5.75rem] min-w-[5.75rem]"),
    cell: cn(nw, "w-[5.75rem] min-w-[5.75rem]"),
  },
  lastUpdated: {
    head: cn(nw, "min-w-[6rem]"),
    cell: cn(nw, "min-w-[6rem]"),
  },
} as const;

export type ArbitrageColumnLayoutKey = keyof typeof arbitrageColumnLayout;
