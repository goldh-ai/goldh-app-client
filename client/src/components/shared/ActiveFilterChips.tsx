import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterChip {
    /** Human-readable label, e.g. "Class" */
    label: string;
    /** Current value shown in the chip, e.g. "Crypto" */
    value: string;
    /** Called when the user dismisses this chip */
    onRemove: () => void;
}

interface ActiveFilterChipsProps {
    filters: FilterChip[];
    /** Called when "Clear all" is clicked */
    onClearAll?: () => void;
    className?: string;
}

/**
 * Renders a row of dismissible filter chips.
 */
export function ActiveFilterChips({
    filters,
    onClearAll,
    className,
}: ActiveFilterChipsProps) {
    if (filters.length === 0) return null;

    return (
        <div
            className={cn(
                "flex flex-wrap items-center gap-2 pb-4 animate-in fade-in slide-in-from-top-1 duration-200",
                className
            )}
            role="status"
            aria-label={`${filters.length} active filter${filters.length > 1 ? "s" : ""}`}
        >
            {filters.length > 1 && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mr-1">
                    Filters:
                </span>
            )}

            {filters.map((chip) => (
                <button
                    key={`${chip.label}:${chip.value}`}
                    onClick={chip.onRemove}
                    aria-label={`Remove ${chip.label}: ${chip.value} filter`}
                    className="group flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-[#C7AE6A]/10 border border-[#C7AE6A]/30 text-[#C7AE6A] text-[10px] font-bold uppercase tracking-wider hover:bg-[#C7AE6A]/20 hover:border-[#C7AE6A]/50 transition-all"
                >
                    <span className="text-gray-400 font-medium normal-case tracking-normal lowercase">
                        {chip.label}:
                    </span>
                    <span>{chip.value}</span>
                    <X className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                </button>
            ))}

            {onClearAll && filters.length > 1 && (
                <button
                    onClick={onClearAll}
                    className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-widest transition-colors ml-1 hover:underline"
                >
                    Clear all
                </button>
            )}
        </div>
    );
}
