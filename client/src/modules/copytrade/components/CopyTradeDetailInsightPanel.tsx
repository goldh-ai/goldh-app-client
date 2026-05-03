import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CopyTradeDetailColumnHeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  /** With `right`, keeps controls on the same row as the title (narrow widths). */
  pinToggle?: boolean;
};

export function CopyTradeDetailColumnHeader({
  title,
  subtitle,
  right,
  pinToggle,
}: CopyTradeDetailColumnHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-2",
        pinToggle && right ? "flex-nowrap" : "flex-wrap",
      )}
    >
      <div className={cn("min-w-0", pinToggle && right && "min-w-0 flex-1 pr-2")}>
        <h4 className="text-xs font-black uppercase tracking-wider text-primary/95">{title}</h4>
        {subtitle ? (
          <p className="mt-1 text-xs font-medium leading-snug text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0 pt-0.5">{right}</div> : null}
    </div>
  );
}

type CopyTradeDetailInsightPanelProps = {
  eyebrow: string;
  left: ReactNode;
  right: ReactNode;
  className?: string;
  /**
   * When true, each column is a flex column that stretches to the taller side
   * so short blocks (e.g. risk strip) do not leave dead vertical space.
   */
  balanceColumnHeights?: boolean;
};

/**
 * Pairs two related insights in one framed region so the drawer reads as
 * a story strip instead of two stacked bordered cards.
 */
export function CopyTradeDetailInsightPanel({
  eyebrow,
  left,
  right,
  className,
  balanceColumnHeights = false,
}: CopyTradeDetailInsightPanelProps) {
  const columnClass = cn(
    "min-w-0 p-4",
    balanceColumnHeights && "flex h-full min-h-0 flex-col",
  );

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/55 bg-gradient-to-b from-card/85 via-card/55 to-background/40 shadow-lg shadow-black/20",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-16 h-40 w-40 rounded-full bg-primary/[0.09] blur-3xl"
      />
      <div className="relative border-b border-border/40 bg-muted/[0.12] px-4 py-2.5 backdrop-blur-sm">
        <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      </div>
      <div
        className={cn(
          "relative grid grid-cols-1 divide-y divide-border/45 xl:grid-cols-2 xl:divide-x xl:divide-y-0",
          balanceColumnHeights && "xl:items-stretch",
        )}
      >
        <div className={columnClass}>{left}</div>
        <div className={columnClass}>{right}</div>
      </div>
    </section>
  );
}
