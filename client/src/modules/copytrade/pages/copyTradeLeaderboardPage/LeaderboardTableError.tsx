import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type LeaderboardTableErrorProps = {
  error: unknown;
  onRetry: () => void;
};

export function LeaderboardTableError({
  error,
  onRetry,
}: LeaderboardTableErrorProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card/40 px-8 py-12 text-center backdrop-blur-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card">
        <WifiOff className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-bold text-foreground">Could not load leaderboard</p>
        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
          {error instanceof Error ? error.message : "Check your connection and try again."}
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        className="rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90"
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
}
