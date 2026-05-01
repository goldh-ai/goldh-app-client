import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type CloseCornerProps = {
  onClose: () => void;
  className?: string;
};

export function CloseCorner({ onClose, className }: CloseCornerProps) {
  return (
    <button
      type="button"
      aria-label="Close panel"
      onClick={onClose}
      className={cn(
        "shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <X className="h-4 w-4" />
    </button>
  );
}
