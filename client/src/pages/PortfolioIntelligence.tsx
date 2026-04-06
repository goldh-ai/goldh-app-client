import { useState, useEffect, useMemo, Fragment } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Link, useLocation } from "wouter";
import { SymbolDatalink } from "@/components/SymbolDatalink";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActiveFilterChips } from "@/components/shared/ActiveFilterChips";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    History,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    ChevronDown,
    ChevronUp,
    ChevronRight,
    Search,
    Clock,
    ShieldCheck,
    Filter,
    ArrowLeft,
    Zap,
    Target,
    Info
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
    PortfolioIntelligenceItem,
    PortfolioHistory
} from "@shared/types";
import { format } from "date-fns";

// Helper: Format Currency
const formatCurrency = (val: number, isCrypto = false) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: isCrypto && val < 1 ? 4 : 2,
        maximumFractionDigits: isCrypto ? 8 : 2
    }).format(val);
};

const PORTFOLIO_ASSET_TYPES = ["Equity", "ETF", "Commodity", "Forex", "Crypto", "Bond"];

export default function PortfolioIntelligence() {
    const [items, setItems] = useState<PortfolioIntelligenceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [, setLocation] = useLocation();

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [assetTypeFilter, setAssetTypeFilter] = useState<string>("All");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [sortConfig, setSortConfig] = useState<{ key: keyof PortfolioIntelligenceItem | 'ticker-name'; direction: 'asc' | 'desc' } | null>({ key: 'ticker-name', direction: 'asc' });

    // Expansion State
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const toggleSectionExpand = (id: string) => setExpandedSections(p => ({ ...p, [id]: !p[id] }));

    // History View State
    const [historyItem, setHistoryItem] = useState<PortfolioIntelligenceItem | null>(null);
    const [historyLogs, setHistoryLogs] = useState<PortfolioHistory[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Fetch Data
    const fetchPortfolio = async () => {
        try {
            setRefreshing(true);
            const res = await fetch("/api/portfolio-intelligence");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();

            // Ensure data is an array before setting
            const itemsArray = Array.isArray(data) ? data : (data.items || []);
            setItems(itemsArray);

        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    // Fetch History
    const fetchHistory = async (item: PortfolioIntelligenceItem) => {
        try {
            setHistoryItem(item);
            setHistoryLoading(true);
            const res = await fetch(`/api/portfolio-intelligence/${item.id}/history`);
            if (!res.ok) throw new Error("Failed to fetch history");
            const data = await res.json();
            setHistoryLogs(data);
        } catch (error) {
            console.error("History error:", error);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleSort = (key: keyof PortfolioIntelligenceItem | 'ticker-name') => {
        setSortConfig(current => {
            if (current?.key === key) {
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'desc' };
        });
    };

    // Derived: Processed Items (Search + Filter + Sort)
    const processedItems = useMemo(() => {
        let result = [...items];

        // 1. Search (Ticker or Name)
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            result = result.filter(i =>
                i.ticker.toLowerCase().includes(lowSearch) ||
                i.name.toLowerCase().includes(lowSearch)
            );
        }

        // 2. Status Filter
        if (statusFilter !== "All") {
            result = result.filter(i => i.status === statusFilter);
        }

        // 2.5 Asset Type Filter
        if (assetTypeFilter !== "All") {
            result = result.filter(i => i.assetType === assetTypeFilter);
        }

        // 3. Date Range Filter
        if (dateRange?.from) {
            const from = dateRange.from;
            const to = dateRange.to ? new Date(dateRange.to) : new Date(from);
            to.setHours(23, 59, 59, 999); // End of day

            result = result.filter(i => {
                if (!i.createdAt_utc) return false;
                const date = new Date(i.createdAt_utc);
                return date >= from && date <= to;
            });
        }

        // 4. Sort
        if (sortConfig) {
            result.sort((a, b) => {
                let valA: any;
                let valB: any;

                if (sortConfig.key === 'ticker-name') {
                    valA = a.ticker.toLowerCase();
                    valB = b.ticker.toLowerCase();
                } else if (sortConfig.key === 'createdAt_utc') {
                    valA = a.createdAt_utc?.split('T')[0];
                    valB = b.createdAt_utc?.split('T')[0];
                } else {
                    valA = a[sortConfig.key];
                    valB = b[sortConfig.key];
                }

                if (valA === valB) {
                    if (sortConfig.key !== 'ticker-name') {
                        return a.ticker.toLowerCase() < b.ticker.toLowerCase() ? -1 : 1;
                    }
                    return 0;
                }
                if (valA === null || valA === undefined) return 1;
                if (valB === null || valB === undefined) return -1;

                const modifier = sortConfig.direction === 'asc' ? 1 : -1;
                return valA < valB ? -1 * modifier : 1 * modifier;
            });
        }

        return result;
    }, [items, searchTerm, statusFilter, assetTypeFilter, dateRange, sortConfig]);

    const activeFilters = useMemo(() => {
        const filters = [];
        if (statusFilter !== "All") {
            filters.push({
                label: "Status",
                value: statusFilter,
                onRemove: () => setStatusFilter("All")
            });
        }
        if (assetTypeFilter !== "All") {
            filters.push({
                label: "Asset class",
                value: assetTypeFilter,
                onRemove: () => setAssetTypeFilter("All")
            });
        }
        if (dateRange?.from) {
            const val = dateRange.to
                ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
                : format(dateRange.from, 'MMM d');
            filters.push({
                label: "Date",
                value: val,
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
    }, [statusFilter, assetTypeFilter, dateRange, searchTerm]);

    const TableSkeleton = () => (
        <div className="space-y-12">
            {[1, 2].map(group => (
                <div key={group} className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-1 h-5 bg-white/5 rounded-full" />
                        <Skeleton className="h-6 w-32 bg-white/5" />
                    </div>
                    <div className="bg-[#111111]/40 border border-[#222] rounded-2xl overflow-hidden glass-morphism">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[1000px]">
                                <thead className="bg-[#0c0c0c] border-b border-[#222]">
                                    <tr>
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <th key={i} className="px-5 py-4"><Skeleton className="h-3 w-16 bg-white/5" /></th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="h-[52px] border-b border-[#1a1a1a]">
                                            {Array.from({ length: 8 }).map((_, j) => (
                                                <td key={j} className="px-5 py-0"><Skeleton className="h-4 w-full max-w-[80px] bg-white/5" /></td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    // Grouping logic for the unified table
    const groupedProcessedItems = useMemo(() => {
        const groups: Record<string, PortfolioIntelligenceItem[]> = {};
        processedItems.forEach(item => {
            if (!groups[item.assetType]) groups[item.assetType] = [];
            groups[item.assetType].push(item);
        });
        return groups;
    }, [processedItems]);

    const assetClasses = PORTFOLIO_ASSET_TYPES;

    const getPluralAssetType = (type: string) => {
        const map: Record<string, string> = {
            "Equity": "Equities",
            "ETF": "ETFs",
            "Commodity": "Commodities",
            "Crypto": "Crypto",
            "Forex": "Forex",
            "FX": "Forex",
            "Bond": "Bonds"
        };
        return map[type] || type;
    };

    const StatusBadge = ({ status, closeReason }: { status: string; closeReason?: string | null }) => {
        // Stopped Out overrides the normal Closed badge
        if (status === "Closed" && closeReason === "stop_loss") {
            return (
                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 text-xs uppercase tracking-wider px-2 py-0.5 h-5 font-bold transition-all">
                    Stopped Out
                </Badge>
            );
        }

        const config: Record<string, { bg: string; text: string; border: string }> = {
            Open: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
            Hold: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
            Partial: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
            Closed: { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20" },
        };

        const style = config[status] || config.Open;

        return (
            <Badge variant="outline" className={`${style.bg} ${style.text} ${style.border} text-xs uppercase tracking-wider px-2 py-0.5 h-5 font-bold transition-all`}>
                {status}
            </Badge>
        );
    };

    return (
        <AppLayout title="Portfolio Intelligence">
            <main className="container mx-auto px-4 sm:px-6 pt-6 pb-12 max-w-7xl animate-in fade-in duration-700">

                <PageHeader
                    label="Alpha Pulse"
                    title="Portfolio Intelligence"
                    description="Track institutional alpha signals and historical performance."
                    icon={<ShieldCheck className="w-5 h-5" />}
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
                                    placeholder="Search Symbol..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#111] border border-[#222] rounded-xl pl-10 pr-4 h-10 text-xs text-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-primary/40 transition-all font-medium"
                                />
                            </div>

                            {/* Mobile Filter Trigger */}
                            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="md:hidden shrink-0 bg-card border-border text-muted-foreground hover:text-foreground rounded-xl">
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="bg-[#0a0a0a] border-t border-[#222] text-foreground p-6 rounded-t-3xl h-[85vh]">
                                    <SheetHeader className="mb-6 text-left">
                                        <SheetTitle className="text-foreground text-lg font-bold">Filters</SheetTitle>
                                    </SheetHeader>
                                    <ScrollArea className="h-full pb-20">
                                        <div className="space-y-6">
                                            {/* Mobile Status */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {["All", "Open", "Hold", "Partial", "Closed"].map(status => (
                                                        <button
                                                            key={status}
                                                            onClick={() => setStatusFilter(status)}
                                                            className={cn(
                                                                "px-4 py-2 rounded-xl text-xs font-bold transition-all border outline-none focus:ring-0",
                                                                statusFilter === status
                                                                    ? "bg-foreground text-background border-foreground"
                                                                    : "bg-secondary text-muted-foreground border-border hover:border-muted-foreground"
                                                            )}
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Mobile Asset Class */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Asset type</label>
                                                <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                                                    <SelectTrigger className={cn("w-full bg-[#111] border-[#222] h-12 rounded-xl text-foreground text-xs uppercase font-black tracking-widest focus:ring-0")}>
                                                        <SelectValue placeholder="All asset types" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-[#0a0a0a] border-[#222] text-foreground">
                                                        <SelectItem value="All" className="text-xs uppercase font-black tracking-widest">All assets</SelectItem>
                                                        {PORTFOLIO_ASSET_TYPES.map(o => (
                                                            <SelectItem key={o} value={o} className="text-xs uppercase font-bold tracking-wider">{getPluralAssetType(o)}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Mobile Date Range */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Date range</label>
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
                                                        setStatusFilter("All");
                                                        setAssetTypeFilter("All");
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
                            {/* Status Filter Chips */}
                            <div className="flex gap-2 mr-2">
                                {["All", "Open", "Hold", "Partial", "Closed"].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0",
                                            statusFilter === status
                                                ? "bg-foreground text-background shadow-xl"
                                                : "bg-[#111] text-muted-foreground hover:text-foreground border border-[#222]"
                                        )}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>

                            <div className="w-px h-6 bg-border mx-2 flex-shrink-0" />

                            {/* Asset Class Filter */}
                            <div className="flex-shrink-0">
                                <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                                    <SelectTrigger className={cn("w-[160px] bg-[#111] border-[#222] h-9 rounded-xl text-xs uppercase font-black tracking-widest text-muted-foreground hover:text-foreground focus:ring-0")}>
                                        <SelectValue placeholder="All asset types" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0a0a0a] border-[#222] text-foreground">
                                        <SelectItem value="All" className="text-xs uppercase font-black tracking-widest">All assets</SelectItem>
                                        {PORTFOLIO_ASSET_TYPES.map(o => (
                                            <SelectItem key={o} value={o} className="text-xs uppercase font-bold tracking-wider">{getPluralAssetType(o)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

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

                {/* Unified Asset Groups (Essentials Framework) */}
                {loading ? (
                    <TableSkeleton />
                ) : processedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 sm:py-40 text-center">
                        <History className="h-12 w-12 text-gray-700 mb-6 opacity-20" />
                        <p className="text-gray-400 text-lg font-bold mb-2 uppercase tracking-widest">No matching signals found</p>
                        <p className="text-gray-500 text-sm">Refine your search parameters or reset all filters.</p>
                        <Button
                            variant="outline"
                            className="text-[#C7AE6A] border-[#C7AE6A]/20 hover:bg-[#C7AE6A]/10 mt-4 font-bold"
                            onClick={() => {
                                setStatusFilter("All");
                                setAssetTypeFilter("All");
                                setDateRange(undefined);
                                setSearchTerm("");
                            }}
                        >
                            Reset All Filters
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {assetClasses.map((groupName) => {
                            const groupItems = groupedProcessedItems[groupName] || [];
                            if (groupItems.length === 0) return null;

                            const isExpanded = expandedSections[groupName] || searchTerm.length > 0;
                            const visibleItems = isExpanded ? groupItems : groupItems.slice(0, 5);
                            const hiddenCount = groupItems.length - 5;

                            return (
                                <section key={groupName} className="space-y-4 animate-in slide-in-from-left-2 duration-500">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-5 bg-[#C7AE6A] rounded-full shadow-[0_0_8px_rgba(199,174,106,0.3)]" />
                                            <h3 className="text-lg font-bold text-white tracking-tight">{getPluralAssetType(groupName)}</h3>
                                            <span className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-md font-bold">{groupItems.length}</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#111111]/40 backdrop-blur-xl border border-[#222] rounded-2xl overflow-hidden glass-morphism shadow-2xl">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left min-w-[1000px] border-collapse relative">
                                                <thead className="text-xs font-black text-gray-500 uppercase tracking-[0.15em] bg-[#0c0c0c] border-b border-[#222]">
                                                    <tr>
                                                        <th className="px-5 py-3.5 font-medium w-[150px] md:w-[220px] sticky left-0 bg-[#0c0c0c] z-30 border-r border-[#222]/50 md:border-none cursor-pointer" onClick={() => handleSort('ticker-name')}>
                                                            Symbol & Entity {sortConfig?.key === 'ticker-name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                        </th>
                                                        <th className="px-4 py-3.5 font-medium cursor-pointer" onClick={() => handleSort('createdAt_utc')}>
                                                            Date In {sortConfig?.key === 'createdAt_utc' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                        </th>
                                                        <th className="px-4 py-3.5 text-right font-medium cursor-pointer" onClick={() => handleSort('entryPrice')}>
                                                            Entry {sortConfig?.key === 'entryPrice' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                        </th>
                                                        <th className="px-4 py-3.5 text-right font-medium cursor-pointer" onClick={() => handleSort('effectiveStopLoss')}>
                                                            Stop {sortConfig?.key === 'effectiveStopLoss' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                        </th>
                                                        <th className="px-4 py-3.5 text-right font-medium cursor-pointer" onClick={() => handleSort('currentPrice')}>
                                                            Current {sortConfig?.key === 'currentPrice' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                        </th>
                                                        <th className="px-4 py-3.5 text-right font-medium cursor-pointer" onClick={() => handleSort('dailyPnLPct')}>
                                                            Daily PnL {sortConfig?.key === 'dailyPnLPct' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                        </th>
                                                        <th className="px-4 py-3.5 text-right font-medium cursor-pointer" onClick={() => handleSort('realizedReturnPct')}>
                                                            ITD PnL {sortConfig?.key === 'realizedReturnPct' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                        </th>
                                                        <th className="px-5 py-3.5 text-center font-medium cursor-pointer" onClick={() => handleSort('status')}>
                                                            Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#1a1a1a]">
                                                    {visibleItems.map((item) => (
                                                        <tr
                                                            key={item.id}
                                                            onClick={() => fetchHistory(item)}
                                                            className="transition-colors cursor-pointer group hover:bg-[#161616] h-[52px]"
                                                        >
                                                            <td className="px-5 py-0 sticky left-0 bg-[#0a0a0a] group-hover:bg-[#121212] transition-colors z-20 border-r border-[#222]/50 md:border-none">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-sm font-bold text-white group-hover:text-[#C7AE6A] transition-colors">{item.ticker}</span>
                                                                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest truncate max-w-[100px] md:max-w-[140px]">| {item.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-0 text-gray-600 font-bold text-xs uppercase tracking-tighter">
                                                                {item.createdAt_utc?.split('T')[0]}
                                                            </td>
                                                            <td className="px-4 py-0 text-right font-bold text-sm text-gray-300 font-mono tracking-tight">
                                                                {formatCurrency(item.entryPrice, item.assetType === "Crypto")}
                                                            </td>
                                                            <td className="px-4 py-0 text-right font-bold text-sm font-mono tracking-tight">
                                                                {item.effectiveStopLoss ? (
                                                                    <div className="flex flex-col items-end gap-0.5">
                                                                        <span className={item.stopPhase === 'profit_protection' ? 'text-amber-500/80' : 'text-red-500/80'}>
                                                                            {formatCurrency(item.effectiveStopLoss, item.assetType === "Crypto")}
                                                                        </span>
                                                                        {item.stopPhase === 'profit_protection' ? (
                                                                            <span className="text-[8px] text-amber-600/60 font-normal" title={`HWM: $${item.highWaterMark?.toLocaleString() ?? 'N/A'} (EOD)`}>
                                                                                {item.trailingStopPct ?? 20}% trail · HWM
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-[8px] text-red-600/50 font-normal">hard stop</span>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-700 font-black tracking-widest uppercase text-[9px]">N/A</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-0 text-right font-bold text-sm text-white font-mono tracking-tight">
                                                                {formatCurrency(item.currentPrice ?? 0, item.assetType === "Crypto")}
                                                            </td>
                                                            <td className={`px-4 py-0 text-right font-bold text-sm ${(item.dailyPnLPct ?? 0) > 0 ? "text-emerald-500" : (item.dailyPnLPct ?? 0) < 0 ? "text-red-500" : "text-gray-500"}`}>
                                                                <div className="flex items-center justify-end gap-1 font-mono tracking-tight">
                                                                    {item.dailyPnLPct !== null && ((item.dailyPnLPct ?? 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
                                                                    {(item.dailyPnLPct ?? 0) > 0 ? "+" : ""}{(item.dailyPnLPct ?? 0).toFixed(2)}%
                                                                </div>
                                                            </td>
                                                            <td className={`px-4 py-0 text-right font-bold text-sm ${(item.realizedReturnPct ?? 0) > 0 ? "text-emerald-500" : (item.realizedReturnPct ?? 0) < 0 ? "text-red-500" : "text-gray-500"}`}>
                                                                <div className="flex items-center justify-end gap-1 font-mono tracking-tight">
                                                                    {item.realizedReturnPct !== null && ((item.realizedReturnPct ?? 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
                                                                    {(item.realizedReturnPct ?? 0) > 0 ? "+" : ""}{(item.realizedReturnPct ?? 0).toFixed(2)}%
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-0 text-center">
                                                                <StatusBadge status={item.status} closeReason={item.closeReason} />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination Controls (Essentials Style) */}
                                        {hiddenCount > 0 && searchTerm === "" && (
                                            <button
                                                onClick={() => toggleSectionExpand(groupName)}
                                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#0c0c0c]/50 hover:bg-[#121212] border-t border-[#222] text-xs text-gray-500 hover:text-[#C7AE6A] font-black uppercase tracking-widest transition-all group"
                                            >
                                                {isExpanded ? (
                                                    <>Show Less <ChevronUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" /></>
                                                ) : (
                                                    <>Show {hiddenCount} More Signals <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" /></>
                                                )
                                                }
                                            </button>
                                        )}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}

                <SymbolDatalink
                    ticker={historyItem?.ticker ?? null}
                    name={historyItem?.name}
                    historyLogs={historyLogs}
                    historyLoading={historyLoading}
                    onClose={() => setHistoryItem(null)}
                    showAuditTrail={false}
                />
            </main>
        </AppLayout>
    );
}
