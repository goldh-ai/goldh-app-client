import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
    ShieldCheck,
    History,
    Clock,
    FileText,
    Calendar,
    ChevronRight,
    BookOpen
} from "lucide-react";
import { PortfolioHistory } from "@shared/types";
import { apiUrl, getSessionAuthHeaders } from "@/lib/queryClient";

interface SymbolDatalinkProps {
    ticker: string | null;
    name?: string;
    historyLogs: PortfolioHistory[];
    historyLoading: boolean;
    onClose: () => void;
    /** If true, show the Audit Trail tab (admin only) */
    showAuditTrail?: boolean;
}

export function SymbolDatalink({
    ticker,
    name,
    historyLogs,
    historyLoading,
    onClose,
    showAuditTrail = false,
}: SymbolDatalinkProps) {
    const [activeTab, setActiveTab] = useState<"insights" | "audit">("insights");
    const [contentInsights, setContentInsights] = useState<any[]>([]);
    const [contentLoading, setContentLoading] = useState(false);

    // Fetch CIO Insights whenever ticker changes
    useEffect(() => {
        if (!ticker) {
            setContentInsights([]);
            return;
        }

        setActiveTab("insights");
        setContentLoading(true);
        fetch(apiUrl(`/api/content/by-symbol/${ticker}`), {
            headers: getSessionAuthHeaders(),
            credentials: "include",
        })
            .then(res => res.ok ? res.json() : [])
            .then(data => setContentInsights(data))
            .catch(() => setContentInsights([]))
            .finally(() => setContentLoading(false));
    }, [ticker]);

    return (
        <Sheet open={!!ticker} onOpenChange={(open) => { if (!open) onClose(); }}>
            <SheetContent side="right" className="bg-[#0a0a0a] border-l border-[#222] text-white shadow-2xl sm:max-w-md md:max-w-lg w-full p-0 flex flex-col gap-0 border-y-0 border-r-0">
                {/* Header */}
                <SheetHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-[#222] bg-gradient-to-b from-[#111] to-[#0a0a0a] text-left shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-[#C7AE6A]/15 to-[#C7AE6A]/5 rounded-xl border border-[#C7AE6A]/15 shrink-0">
                            <BookOpen className="h-4 w-4 text-[#C7AE6A]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <SheetTitle className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                                <span className="text-[#C7AE6A]">{ticker}</span>
                                {name && (
                                    <span className="text-xs text-gray-500 font-normal truncate hidden sm:inline">| {name}</span>
                                )}
                            </SheetTitle>
                            <SheetDescription className="text-gray-600 text-[11px] font-medium mt-0.5">
                                CIO research insights & investment thesis trail
                            </SheetDescription>
                        </div>
                        {contentInsights.length > 0 && (
                            <div className="shrink-0 bg-[#C7AE6A]/10 border border-[#C7AE6A]/15 rounded-lg px-2.5 py-1">
                                <span className="text-[10px] font-black text-[#C7AE6A] tabular-nums">{contentInsights.length}</span>
                            </div>
                        )}
                    </div>
                </SheetHeader>

                {/* Tab Switcher — only show if audit trail is enabled */}
                {showAuditTrail && (
                    <div className="flex border-b border-[#1a1a1a]">
                        <button
                            onClick={() => setActiveTab("insights")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === "insights"
                                ? "text-[#C7AE6A] border-b-2 border-[#C7AE6A] bg-[#C7AE6A]/5"
                                : "text-gray-600 hover:text-gray-400"
                                }`}
                        >
                            <FileText className="h-3 w-3" />
                            CIO Insights
                        </button>
                        <button
                            onClick={() => setActiveTab("audit")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === "audit"
                                ? "text-[#C7AE6A] border-b-2 border-[#C7AE6A] bg-[#C7AE6A]/5"
                                : "text-gray-600 hover:text-gray-400"
                                }`}
                        >
                            <History className="h-3 w-3" />
                            Audit Trail
                        </button>
                    </div>
                )}

                {/* Content Area */}
                <div className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto custom-scrollbar">
                    {/* CIO Insights Tab */}
                    {activeTab === "insights" && (
                        <div className="p-3 sm:p-5">
                            {contentLoading ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <div className="w-8 h-8 border-2 border-[#C7AE6A]/20 border-t-[#C7AE6A] rounded-full animate-spin" />
                                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Loading Insights</span>
                                </div>
                            ) : contentInsights.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <div className="p-5 bg-gradient-to-br from-[#111] to-[#0d0d0d] rounded-2xl border border-[#1a1a1a]">
                                        <FileText className="h-8 w-8 text-gray-700" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-500 text-sm font-semibold">No CIO insights for {ticker}</p>
                                        <p className="text-gray-700 text-xs mt-1">Upload a brief mentioning this symbol to populate insights.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {contentInsights.map((insight, idx) => (
                                        <div
                                            key={insight.id || idx}
                                            className="rounded-xl overflow-hidden border border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#C7AE6A]/20 transition-all duration-300 group"
                                        >
                                            {/* Brief header bar */}
                                            <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#141414] to-[#111] border-b border-[#1a1a1a]/50">
                                                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                                                    <div className="flex items-center gap-1.5 text-[#C7AE6A] shrink-0">
                                                        <Calendar className="h-3 w-3" />
                                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em]">
                                                            {new Date(insight.uploaded_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <Badge variant="outline" className="text-[7px] h-3.5 px-1.5 border-[#C7AE6A]/15 text-[#C7AE6A]/60 uppercase font-black tracking-widest shrink-0 bg-[#C7AE6A]/5">
                                                        {insight.type}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Brief title */}
                                            <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#0d0d0d]">
                                                <div className="flex items-start gap-2">
                                                    <ChevronRight className="h-3.5 w-3.5 text-[#C7AE6A]/40 shrink-0 mt-0.5 group-hover:text-[#C7AE6A]/70 group-hover:translate-x-0.5 transition-all" />
                                                    <h4 className="text-xs sm:text-[13px] font-bold text-gray-200 leading-snug">{insight.display_name}</h4>
                                                </div>
                                            </div>

                                            {/* Section content */}
                                            {insight.sections.length > 0 ? (
                                                <div className="border-t border-[#1a1a1a]/30">
                                                    {insight.sections.map((section: any, sIdx: number) => (
                                                        <div
                                                            key={section.section_id || sIdx}
                                                            className="px-3 sm:px-5 py-3 sm:py-4 cio-content text-xs sm:text-[13px] max-w-none break-words overflow-hidden"
                                                            dangerouslySetInnerHTML={{ __html: section.html_segment }}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="px-3 sm:px-5 py-3 sm:py-4 text-[11px] text-gray-600 italic border-t border-[#1a1a1a]/30">
                                                    Symbol referenced — no dedicated section extracted.
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Audit Trail Tab */}
                    {activeTab === "audit" && showAuditTrail && (
                        <div className="p-3 sm:p-6">
                            {historyLoading ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <div className="w-8 h-8 border-2 border-[#C7AE6A]/20 border-t-[#C7AE6A] rounded-full animate-spin" />
                                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Syncing Provenance</span>
                                </div>
                            ) : historyLogs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <div className="p-4 bg-[#111] rounded-2xl border border-[#1a1a1a]">
                                        <ShieldCheck className="h-8 w-8 text-gray-700" />
                                    </div>
                                    <p className="text-gray-600 text-sm">No historical adjustments recorded.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {historyLogs.map(log => (
                                        <div key={log.id} className="relative pl-6 sm:pl-7 border-l-2 border-[#C7AE6A]/15 py-1.5 group">
                                            <div className="absolute -left-[7px] top-3 w-3 h-3 rounded-full bg-[#0a0a0a] border-2 border-[#C7AE6A]/25 group-hover:border-[#C7AE6A] transition-colors" />
                                            <div className="flex flex-wrap justify-between items-center gap-2 mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                                        v{log.versionNumber}
                                                    </span>
                                                    <Badge variant="outline" className="text-[7px] h-3.5 px-1.5 border-emerald-500/15 text-emerald-500/70 font-bold">
                                                        VERIFIED
                                                    </Badge>
                                                </div>
                                                <div className="text-[10px] font-mono text-gray-700 flex items-center gap-1">
                                                    <Clock className="h-2.5 w-2.5" />
                                                    {new Date(log.changedAt_utc).toLocaleString()}
                                                </div>
                                            </div>
                                            <p className="text-xs sm:text-[13px] text-gray-300 font-medium leading-relaxed bg-[#111] p-3 rounded-lg border border-[#222]">
                                                {log.changeType}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 text-center border-t border-[#1a1a1a] bg-[#111]/50">
                    <p className="text-[7px] sm:text-[8px] text-gray-700 font-black uppercase tracking-[0.3em]">
                        {activeTab === "insights" ? "CIO Research • Content Engine" : "Institutional Grade Audit Trail • Non-Repudiable"}
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
