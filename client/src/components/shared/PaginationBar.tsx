import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationBarProps {
    page: number;
    totalPages: number;
    totalItems: number;
    startIndex: number;
    endIndex: number;
    onPrev: () => void;
    onNext: () => void;
    onPageSelect: (page: number) => void;
    className?: string;
}

export function PaginationBar({
    page,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    onPrev,
    onNext,
    onPageSelect,
    className
}: PaginationBarProps) {
    if (totalItems === 0) return null;

    // Helper to generate page numbers (e.g. 1 2 3 ... 10)
    const getVisiblePages = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-[#222]", className)}>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                Showing <span className="text-foreground font-black">{totalItems === 0 ? 0 : startIndex + 1}</span> to <span className="text-foreground font-black">{endIndex}</span> of <span className="text-foreground font-black">{totalItems}</span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onPrev}
                    disabled={page === 1}
                    aria-label="Previous page"
                    className="h-9 w-9 bg-secondary border-border hover:bg-muted text-foreground rounded-xl disabled:opacity-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="hidden sm:flex items-center gap-1">
                    {getVisiblePages().map((p, i) => (
                        typeof p === 'string' ? (
                            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground tracking-widest leading-none">...</span>
                        ) : (
                            <Button
                                key={`page-${p}`}
                                variant="outline"
                                onClick={() => onPageSelect(p)}
                                aria-label={`Go to page ${p}`}
                                aria-current={page === p ? "page" : undefined}
                                className={cn(
                                    "h-9 w-9 p-0 text-xs font-black transition-all rounded-xl",
                                    page === p
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-transparent border-transparent hover:bg-secondary text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {p}
                            </Button>
                        )
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={onNext}
                    disabled={page === totalPages}
                    aria-label="Next page"
                    className="h-9 w-9 bg-secondary border-border hover:bg-muted text-foreground rounded-xl disabled:opacity-50"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
