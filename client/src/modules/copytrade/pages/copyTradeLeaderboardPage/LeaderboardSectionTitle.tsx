type LeaderboardSectionTitleProps = {
  totalCount: number;
  isLoading: boolean;
};

export function LeaderboardSectionTitle({
  totalCount,
  isLoading,
}: LeaderboardSectionTitleProps) {
  return (
    <>
      <div
        className="h-5 w-1 shrink-0 rounded-full bg-primary shadow-md"
        aria-hidden
      />
      <h3 className="text-lg font-bold tracking-tight text-foreground">
        Leaderboard
      </h3>
      {!isLoading ? (
        <span className="rounded-md bg-card px-2 py-0.5 text-xs font-bold tabular-nums text-muted-foreground">
          {totalCount}
        </span>
      ) : null}
    </>
  );
}
