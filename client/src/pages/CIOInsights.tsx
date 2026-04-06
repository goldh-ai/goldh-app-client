import { useState, useMemo, Fragment } from "react";
import { Link, useLocation } from "wouter";
import { useContent } from "@/hooks/useContent";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { ActiveFilterChips } from "@/components/shared/ActiveFilterChips";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRange } from "react-day-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Search,
    Filter,
    Calendar,
    Clock,
    FileText,
    AlertCircle,
    X,
    ChevronRight,
    Loader2,
    Sparkles,
    ArrowLeft,
    TrendingUp,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function CIOInsights() {
    const { data: items, isLoading } = useContent();
    const [activeTab, setActiveTab] = useState("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [, setLocation] = useLocation();

    const filteredItems = useMemo(() => {
        if (!items) return [];
        return items.filter(item => {
            const matchesTab = activeTab === "all" || item.type === activeTab;
            const matchesSearch =
                item.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
                item.symbols.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

            if (!matchesTab || !matchesSearch) return false;

            if (dateRange?.from) {
                const date = new Date(item.uploaded_at);
                const from = dateRange.from;
                const to = dateRange.to ? new Date(dateRange.to) : new Date(from);
                to.setHours(23, 59, 59, 999);
                if (date < from || date > to) return false;
            }

            return true;
        });
    }, [items, activeTab, searchTerm, dateRange]);

    const activeFilters = useMemo(() => {
        const filters = [];
        if (activeTab !== "all") {
            filters.push({
                label: "Type",
                value: activeTab === "brief" ? "Briefs" : "Alerts",
                onRemove: () => setActiveTab("all")
            });
        }
        if (dateRange?.from) {
            filters.push({
                label: "Date",
                value: dateRange.to
                    ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
                    : format(dateRange.from, 'MMM d'),
                onRemove: () => setDateRange(undefined)
            });
        }
        if (searchTerm) {
            filters.push({
                label: "Search",
                value: searchTerm,
                onRemove: () => setSearchTerm("")
            });
        }
        return filters;
    }, [activeTab, dateRange, searchTerm]);

    return (
        <AppLayout title="CIO Insights">
            <main className="container mx-auto px-4 sm:px-6 pt-6 pb-12 max-w-7xl animate-in fade-in duration-700">

                <PageHeader
                    label="Research Office"
                    title="CIO Insights"
                    description="Strategic research, market alerts, and investment briefs from the GOLDH CIO."
                    icon={<Sparkles className="w-5 h-5" />}
                    actions={
                        <Link href="/intelligence-hub">
                            <Button
                                variant="outline"
                                className="h-11 px-6 gap-2 rounded-xl border-[#222] text-gray-400 hover:text-[#C7AE6A] hover:bg-[#C7AE6A]/10 transition-all font-bold group"
                            >
                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                <span>Returns to Hub</span>
                            </Button>
                        </Link>
                    }
                />

                {/* Filter Toolbar */}
                <div className="bg-[#050505] py-4 mb-8 transition-all">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Search & Mobile Filter Toggle */}
                        <div className="flex items-center gap-3 w-full md:w-auto md:order-2">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search Insights..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#111] border border-[#222] rounded-xl pl-10 pr-4 h-10 text-xs text-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-primary/40 transition-all font-medium"
                                />
                            </div>

                            {/* Mobile Filter Trigger */}
                            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="md:hidden shrink-0 bg-[#111] border-[#222] text-muted-foreground hover:text-foreground rounded-xl">
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="bg-[#0a0a0a] border-t border-[#222] text-foreground p-6 rounded-t-3xl h-[85vh]">
                                    <SheetHeader className="mb-6 text-left">
                                        <SheetTitle className="text-foreground text-lg font-bold">Filters</SheetTitle>
                                    </SheetHeader>
                                    <ScrollArea className="h-full pb-20">
                                        <div className="space-y-6">
                                            {/* Mobile Tabs */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Insight type</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {[
                                                        { label: "All", value: "all" },
                                                        { label: "Briefs", value: "brief" },
                                                        { label: "Alerts", value: "alert" }
                                                    ].map(tab => (
                                                        <button
                                                            key={tab.value}
                                                            onClick={() => setActiveTab(tab.value)}
                                                            className={cn(
                                                                "px-4 py-2 rounded-xl text-xs font-bold transition-all border outline-none focus:ring-0",
                                                                activeTab === tab.value
                                                                    ? "bg-foreground text-background border-foreground"
                                                                    : "bg-[#111] text-muted-foreground border-[#222] hover:border-muted-foreground"
                                                            )}
                                                        >
                                                            {tab.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Mobile Date Range */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Date Range</label>
                                                <DateRangePicker
                                                    dateRange={dateRange}
                                                    onDateChange={setDateRange}
                                                    className="w-full bg-[#111] border-[#222] rounded-xl h-12"
                                                />
                                            </div>

                                            <div className="pt-4 grid grid-cols-2 gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="w-full bg-[#111] border-[#222] text-foreground hover:bg-muted font-bold h-12 rounded-xl"
                                                    onClick={() => {
                                                        setActiveTab("all");
                                                        setDateRange({ from: undefined, to: undefined });
                                                        setSearchTerm("");
                                                    }}
                                                >
                                                    Clear Filters
                                                </Button>
                                                <Button
                                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 rounded-xl"
                                                    onClick={() => setIsMobileFiltersOpen(false)}
                                                >
                                                    Apply Filters
                                                </Button>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Desktop Filters (Hidden on Mobile) */}
                        <div className="hidden md:flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0 touch-pan-x md:order-1">
                            {/* Insight Type Tabs as Chips */}
                            <div className="flex gap-2 mr-2">
                                {[
                                    { label: "All Insights", value: "all" },
                                    { label: "Briefs", value: "brief" },
                                    { label: "Alerts", value: "alert" }
                                ].map(tab => (
                                    <button
                                        key={tab.value}
                                        onClick={() => setActiveTab(tab.value)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0",
                                            activeTab === tab.value
                                                ? "bg-foreground text-background shadow-xl"
                                                : "bg-[#111] text-muted-foreground hover:text-foreground border border-[#222]"
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="w-px h-6 bg-border mx-2 flex-shrink-0" />

                            {/* Date Range */}
                            <div className="flex-shrink-0">
                                <DateRangePicker
                                    dateRange={dateRange}
                                    onDateChange={setDateRange}
                                    className="w-[240px] h-9 text-xs uppercase font-black"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Filter Chips */}
                <ActiveFilterChips
                    filters={activeFilters}
                    onClearAll={() => {
                        setActiveTab("all");
                        setDateRange(undefined);
                        setSearchTerm("");
                    }}
                    className="mb-8"
                />

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-6 md:p-8 space-y-6">
                                <Skeleton className="w-12 h-12 rounded-2xl bg-white/5" />
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-3/4 bg-white/5" />
                                    <Skeleton className="h-4 w-full bg-white/5" />
                                    <Skeleton className="h-4 w-full bg-white/5" />
                                    <Skeleton className="h-4 w-1/2 bg-white/5" />
                                </div>
                                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <Skeleton className="h-5 w-16 rounded-lg bg-white/5" />
                                        <Skeleton className="h-5 w-16 rounded-lg bg-white/5" />
                                    </div>
                                    <Skeleton className="h-6 w-6 rounded-full bg-white/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {filteredItems.map((item) => (
                            <ContentCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 sm:py-40 text-center">
                        <X className="h-12 w-12 text-gray-700 mb-6 opacity-20" />
                        <p className="text-gray-400 text-lg font-bold mb-2 uppercase tracking-widest">No matching insights found</p>
                        <p className="text-gray-500 text-sm">Refine your search parameters or reset all filters.</p>
                        <Button
                            variant="link"
                            className="text-[#C7AE6A] mt-4 font-bold"
                            onClick={() => {
                                setActiveTab("all");
                                setDateRange(undefined);
                                setSearchTerm("");
                            }}
                        >
                            Reset All Filters
                        </Button>
                    </div>
                )}
            </main>

            {/* Modal */}
            <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
                <DialogContent className="sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl p-0 bg-[#0a0a0a] border-[#222] text-foreground rounded-2xl overflow-hidden glass-morphism shadow-3xl">
                    {selectedItem && (
                        <>
                            <DialogHeader className="p-6 border-b border-white/5 bg-[#111]">
                                <DialogTitle className="text-xl font-bold text-[#C7AE6A] flex items-center gap-3">
                                    <Sparkles className="h-5 w-5" />
                                    Insight Details
                                </DialogTitle>
                            </DialogHeader>
                            <div className="p-6 sm:p-8 lg:p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="flex items-center gap-4 mb-6 text-gray-400 text-xs font-black uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-[#C7AE6A]" />
                                        {format(new Date(selectedItem.uploaded_at), 'MMMM dd, yyyy')}
                                    </span>
                                    <span className="text-white/10">|</span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-[#C7AE6A]" />
                                        {Math.max(1, Math.round((selectedItem.html_content?.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length || 0) / 200))} min read
                                    </span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tighter text-white">
                                    {selectedItem.display_name}
                                </h2>

                                <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b border-white/5">
                                    {selectedItem.symbols.map((s: string) => (
                                        <div key={s} className="bg-[#C7AE6A]/10 px-3 py-1 rounded-lg text-xs font-black text-[#C7AE6A] border border-[#C7AE6A]/20 uppercase tracking-widest">
                                            {s}
                                        </div>
                                    ))}
                                    {selectedItem.tags.map((t: string) => (
                                        <div key={t} className="bg-white/5 px-3 py-1 rounded-lg text-xs text-gray-500 font-bold uppercase tracking-wider">
                                            #{t}
                                        </div>
                                    ))}
                                </div>

                                <div
                                    className="cio-content max-w-none text-gray-300 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: selectedItem.html_content }}
                                />
                            </div>
                            <div className="p-4 border-t border-white/5 bg-[#0a0a0a] flex justify-end">
                                <Button variant="ghost" onClick={() => setSelectedItem(null)} className="text-gray-500 hover:text-white font-black uppercase tracking-widest text-xs">
                                    Close Insight
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

function ContentCard({ item, onClick }: { item: any, onClick: () => void }) {
    return (
        <Card
            className="bg-[#0a0a0a] border-[#222] hover:border-[#C7AE6A]/40 transition-all duration-500 cursor-pointer group shadow-2xl hover:shadow-[#C7AE6A]/5 overflow-hidden rounded-2xl relative"
            onClick={onClick}
        >
            <div className="absolute top-0 right-0 p-4">
                <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                    {format(new Date(item.uploaded_at), 'MM/dd')}
                </span>
            </div>
            <CardContent className="p-6 md:p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg",
                        item.type === 'brief'
                            ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:shadow-blue-500/10"
                            : "bg-[#C7AE6A]/10 text-[#C7AE6A] group-hover:bg-[#C7AE6A]/20 group-hover:shadow-[#C7AE6A]/10"
                    )}>
                        {item.type === 'brief' ? <FileText className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                    </div>
                </div>

                <h3 className="text-xl font-black mb-4 group-hover:text-[#C7AE6A] transition-colors line-clamp-2 leading-tight tracking-tight text-white">
                    {item.display_name}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-3 mb-8 leading-relaxed flex-1 font-medium italic opacity-70">
                    {item.summary || "Click to view full insight details and investment takeaways."}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                    <div className="flex gap-2 overflow-hidden">
                        {item.symbols.slice(0, 3).map((s: string) => (
                            <span key={s} className="text-[10px] text-[#C7AE6A] font-black bg-[#C7AE6A]/5 px-2.5 py-1 rounded-lg border border-[#C7AE6A]/10 uppercase tracking-widest">
                                {s}
                            </span>
                        ))}
                        {item.symbols.length > 3 && (
                            <span className="text-[10px] text-gray-600 font-bold bg-[#111] px-2.5 py-1 rounded-lg uppercase">
                                +{item.symbols.length - 3}
                            </span>
                        )}
                    </div>
                    <div className="text-[#C7AE6A] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 bg-[#C7AE6A]/10 p-1.5 rounded-full">
                        <ChevronRight className="h-4 w-4" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
