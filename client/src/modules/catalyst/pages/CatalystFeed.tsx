/**
 * Catalyst Intelligence Engine — Live Feed Page
 *
 * Replaces MarketEventsMock with real data from /api/events.
 * Renders MacroEventRow or EarningsEventRow based on event_type.
 * Includes: CatalystHero, filter bar, list view, calendar view.
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import { AppLayout } from "@/components/AppLayout";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Calendar,
    Filter,
    Search,
    ChevronLeft,
    ChevronRight,
    Clock,
    List,
    Grid3x3,
    Lock,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import { useCatalystEvents } from "../hooks/useCatalystEvents";
import { CatalystHero } from "../components/CatalystHero";
import { MacroEventRow, type WhaleConfirmation } from "../components/MacroEventRow";
import { EarningsEventRow } from "../components/EarningsEventRow";
import { MacroRegimeBanner } from "../components/MacroRegimeBanner";
import { TriggersPanel } from "../components/TriggersPanel";
import { useWhaleNetflow } from "@/modules/whale/hooks/useWhaleNetflow";
import type { CatalystEvent } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterLabel = "All impact" | "High impact" | "Portfolio only" | "Macro" | "Earnings";

const ALL_FILTERS: FilterLabel[] = ["All impact", "High impact", "Portfolio only", "Macro", "Earnings"];
const FREE_FILTERS: FilterLabel[] = ["All impact", "High impact", "Portfolio only", "Macro"];

// ─── Calendar View ────────────────────────────────────────────────────────────

function getDateStr(event: CatalystEvent): string {
    return event.scheduled_time.slice(0, 10);
}

function getEventLabel(event: CatalystEvent): string {
    if (event.event_type === "earnings") {
        return `${event.ticker} Earnings`;
    }
    return `${event.country} ${event.event_name}`;
}

const CatalystCalendarView = ({ events }: { events: CatalystEvent[] }) => {
    const [currentDate, setCurrentDate] = useState(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const daysInMonth = getDaysInMonth(currentDate);
    const startOffset = getFirstDayOfMonth(currentDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const monthYear = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

    const getEventsForDay = (day: number): CatalystEvent[] => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const dayStr = String(day).padStart(2, "0");
        const dateStr = `${year}-${month}-${dayStr}`;
        return events.filter((e) => getDateStr(e) === dateStr);
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() === today.getMonth() &&
            day === today.getDate()
        );
    };

    const handleDayClick = (day: number) => {
        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        setIsDrawerOpen(true);
    };

    const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate.getDate()) : [];

    return (
        <>
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#111]">
                    <h3 className="text-lg font-bold text-white tracking-tight">{monthYear}</h3>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#222]"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                const d = new Date();
                                setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
                            }}
                            className="h-8 px-2 text-xs font-bold text-[#C7AE6A] hover:bg-[#222]"
                        >
                            Today
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#222]"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-7 border-b border-[#222] bg-[#111]/50">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d} className="py-2 text-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-fr bg-[#1f1f1f] gap-px">
                    {Array(startOffset)
                        .fill(null)
                        .map((_, i) => (
                            <div key={`empty-${i}`} className="bg-[#0a0a0a] min-h-[80px] md:min-h-[120px]" />
                        ))}
                    {days.map((day) => {
                        const dayEvents = getEventsForDay(day);
                        const today = isToday(day);
                        return (
                            <div
                                key={day}
                                onClick={() => handleDayClick(day)}
                                className={cn(
                                    "bg-[#0a0a0a] min-h-[80px] md:min-h-[120px] p-2 relative transition-colors hover:bg-[#111] cursor-pointer",
                                    today && "bg-[#C7AE6A]/5",
                                )}
                            >
                                <div className={cn("text-xs font-bold mb-1 md:mb-2 flex justify-between items-center", today ? "text-[#C7AE6A]" : "text-gray-500")}>
                                    {day}
                                    {today && <span className="text-[9px] uppercase tracking-wider font-black hidden md:inline">Today</span>}
                                </div>
                                <div className="hidden md:flex flex-col gap-1">
                                    {dayEvents.slice(0, 3).map((event) => (
                                        <div
                                            key={event.event_id}
                                            className={cn(
                                                "text-[9px] px-1.5 py-1 rounded border overflow-hidden truncate font-medium flex items-center gap-1",
                                                event.impact_band === "High"
                                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                    : "bg-gray-800 text-gray-300 border-gray-700",
                                            )}
                                        >
                                            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", event.impact_band === "High" ? "bg-rose-500" : "bg-gray-400")} />
                                            {getEventLabel(event)}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="text-[9px] text-gray-500 pl-1">+{dayEvents.length - 3} more</div>
                                    )}
                                </div>
                                <div className="flex md:hidden flex-wrap gap-1 content-start mt-1">
                                    {dayEvents.map((event) => (
                                        <div
                                            key={event.event_id}
                                            className={cn("w-1.5 h-1.5 rounded-full", event.impact_band === "High" ? "bg-rose-500" : "bg-gray-500")}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetContent side="bottom" className="h-[70vh] bg-[#0a0a0a] border-t border-[#333]">
                    <SheetHeader className="mb-6 text-left">
                        <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#C7AE6A]" />
                            {selectedDate?.toLocaleDateString("default", { month: "long", day: "numeric", year: "numeric" })}
                        </SheetTitle>
                        <SheetDescription className="text-gray-400">
                            {selectedDayEvents.length} events scheduled
                        </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 overflow-y-auto h-[calc(70vh-120px)] pr-2">
                        {selectedDayEvents.length > 0 ? (
                            selectedDayEvents.map((event) => (
                                <div key={event.event_id} className="p-4 rounded-xl bg-[#111] border border-[#222]">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={cn(
                                            "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border",
                                            event.impact_band === "High"
                                                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                                : "bg-gray-800 text-gray-400 border-gray-700",
                                        )}>
                                            {event.impact_band ?? "Low"} Impact
                                        </span>
                                        <span className="text-xs font-mono text-gray-500">
                                            {new Date(event.scheduled_time).toLocaleTimeString("en-US", {
                                                hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC",
                                            })} UTC
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-200 mb-1">{getEventLabel(event)}</h4>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                                        {event.event_type === "earnings" ? "Earnings" : "Macro"} · {event.country}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 border border-dashed border-[#222] rounded-xl">
                                No events scheduled for this day
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};

// ─── Skeletons ────────────────────────────────────────────────────────────────

function EventSkeleton() {
    return (
        <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-6 rounded-lg bg-[#1a1a1a]" />
                    <div className="space-y-2">
                        <Skeleton className="w-32 h-4 bg-[#1a1a1a]" />
                        <Skeleton className="w-20 h-3 bg-[#1a1a1a]" />
                    </div>
                </div>
                <Skeleton className="w-16 h-4 bg-[#1a1a1a]" />
            </div>
            <Skeleton className="w-full h-12 rounded-lg bg-[#050505]" />
        </div>
    );
}

function HeroSkeleton() {
    return (
        <div className="bg-[#0a0a0a] border border-[#C7AE6A]/20 rounded-2xl p-8 mb-10 space-y-6">
            <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded bg-[#1a1a1a]" />
                <Skeleton className="w-40 h-4 bg-[#1a1a1a]" />
            </div>
            <div className="space-y-3">
                <Skeleton className="w-3/4 h-8 bg-[#1a1a1a]" />
                <Skeleton className="w-1/2 h-4 bg-[#1a1a1a]" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[#1a1a1a]">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="w-16 h-3 bg-[#1a1a1a]" />
                        <Skeleton className="w-24 h-6 bg-[#1a1a1a]" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── CatalystFeed ─────────────────────────────────────────────────────────────

export default function CatalystFeed() {
    const { user } = useAuth();
    const tier = user?.planTier ?? 'free';
    const catalystAllowed = ['essential', 'pro', 'elite', 'admin'].includes(tier);
    const fullAccess = ['elite', 'admin'].includes(tier);
    const earningsAllowed = catalystAllowed;
    const FILTERS = earningsAllowed ? ALL_FILTERS : FREE_FILTERS;

    const [filter, setFilter] = useState<FilterLabel>("All impact");
    const [view, setView] = useState<"list" | "calendar">("list");
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    const { data, isLoading, isError } = useCatalystEvents();
    const allEvents: CatalystEvent[] = data?.events ?? [];
    const earningsRestricted = data?.earnings_restricted === true;

    // PRO/FREE tier gate — show upgrade CTA instead of feed
    if (!catalystAllowed) {
        return (
            <AppLayout title="Catalyst">
                <main className="max-w-4xl mx-auto px-4 pt-6 pb-20">
                    <div className="rounded-2xl border border-[#C7AE6A]/20 bg-[#C7AE6A]/5 p-12 text-center space-y-5 mt-10">
                        <div className="flex justify-center">
                            <div className="w-14 h-14 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center">
                                <Lock className="w-6 h-6 text-[#C7AE6A]" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white">Catalyst Intelligence is Essential+</h3>
                        <p className="text-sm text-gray-400 max-w-md mx-auto">
                            Get access to macro event impact scoring, earnings catalysts, trigger alerts, and regime detection. Upgrade to unlock the full intelligence feed.
                        </p>
                        <Link href="/pricing">
                            <Button className="bg-[#C7AE6A] hover:bg-[#b99a45] text-black font-bold px-8 rounded-xl mt-2">
                                Upgrade to Essential
                            </Button>
                        </Link>
                    </div>
                </main>
            </AppLayout>
        );
    }

    // Whale cross-module signal — poll BTC netflow every 5min
    const { data: btcFlow } = useWhaleNetflow('BTC');
    const whaleSpike = btcFlow?.crossModuleSignal === 'spike_detected' && btcFlow?.flowSpike;

    // Builds whale confirmation for an event if it's within ±12h of now and BTC spike is active
    function getWhaleConfirmation(scheduledTime: string): WhaleConfirmation | undefined {
        if (!whaleSpike || !btcFlow) return undefined;
        const diff = Math.abs(new Date(scheduledTime).getTime() - Date.now());
        if (diff > 12 * 60 * 60 * 1000) return undefined;
        return {
            netFlowUsd: btcFlow.netFlowUsd,
            baseline7d: btcFlow.baseline7d,
            flowDirection: btcFlow.flowDirection,
            confidenceBand: btcFlow.confidenceBand,
        };
    }

    const now = new Date();

    const filteredEvents = useMemo(() => {
        return allEvents.filter((e) => {
            if (filter === "High impact" && e.impact_band !== "High") return false;
            if (filter === "Portfolio only" && e.relevance_band !== "High" && e.relevance_band !== "Medium") return false;
            if (filter === "Macro" && e.event_type !== "macro") return false;
            if (filter === "Earnings" && e.event_type !== "earnings") return false;
            if (debouncedSearchQuery) {
                const q = debouncedSearchQuery.toLowerCase();
                const label = getEventLabel(e).toLowerCase();
                if (!label.includes(q) && !e.country.toLowerCase().includes(q)) return false;
            }
            return true;
        });
    }, [allEvents, filter, debouncedSearchQuery]);

    // Show only upcoming events
    const { upcomingEvents, displayedEvents } = useMemo(() => {
        const nowTs = Date.now();
        const upcoming = filteredEvents.filter((e) => new Date(e.scheduled_time).getTime() > nowTs);

        // Sort upcoming: chronologically (soonest first)
        upcoming.sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime());

        return { 
            upcomingEvents: upcoming, 
            displayedEvents: upcoming
        };
    }, [filteredEvents]);

    return (
        <AppLayout title="Catalyst">
            <main className="max-w-4xl mx-auto px-4 pt-6 pb-20 animate-in fade-in duration-700">

                {/* Hero */}
                {isLoading ? (
                    <HeroSkeleton />
                ) : !isError && (
                    <>
                        <MacroRegimeBanner />
                        <div className="mt-3" />
                        <CatalystHero events={allEvents} />
                        <div className="mt-4">
                            <TriggersPanel />
                        </div>
                    </>
                )}

                {/* Filter Bar */}
                <div className="sticky top-0 bg-[#050505]/95 backdrop-blur-xl border-y border-[#1a1a1a] py-4 mb-8 z-30">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                        {/* Mobile: Filter Button */}
                        <div className="flex md:hidden w-full items-center justify-between gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsFilterDrawerOpen(true)}
                                className="flex-1 bg-[#111] border-[#222] text-gray-300 hover:text-white hover:bg-[#222] justify-between"
                            >
                                <span className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">{filter}</span>
                                </span>
                                <ChevronRight className="w-4 h-4 rotate-90" />
                            </Button>
                            <ToggleGroup
                                type="single"
                                value={view}
                                onValueChange={(v) => v && setView(v as "list" | "calendar")}
                                className="bg-[#111] border border-[#222] p-1 rounded-lg shrink-0"
                            >
                                <ToggleGroupItem value="list" aria-label="List View" className="h-9 w-9 data-[state=on]:bg-[#C7AE6A] data-[state=on]:text-black transition-colors">
                                    <List className="w-4 h-4" />
                                </ToggleGroupItem>
                                <ToggleGroupItem value="calendar" aria-label="Calendar View" className="h-9 w-9 data-[state=on]:bg-[#C7AE6A] data-[state=on]:text-black transition-colors">
                                    <Grid3x3 className="w-4 h-4" />
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* Desktop: Filter Pills */}
                        <div className="hidden md:flex items-center gap-4">
                            <div className="p-2 bg-[#1a1a1a] rounded-lg border border-[#222]">
                                <Filter className="w-3.5 h-3.5 text-[#C7AE6A]" />
                            </div>
                            <div className="flex items-center gap-2">
                                {FILTERS.map((label) => (
                                    <button
                                        key={label}
                                        onClick={() => setFilter(label)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                            filter === label
                                                ? "bg-[#C7AE6A] text-black shadow-lg"
                                                : "bg-[#111] text-gray-500 border border-[#222] hover:border-gray-700 hover:text-gray-300",
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Desktop: Search + View Toggle */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className="relative group w-64">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-600 group-focus-within:text-[#C7AE6A] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by ticker, country, or event"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Search events"
                                    className="w-full bg-[#111] border border-[#222] rounded-xl pl-10 pr-4 h-10 text-xs text-white focus:outline-none focus:border-[#C7AE6A]/50 transition-all font-medium"
                                />
                            </div>
                            <div className="h-6 w-px bg-[#222] mx-2" />
                            <ToggleGroup
                                type="single"
                                value={view}
                                onValueChange={(v) => v && setView(v as "list" | "calendar")}
                                className="bg-[#111] border border-[#222] p-1 rounded-lg"
                            >
                                <ToggleGroupItem value="list" aria-label="List View" className="h-8 w-9 data-[state=on]:bg-[#C7AE6A] data-[state=on]:text-black transition-colors">
                                    <List className="w-4 h-4" />
                                </ToggleGroupItem>
                                <ToggleGroupItem value="calendar" aria-label="Calendar View" className="h-8 w-9 data-[state=on]:bg-[#C7AE6A] data-[state=on]:text-black transition-colors">
                                    <Grid3x3 className="w-4 h-4" />
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-12">

                    {isLoading && (
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => <EventSkeleton key={i} />)}
                        </div>
                    )}

                    {isError && (
                        <div className="text-center py-20 text-rose-500 border border-dashed border-rose-500/30 rounded-xl">
                            Failed to load events. Please try again.
                        </div>
                    )}

                    {!isLoading && !isError && earningsRestricted && (
                        <div className="rounded-2xl border border-[#C7AE6A]/20 bg-[#C7AE6A]/5 p-8 text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="w-12 h-12 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-[#C7AE6A]" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white">Earnings events are Essential+</h3>
                            <p className="text-sm text-gray-400 max-w-sm mx-auto">
                                Upgrade to unlock earnings calendars, ticker-level signals, and full catalyst intelligence.
                            </p>
                            <Link href="/pricing">
                                <Button className="bg-[#C7AE6A] hover:bg-[#b99a45] text-black font-bold px-6 rounded-xl">
                                    Upgrade to Essential
                                </Button>
                            </Link>
                        </div>
                    )}

                    {!isLoading && !isError && view === "list" && (
                        <>
                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-[#C7AE6A]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            Events Feed
                                        </h2>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                                            All scheduled catalysts
                                        </p>
                                    </div>
                                </div>
                                {displayedEvents.length === 0 ? (
                                    <div className="text-center py-10 bg-[#0c0c0c]/50 border border-dashed border-[#222] rounded-xl space-y-4">
                                        <p className="text-gray-500 text-sm">No events match the selected filter.</p>
                                        <button
                                            onClick={() => {
                                                setFilter("All impact");
                                                setSearchQuery("");
                                            }}
                                            className="text-[10px] font-black uppercase tracking-widest text-[#C7AE6A] hover:underline"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {displayedEvents.map((event) =>
                                            event.event_type === "earnings" ? (
                                                <EarningsEventRow key={event.event_id} event={event} showNumericScores={fullAccess} tier={tier} />
                                            ) : (
                                                <MacroEventRow
                                                    key={event.event_id}
                                                    event={event}
                                                    whaleConfirmation={getWhaleConfirmation(event.scheduled_time)}
                                                    showNumericScores={fullAccess}
                                                />
                                            ),
                                        )}
                                    </div>
                                )}
                            </section>

                        </>
                    )}

                    {!isLoading && !isError && view === "calendar" && (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            <CatalystCalendarView events={filteredEvents} />
                            <div className="mt-6 flex justify-center">
                                <div className="inline-flex items-center gap-4 text-xs text-gray-500 bg-[#111] px-4 py-2 rounded-full border border-[#222]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                                        <span>High Impact</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-500" />
                                        <span>Standard</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer signature */}
                <div className="pt-20 text-center">
                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full">
                        <span className="text-[9px] text-gray-700 font-black uppercase tracking-[0.4em]">Proprietary macro intelligence engine</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C7AE6A] animate-pulse" />
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">GOLDH.ai</span>
                    </div>
                </div>
            </main>

            {/* Mobile Filter Drawer */}
            <Sheet open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
                <SheetContent side="bottom" className="bg-[#0a0a0a] border-t border-[#333]">
                    <SheetHeader className="mb-6 text-left">
                        <SheetTitle className="text-lg font-bold text-white">Filter events</SheetTitle>
                        <SheetDescription className="text-gray-400">
                            Select criteria to refine the catalyst feed.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 pb-8">
                        {FILTERS.map((label) => (
                            <button
                                key={label}
                                onClick={() => {
                                    setFilter(label);
                                    setIsFilterDrawerOpen(false);
                                }}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all w-full text-left",
                                    filter === label
                                        ? "bg-[#C7AE6A] text-black border-[#C7AE6A]"
                                        : "bg-[#111] text-gray-400 border-[#222] hover:bg-[#222] hover:text-white",
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </AppLayout>
    );
}
