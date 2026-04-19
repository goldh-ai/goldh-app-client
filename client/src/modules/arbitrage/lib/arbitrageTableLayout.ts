import { cn } from "@/lib/utils";
import { institutionalTableChromeSurfaceClass } from "@/lib/institutionalDataChrome";

export const ARBITRAGE_TABLE_MIN_WIDTH_CLASS = "min-w-[1480px] relative";

export const arbitrageStickyPairHeaderClass = cn(
  "left-0 z-[41]",
  institutionalTableChromeSurfaceClass,
);

export const arbitrageStickyPairCellClass = cn(
  "sticky left-0 z-10 bg-[#0a0a0a] group-hover:bg-[#121212]",
);

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
  /** Tighter min width so Buy/Sell sit closer to Gross % and each other; venue names still truncate with `title`. */
  buyExchange: {
    head: cn(nw, "min-w-[5.25rem]"),
    cell: cn(nw, "min-w-[5.25rem]"),
  },
  sellExchange: {
    head: cn(nw, "min-w-[5.25rem]"),
    cell: cn(nw, "min-w-[5.25rem]"),
  },
  grossSpreadPct: {
    head: cn(nw, "min-w-[4.75rem]", "text-center"),
    cell: cn(nw, "min-w-[4.75rem]", "text-center"),
  },
  netSpreadPct: {
    head: cn(nw, "min-w-[5.25rem]", "text-center"),
    cell: cn(nw, "min-w-[5.25rem]", "text-center"),
  },
  liquidityCapacityUsd: {
    head: cn(nw, "min-w-[7.25rem]", "text-center"),
    cell: cn(nw, "min-w-[7.25rem]", "text-center"),
  },
  executableTradeSizeUsd: {
    head: cn(nw, "min-w-[7.25rem]", "text-center"),
    cell: cn(nw, "min-w-[7.25rem]", "text-center"),
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
    head: cn(nw, "min-w-[7.5rem]"),
    cell: cn(nw, "min-w-[7.5rem]"),
  },
} as const;

export type ArbitrageColumnLayoutKey = keyof typeof arbitrageColumnLayout;
