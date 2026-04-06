import * as React from "react";
import { format, subDays, startOfMonth, endOfMonth, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface DateRangePickerProps {
    dateRange: DateRange | undefined;
    onDateChange: (range: DateRange | undefined) => void;
    placeholder?: string;
    className?: string;
    label?: string;
    align?: "start" | "center" | "end";
}

export function DateRangePicker({
    dateRange,
    onDateChange,
    placeholder = "Pick a date range",
    className,
    label,
    align = "end"
}: DateRangePickerProps) {
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {label && (
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold px-1">
                    {label}
                </label>
            )}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal bg-[#050505] border-[#222] hover:bg-[#111] hover:text-[#C7AE6A] h-11 transition-all rounded-lg",
                            !dateRange && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 text-[#C7AE6A]" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>{placeholder}</span>
                        )}
                        <ChevronDown className="ml-auto h-4 w-4 opacity-50 text-gray-500" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#0a0a0a] border-[#222]" align={align}>
                    <div className="flex flex-col sm:flex-row">
                        <div className="p-2 border-r border-[#222] flex flex-col gap-1 min-w-[140px]">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start text-xs hover:bg-[#C7AE6A]/10 hover:text-[#C7AE6A]"
                                onClick={() => onDateChange({ from: startOfDay(new Date()), to: new Date() })}
                            >
                                Today
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start text-xs hover:bg-[#C7AE6A]/10 hover:text-[#C7AE6A]"
                                onClick={() => onDateChange({ from: startOfDay(subDays(new Date(), 7)), to: new Date() })}
                            >
                                Last 7 Days
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start text-xs hover:bg-[#C7AE6A]/10 hover:text-[#C7AE6A]"
                                onClick={() => onDateChange({ from: startOfDay(subDays(new Date(), 30)), to: new Date() })}
                            >
                                Last 30 Days
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start text-xs hover:bg-[#C7AE6A]/10 hover:text-[#C7AE6A]"
                                onClick={() => onDateChange({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) })}
                            >
                                This Month
                            </Button>
                            <DropdownMenuSeparator className="bg-[#222] my-1" />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start text-xs text-red-400 hover:bg-red-400/10 hover:text-red-400"
                                onClick={() => onDateChange(undefined)}
                            >
                                Clear Filter
                            </Button>
                        </div>
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={onDateChange}
                            numberOfMonths={1}
                            className="bg-transparent"
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
