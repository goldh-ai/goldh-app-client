import { memo, useState, type ReactNode } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  institutionalSheetOutlineButtonClass,
  institutionalToolbarIconButtonClass,
  institutionalToolbarIconClass,
} from "@/lib/institutionalDataChrome";
import { cn } from "@/lib/utils";

export interface InstitutionalMobileFilterSheetProps {
  children: ReactNode;
  onClear: () => void;
  title?: string;
  triggerClassName?: string;
}

function InstitutionalMobileFilterSheetInner({
  children,
  onClear,
  title = "Filters",
  triggerClassName,
}: InstitutionalMobileFilterSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(institutionalToolbarIconButtonClass, "md:hidden", triggerClassName)}
          aria-label="Open filters"
        >
          <Filter className={institutionalToolbarIconClass} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-3xl border-t border-border bg-[#0a0a0a] p-6 text-foreground"
      >
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-lg font-bold text-foreground">
            {title}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full pb-20">
          <div className="space-y-6">
            {children}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className={institutionalSheetOutlineButtonClass}
                onClick={onClear}
              >
                Clear Filters
              </Button>
              <Button
                type="button"
                className="h-12 w-full rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90"
                onClick={() => setOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export const InstitutionalMobileFilterSheet = memo(InstitutionalMobileFilterSheetInner);
