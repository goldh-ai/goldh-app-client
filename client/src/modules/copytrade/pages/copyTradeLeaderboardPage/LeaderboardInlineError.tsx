import { WifiOff } from "lucide-react";

type LeaderboardInlineErrorProps = {
  error: unknown;
  onRetry: () => void;
};

export function LeaderboardInlineError({
  error,
  onRetry,
}: LeaderboardInlineErrorProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2">
      <WifiOff className="h-3.5 w-3.5 shrink-0 text-rose-400" />
      <p className="text-xs text-rose-300">
        {error instanceof Error ? error.message : "Failed to refresh leaderboard."}{" "}
        <button
          type="button"
          className="font-semibold text-rose-300 underline underline-offset-2 hover:text-rose-200"
          onClick={onRetry}
        >
          Retry now
        </button>
      </p>
    </div>
  );
}
