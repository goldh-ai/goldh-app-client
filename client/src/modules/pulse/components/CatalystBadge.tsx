/**
 * Catalyst Badge — Pulse Cross-Module Trigger Indicator
 *
 * Shown on Pulse asset rows/cards when an active catalyst event
 * with cross_module_trigger=true exists whose asset_class_tags
 * overlap the asset's class. Uses live /api/events data.
 *
 * Usage:
 *   <CatalystBadge assetClass="crypto" />
 *   <CatalystBadge assetClass="equity" />
 */

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCatalystEvents } from "@/modules/catalyst/hooks/useCatalystEvents";
import type { CatalystEvent } from "@/modules/catalyst/types";

interface CatalystBadgeProps {
    assetClass: string;   // e.g. 'crypto', 'equity', 'forex', 'bond', 'commodity'
    className?: string;
}

function isActiveTrigger(event: CatalystEvent): boolean {
    if (!event.cross_module_trigger) return false;
    const now = new Date();
    const scheduled = new Date(event.scheduled_time);
    // Active window: within 24h before or after scheduled time
    const windowMs = 24 * 60 * 60 * 1000;
    return Math.abs(now.getTime() - scheduled.getTime()) <= windowMs;
}

export function CatalystBadge({ assetClass, className }: CatalystBadgeProps) {
    const { data } = useCatalystEvents({ upcoming: true });
    const events = data?.events ?? [];

    const matched = events.find(
        (e) =>
            isActiveTrigger(e) &&
            Array.isArray(e.asset_class_tags) &&
            e.asset_class_tags.includes(assetClass),
    );

    if (!matched) return null;

    const biasLabel = matched.bias ?? "Neutral";
    const biasColor =
        biasLabel === "Risk-On"
            ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5"
            : biasLabel === "Risk-Off"
                ? "text-rose-400 border-rose-400/20 bg-rose-400/5"
                : "text-amber-400 border-amber-400/20 bg-amber-400/5";

    const eventLabel =
        matched.event_type === "earnings"
            ? `${matched.ticker} Earnings`
            : matched.event_name;

    return (
        <div
            title={`Catalyst Active: ${eventLabel} · ${biasLabel}`}
            className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-widest",
                biasColor,
                className,
            )}
        >
            <Zap className="w-2.5 h-2.5" />
            Catalyst
        </div>
    );
}
