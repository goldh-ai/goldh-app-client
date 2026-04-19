import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  institutionalToolbarIconButtonClass,
  institutionalToolbarIconClass,
} from "@/lib/institutionalDataChrome";
import { cn } from "@/lib/utils";

export interface ArbitrageRefreshButtonProps {
  isFetching: boolean;
  onRefresh: () => void;
}

export function ArbitrageRefreshButton({ isFetching, onRefresh }: ArbitrageRefreshButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={institutionalToolbarIconButtonClass}
      onClick={onRefresh}
      disabled={isFetching}
      title="Refresh now"
    >
      <RefreshCw className={cn(institutionalToolbarIconClass, isFetching && "animate-spin")} />
    </Button>
  );
}
