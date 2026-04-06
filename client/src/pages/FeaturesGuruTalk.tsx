import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar, BookOpen, Building, ShieldCheck, User, ExternalLink, Zap, Lock } from "lucide-react";
import { STREETScoreSidebar } from "@/modules/streetscore/components/STREETScoreSidebar";
import { GuruInsight } from "@shared/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useCatalystEvents } from "@/modules/catalyst/hooks/useCatalystEvents";
import type { CatalystEvent } from "@/modules/catalyst/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/shared/PageHeader";
import { ActiveFilterChips, FilterChip } from "@/components/shared/ActiveFilterChips";

const THEME_TAGS = ["AI", "Rates", "Inflation", "Bitcoin", "Earnings", "Regulation", "Geopolitics", "Technology", "Macro", "Energy"];

export default function FeaturesGuruTalk() {
    const { user } = useAuth();
    const tier = user?.planTier ?? 'free';

    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        assetClass: "all",
        sentiment: "all",
        guruId: "all",
        themeTag: "all"
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Catalyst cross-module triggers for banner
    const { data: catalystData } = useCatalystEvents({ upcoming: true });
    const activeTriggers = (catalystData?.events ?? []).filter(
        (e: CatalystEvent) => e.cross_module_trigger === true,
    );

    const { data: gurus } = useQuery<any[]>({
        queryKey: ["/api/news/gurus"],
        queryFn: async () => {
            const res = await fetch("/api/news/gurus");
            if (!res.ok) throw new Error("Failed to fetch gurus");
            return res.json();
        }
    });

    const { data: insightData, isLoading } = useQuery<{ items: GuruInsight[]; preview?: boolean }>({
        queryKey: ["/api/news/guru-talk", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.assetClass !== "all") {
                // Map 'Stocks' (UI) to 'Equities' (DB)
                const mappedClass = filters.assetClass === "Stocks" ? "Equities" : filters.assetClass;
                params.append("assetClass", mappedClass);
            }
            if (filters.sentiment !== "all") params.append("sentiment", filters.sentiment);
            if (filters.guruId !== "all") params.append("guruId", filters.guruId);
            if (filters.themeTag !== "all") params.append("themeTag", filters.themeTag);

            // Skip server sorting to avoid index errors, we sort client side
            params.append("limit", "100");
            params.append("skipSort", "true");

            const res = await fetch(`/api/news/guru-talk?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch insights");
            return res.json();
        }
    });

    const isPreview = insightData?.preview === true;

    const rawInsights = useMemo(() => {
        return (insightData?.items || []).sort((a, b) =>
            new Date(b.sourceTimestamp).getTime() - new Date(a.sourceTimestamp).getTime()
        );
    }, [insightData]);

    const insights = useMemo(() => {
        if (!searchTerm) return rawInsights;
        const lowerTerm = searchTerm.toLowerCase();
        return rawInsights.filter(insight =>
            insight.assetSymbol.toLowerCase().includes(lowerTerm) ||
            insight.guruDisplayName.toLowerCase().includes(lowerTerm) ||
            insight.summaryText.toLowerCase().includes(lowerTerm)
        );
    }, [rawInsights, searchTerm]);

    // Grouping by Guru for Mobile Carousel
    const groupedInsights = useMemo(() => {
        const groups: Record<string, GuruInsight[]> = {};
        insights.forEach(insight => {
            const guru = insight.guruDisplayName;
            if (!groups[guru]) groups[guru] = [];
            groups[guru].push(insight);
        });
        return groups;
    }, [insights]);

    // Active Filter Chips logic
    const activeChips = useMemo(() => {
        const chips: FilterChip[] = [];
        if (filters.sentiment !== "all") {
            chips.push({
                label: "Sentiment",
                value: filters.sentiment,
                onRemove: () => setFilters(f => ({ ...f, sentiment: "all" }))
            });
        }
        if (filters.guruId !== "all") {
            const guru = gurus?.find(g => g.guruId === filters.guruId);
            chips.push({
                label: "Guru",
                value: guru?.displayName || filters.guruId,
                onRemove: () => setFilters(f => ({ ...f, guruId: "all" }))
            });
        }
        if (filters.themeTag !== "all") {
            chips.push({
                label: "Theme",
                value: filters.themeTag,
                onRemove: () => setFilters(f => ({ ...f, themeTag: "all" }))
            });
        }
        if (searchTerm) {
            chips.push({
                label: "Search",
                value: searchTerm,
                onRemove: () => setSearchTerm("")
            });
        }
        return chips;
    }, [filters, gurus, searchTerm]);

    return (
        <AppLayout title="Guru Talk">
            <main className="container mx-auto px-4 sm:px-6 pt-6 pb-12 max-w-6xl">
                {/* Header Section */}
                <PageHeader
                    label="Alpha Insights"
                    title="Guru Talk"
                    description="Tactical trade ideas and market calls from the world's leading institutional investors."
                    icon={<BookOpen className="w-8 h-8" />}
                />

                {/* Catalyst Active Banner */}
                {activeTriggers.length > 0 && (
                    <div className="mb-6 space-y-2">
                        {activeTriggers.slice(0, 3).map((event: CatalystEvent) => {
                            const label = event.event_type === "earnings"
                                ? `${event.ticker} Earnings`
                                : event.event_name;
                            const biasLabel = event.bias ?? "Neutral";
                            const isRiskOn = biasLabel === "Risk-On";
                            const isRiskOff = biasLabel === "Risk-Off";
                            const iconColor = isRiskOn ? "text-emerald-400" : isRiskOff ? "text-rose-400" : "text-amber-400";
                            const labelColor = isRiskOn ? "text-emerald-400" : isRiskOff ? "text-rose-400" : "text-amber-400";
                            const containerClass = isRiskOn
                                ? "bg-emerald-500/10 border-emerald-500/30"
                                : isRiskOff
                                    ? "bg-rose-500/10 border-rose-500/30"
                                    : "bg-amber-500/10 border-amber-500/30";
                            const biasTextColor = isRiskOn ? "text-emerald-400" : isRiskOff ? "text-rose-400" : "text-amber-400";
                            const impactBand = (event as any).impact_band;
                            return (
                                <div
                                    key={event.event_id}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 border rounded-xl",
                                        containerClass,
                                    )}
                                >
                                    <Zap className={cn("w-4 h-4 shrink-0 animate-pulse", iconColor)} aria-hidden="true" />
                                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                                        <span className={cn("text-[10px] font-black uppercase tracking-widest shrink-0", labelColor)}>
                                            Catalyst Active
                                        </span>
                                        <span className="text-[10px] text-gray-400 min-w-0">
                                            <span className="text-gray-300 font-semibold">{label}</span>
                                            {" "}|{" "}
                                            <span className={cn("font-black uppercase", biasTextColor)}>{biasLabel}</span>
                                            {" "}bias
                                            {impactBand && (
                                                <>
                                                    {" "}|{" "}
                                                    <span className="text-gray-500 capitalize">{impactBand} impact</span>
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Feed Toolbar (Sticky) */}
                <div className="sticky top-0 bg-background/80 backdrop-blur-md py-4 z-40 border-b border-white/5 mb-8 transition-all">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                        {/* Search & Mobile Filter Toggle */}
                        <div className="flex items-center gap-3 w-full md:w-auto md:order-2">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-secondary border-border rounded-xl pl-10 pr-4 h-10 text-xs text-foreground focus:border-primary/40 transition-all"
                                />
                            </div>

                            {/* Mobile Filter Trigger */}
                            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="md:hidden shrink-0 bg-secondary border-border text-muted-foreground hover:text-foreground rounded-xl">
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="bg-[#1a1a1a] border-t border-border text-foreground p-6 rounded-t-3xl h-[80vh]">
                                    <SheetHeader className="mb-6 text-left">
                                        <SheetTitle className="text-foreground text-lg font-bold">Filters</SheetTitle>
                                    </SheetHeader>
                                    <ScrollArea className="h-full pb-20">
                                        <div className="space-y-6">
                                            {/* Mobile Sentiment */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sentiment</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {["All", "Positive", "Neutral", "Negative"].map(sentiment => {
                                                        const isActive = (sentiment === 'All' && filters.sentiment === 'all') || filters.sentiment === sentiment;
                                                        return (
                                                            <button
                                                                key={sentiment}
                                                                onClick={() => setFilters(f => ({ ...f, sentiment: sentiment === 'All' ? 'all' : sentiment }))}
                                                                className={cn(
                                                                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border outline-none",
                                                                    isActive
                                                                        ? "bg-primary text-primary-foreground border-primary"
                                                                        : "bg-secondary text-muted-foreground border-border hover:border-border/80"
                                                                )}
                                                            >
                                                                {sentiment}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Mobile Guru */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Guru / Source</label>
                                                <Select value={filters.guruId} onValueChange={(v) => setFilters(f => ({ ...f, guruId: v }))}>
                                                    <SelectTrigger className={cn("w-full bg-secondary border-border h-12 rounded-xl text-foreground text-[10px] uppercase font-black tracking-widest focus:ring-0 shadow-none")}>
                                                        <SelectValue placeholder="All Gurus" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-popover border-border text-foreground max-h-[300px]">
                                                        <SelectItem value="all" className="text-[10px] uppercase font-black tracking-widest">All Gurus</SelectItem>
                                                        {gurus?.map(g => (
                                                            <SelectItem key={g.guruId} value={g.guruId} className="text-[10px] uppercase font-bold tracking-wider">{g.displayName}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Mobile Theme */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Theme</label>
                                                <Select value={filters.themeTag} onValueChange={(v) => setFilters(f => ({ ...f, themeTag: v }))}>
                                                    <SelectTrigger className={cn("w-full bg-secondary border-border h-12 rounded-xl text-foreground text-[10px] uppercase font-black tracking-widest focus:ring-0 shadow-none")}>
                                                        <SelectValue placeholder="All Themes" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-popover border-border text-foreground">
                                                        <SelectItem value="all" className="text-[10px] uppercase font-black tracking-widest">All Themes</SelectItem>
                                                        {THEME_TAGS.map(tag => (
                                                            <SelectItem key={tag} value={tag} className="text-[10px] uppercase font-bold tracking-wider">{tag}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="pt-4 grid grid-cols-2 gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="w-full bg-secondary border-border text-foreground hover:bg-muted font-bold h-12 rounded-xl"
                                                    onClick={() => {
                                                        setFilters({ assetClass: "all", sentiment: "all", guruId: "all", themeTag: "all" });
                                                        setSearchTerm("");
                                                    }}
                                                >
                                                    Clear
                                                </Button>
                                                <Button
                                                    className="w-full bg-primary text-primary-foreground hover:bg-[#b99a45] font-bold h-12 rounded-xl"
                                                    onClick={() => setIsFilterOpen(false)}
                                                >
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Desktop Filters (Hidden on Mobile) */}
                        <div className="hidden md:flex items-center gap-2 w-full md:w-auto md:order-1">
                            {/* Sentiment Filters */}
                            {["All", "Positive", "Neutral", "Negative"].map(sentiment => {
                                const isActive = (sentiment === 'All' && filters.sentiment === 'all') || filters.sentiment === sentiment;
                                return (
                                    <button
                                        key={sentiment}
                                        onClick={() => setFilters(f => ({ ...f, sentiment: sentiment === 'All' ? 'all' : sentiment }))}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                                                : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                                        )}
                                    >
                                        {sentiment}
                                    </button>
                                );
                            })}
                            <div className="w-px h-6 bg-white/5 mx-2 flex-shrink-0" />

                            {/* Guru Filter Dropdown Trigger */}
                            <div className="flex-shrink-0">
                                <Select value={filters.guruId} onValueChange={(v) => setFilters(f => ({ ...f, guruId: v }))}>
                                    <SelectTrigger className={cn("w-[140px] bg-secondary border-border h-9 rounded-xl text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-foreground focus:ring-0 shadow-none")}>
                                        <SelectValue placeholder="All Gurus" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border text-foreground">
                                        <SelectItem value="all" className="text-[10px] uppercase font-black tracking-widest">All Gurus</SelectItem>
                                        {gurus?.map(g => (
                                            <SelectItem key={g.guruId} value={g.guruId} className="text-[10px] uppercase font-bold tracking-wider">{g.displayName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Theme Filter Dropdown Trigger */}
                            <div className="flex-shrink-0">
                                <Select value={filters.themeTag} onValueChange={(v) => setFilters(f => ({ ...f, themeTag: v }))}>
                                    <SelectTrigger className={cn("w-[140px] bg-secondary border-border h-9 rounded-xl text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-foreground focus:ring-0 shadow-none")}>
                                        <SelectValue placeholder="All Themes" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border text-foreground">
                                        <SelectItem value="all" className="text-[10px] uppercase font-black tracking-widest">All Themes</SelectItem>
                                        {THEME_TAGS.map(tag => (
                                            <SelectItem key={tag} value={tag} className="text-[10px] uppercase font-bold tracking-wider">{tag}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Active Filter Chips */}
                    <div className="mt-4 px-1">
                        <ActiveFilterChips
                            filters={activeChips}
                            onClearAll={() => {
                                setFilters({ assetClass: "all", sentiment: "all", guruId: "all", themeTag: "all" });
                                setSearchTerm("");
                            }}
                        />
                    </div>
                </div>



                {/* Grid Layout (Desktop) & Carousel (Mobile) */}
                {isLoading ? (
                    <div className="text-center py-20 animate-pulse text-muted-foreground">Loading insights...</div>
                ) : insights.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
                        No insights found matching your criteria.
                    </div>
                ) : (
                    <>
                        {/* Mobile: Netflix-style Carousel */}
                        <div className="md:hidden space-y-10">
                            {Object.entries(groupedInsights).map(([guruName, guruInsights]) => (
                                <section key={guruName} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-5 bg-primary rounded-full shadow-[0_0_8px_rgba(199,174,106,0.3)]" />
                                            <h2 className="text-lg font-black text-white tracking-tight">{guruName}</h2>
                                            <span className="text-[10px] bg-[#1a1a1a] text-gray-400 px-2 py-0.5 rounded-md font-bold">{guruInsights.length}</span>
                                        </div>
                                    </div>

                                    {/* Horizontal Swipe Container */}
                                    <div className="flex gap-4 overflow-x-auto pb-6 px-2 no-scrollbar snap-x snap-mandatory touch-pan-x">
                                        {guruInsights.map((insight) => (
                                            <div key={insight.insightId} className="flex-none w-[85vw] max-w-[320px] snap-start">
                                                <InsightCard insight={insight} />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>

                        {/* Desktop: Grid Layout */}
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
                            {insights.map((insight) => (
                                <InsightCard key={insight.insightId} insight={insight} />
                            ))}
                        </div>
                    </>
                )}

                {/* Preview upgrade prompt for free tier */}
                {isPreview && (
                    <div className="mt-8 rounded-2xl border border-[#C7AE6A]/20 bg-[#C7AE6A]/5 p-8 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="w-12 h-12 rounded-xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-[#C7AE6A]" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white">You're viewing a preview</h3>
                        <p className="text-sm text-gray-400 max-w-sm mx-auto">
                            Upgrade to Essential to unlock the full Guru Talk feed — all insights, all filters, no limits.
                        </p>
                        <Link href="/pricing">
                            <Button className="bg-[#C7AE6A] hover:bg-[#b99a45] text-black font-bold px-6 rounded-xl">
                                Upgrade to Essential
                            </Button>
                        </Link>
                    </div>
                )}
            </main >
        </AppLayout>
    );
}

function InsightCard({ insight }: { insight: GuruInsight }) {
    return (
        <Card className="bg-[#1a1a1a] border-border hover:border-primary/30 hover:shadow-[0_0_30px_var(--primary-foreground)] transition-all duration-300 group overflow-hidden flex flex-col h-full rounded-2xl">
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 flex flex-col h-full">
                {/* Header: Guru + Date */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        {/* Icon Placeholder based on Type */}
                        <div className="w-10 h-10 rounded-xl bg-black border border-border flex items-center justify-center shrink-0">
                            {insight.guruEntityType === 'Institution' ? <Building className="w-5 h-5 text-blue-400" /> :
                                insight.guruEntityType === 'Analyst' ? <BookOpen className="w-5 h-5 text-emerald-400" /> :
                                    insight.guruEntityType === 'Insider' ? <ShieldCheck className="w-5 h-5 text-rose-400" /> :
                                        <User className="w-5 h-5 text-primary" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white leading-tight line-clamp-1">{insight.guruDisplayName}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{insight.guruEntityType}</p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold bg-black px-2 py-1 rounded-md border border-border">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(insight.sourceTimestamp), 'MMM d')}
                        </div>
                    </div>
                </div>

                {/* Asset & Action */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-black text-white tracking-tight">{insight.assetSymbol}</span>
                    <Badge variant="outline" className={cn(
                        "uppercase text-[10px] font-black tracking-widest border px-2 py-0.5",
                        insight.actionType === 'BUY' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                            insight.actionType === 'SELL' ? "bg-red-500/10 text-red-400 border-red-500/30" :
                                "bg-[#1a1a1a] text-muted-foreground border-border"
                    )}>
                        {insight.actionType}
                    </Badge>
                </div>

                {/* STREETScore mini card — equity/ETF, PRO+ only */}
                <div className="mb-3">
                  <STREETScoreSidebar ticker={insight.assetSymbol} tier={tier} assetClass={insight.assetClass} />
                </div>

                {/* Summary (Italic) */}
                <p className="text-sm text-gray-400 leading-relaxed font-medium line-clamp-3 mb-6 flex-grow italic">
                    "{insight.summaryText}"
                </p>

                {/* Footer */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-black text-gray-400 hover:text-foreground text-[10px] font-bold border border-border uppercase tracking-widest px-2 py-0.5">
                            {insight.assetClass}
                        </Badge>
                        {insight.sentiment && (
                            <Badge variant="outline" className={cn("text-[10px] font-black uppercase tracking-widest border whitespace-nowrap px-2 py-0.5",
                                insight.sentiment === 'Positive' ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5" :
                                    insight.sentiment === 'Negative' ? "text-red-400 border-red-500/30 bg-red-500/5" : "text-gray-400 border-border bg-black"
                            )}>
                                {insight.sentiment}
                            </Badge>
                        )}
                    </div>

                    {insight.sourceUrl && (
                        <a
                            href={insight.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#C7AE6A] transition-colors p-1"
                            title="View Source"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
