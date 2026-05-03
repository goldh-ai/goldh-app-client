import {
  institutionalTableCellInnerCenterClass,
  institutionalTableCellMonoStrongClass,
} from "@/lib/institutionalDataChrome";
import { cn } from "@/lib/utils";

/** Same 0–100 bar width rule as Module 8 (Arbitrage); adjust here if product changes the scale. */
export function institutionalScoreBarWidthPct(score: number): number {
  return Math.min(100, Math.max(0, score));
}

export type InstitutionalScoreCellProps = {
  score: number;
  /**
   * `center` — table column (Arbitrage / Copy Trade leaderboard).
   * `start` — compact strips (e.g. detail header) so the bar can use the full cell width.
   */
  align?: "center" | "start";
};

/**
 * Shared institutional score display: mono number + 0–100 progress bar.
 * Use everywhere “score” should match Arbitrage Scanner visually.
 */
export function InstitutionalScoreCell({
  score,
  align = "center",
}: InstitutionalScoreCellProps) {
  const widthPct = institutionalScoreBarWidthPct(score);
  if (align === "start") {
    /** Detail metric strip: same number scale as sibling Rank/Momentum — no table `min-h-10` chrome. */
    return (
      <div className="w-full min-w-0">
        <div className="flex w-full min-w-0 items-center gap-1.5">
          <span className="shrink-0 font-mono text-base font-bold tabular-nums leading-none text-foreground">
            {score}
          </span>
          <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-secondary sm:h-1.5">
            <div
              className="h-full rounded-full bg-primary/85"
              style={{ width: `${widthPct}%` }}
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={institutionalTableCellInnerCenterClass}>
      <div className="flex min-w-[5.5rem] max-w-[6.5rem] items-center gap-2">
        <span className={cn("shrink-0", institutionalTableCellMonoStrongClass)}>
          {score}
        </span>
        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary/85"
            style={{ width: `${widthPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
