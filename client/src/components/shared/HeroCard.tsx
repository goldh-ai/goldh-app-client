import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

export type HeroCardVariant = "informational" | "promotional" | "metric" | "interactive";

interface HeroAction {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
}

interface HeroCardProps {
    /** Prominent title for the card */
    title: string;
    /** Small eyebrow text or secondary headline */
    subtitle?: string;
    /** Body text for description or context */
    description?: string;
    /** Optional image URL to display in the background or side */
    image?: string;
    /** Alternative text for the image */
    imageAlt?: string;
    /** Data visualization for the 'metric' variant */
    metric?: {
        value: string | number;
        label: string;
        trend?: "up" | "down";
        trendValue?: string;
    };
    /** Main Call to Action */
    primaryAction?: HeroAction;
    /** Secondary subordinate action */
    secondaryAction?: HeroAction;
    /** Defines the layout and visual emphasis */
    variant?: HeroCardVariant;
    /** Show a dismiss button (X) at the top right */
    onDismiss?: () => void;
    /** Additional CSS classes */
    className?: string;
    /** If true, the card uses a larger, more cinematic layout (e.g. for page headers) */
    isPageLevel?: boolean;
    /** Custom icon to display alongside the title */
    icon?: React.ReactNode;
}

/**
 * HeroCard is a premium, reusable component for highlighting key metrics, 
 * promotions, or high-level information across the application.
 */
export function HeroCard({
    title,
    subtitle,
    description,
    image,
    imageAlt = "Hero illustration",
    metric,
    primaryAction,
    secondaryAction,
    variant = "informational",
    onDismiss,
    className,
    isPageLevel = false,
    icon,
}: HeroCardProps) {
    const isMetric = variant === "metric" && metric;
    const isPromotional = variant === "promotional" && image;

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] transition-all duration-300",
                "hover:border-white/20 hover:shadow-[0_0_40px_rgba(199,174,106,0.05)]",
                isPageLevel ? "p-8 sm:p-12 md:p-16" : "p-6 sm:p-8",
                className
            )}
        >
            {/* Ambient Background Gradient Glows */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#C7AE6A]/10 blur-[100px] pointer-events-none group-hover:bg-[#C7AE6A]/15 transition-colors duration-500" />
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

            {/* Background Image (Promotional variant) */}
            {isPromotional && (
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
                    <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
                </div>
            )}

            {/* Dismiss Button */}
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="absolute right-4 top-4 z-20 p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
                    aria-label="Dismiss"
                >
                    <X className="h-5 w-5" />
                </button>
            )}

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 h-full">
                <div className="flex-1 space-y-4">
                    {/* Eyebrow Label */}
                    {subtitle && (
                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="h-px w-6 bg-[#C7AE6A]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C7AE6A]">
                                {subtitle}
                            </span>
                        </div>
                    )}

                    {/* Title & Icon */}
                    <div className="flex items-center gap-4">
                        {icon && (
                            <div className="shrink-0 p-3 rounded-2xl bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 text-[#C7AE6A]">
                                {icon}
                            </div>
                        )}
                        <h2 className={cn(
                            "font-bold leading-tight tracking-tight text-white",
                            isPageLevel ? "text-3xl sm:text-4xl md:text-5xl" : "text-2xl sm:text-3xl"
                        )}>
                            {(() => {
                                const words = title.trim().split(" ");
                                if (words.length <= 1) return title;
                                const lastWord = words.pop();
                                return (
                                    <>
                                        {words.join(" ")}{" "}
                                        <span className="bg-gradient-to-r from-[#C7AE6A] to-[#E5D5A5] bg-clip-text text-transparent">
                                            {lastWord}
                                        </span>
                                    </>
                                );
                            })()}
                        </h2>
                    </div>

                    {/* Description */}
                    {description && (
                        <p className={cn(
                            "text-gray-400 max-w-2xl leading-relaxed",
                            isPageLevel ? "text-lg" : "text-sm"
                        )}>
                            {description}
                        </p>
                    )}

                    {/* Footer Actions (Desktop layout) */}
                    {(primaryAction || secondaryAction) && (
                        <div className="flex flex-wrap items-center gap-4 pt-4 md:hidden lg:flex">
                            {primaryAction && (
                                <Button
                                    onClick={primaryAction.onClick}
                                    className="h-11 px-8 rounded-xl bg-[#C7AE6A] hover:bg-[#D4BD7A] text-black font-bold border-none shadow-[0_0_20px_rgba(199,174,106,0.15)] transition-all duration-300"
                                >
                                    {primaryAction.icon && <span className="mr-2">{primaryAction.icon}</span>}
                                    {primaryAction.label}
                                </Button>
                            )}
                            {secondaryAction && (
                                <Button
                                    variant="ghost"
                                    onClick={secondaryAction.onClick}
                                    className="h-11 px-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all"
                                >
                                    {secondaryAction.label}
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side: Metric or Additional Visuals */}
                {isMetric && (
                    <div className="shrink-0 flex flex-col items-center md:items-end justify-center text-center md:text-right gap-2 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{metric.label}</span>
                            <div className="flex items-baseline gap-2">
                                <span className={cn(
                                    "font-black tracking-tighter text-white",
                                    isPageLevel ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl"
                                )}>
                                    {metric.value}
                                </span>
                                {metric.trend && (
                                    <div className={cn(
                                        "flex items-center gap-0.5 text-sm font-black rounded-lg px-2 py-1",
                                        metric.trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                    )}>
                                        {metric.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                        {metric.trendValue && <span>{metric.trendValue}</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Footer Actions (Bottom positioned when md is hidden) */}
                {(primaryAction || secondaryAction) && (
                    <div className="flex flex-col gap-3 md:flex-row md:hidden">
                        {primaryAction && (
                            <Button
                                onClick={primaryAction.onClick}
                                className="h-11 px-8 rounded-xl bg-[#C7AE6A] hover:bg-white/10 text-black font-bold transition-all"
                            >
                                {primaryAction.label}
                            </Button>
                        )}
                        {secondaryAction && (
                            <Button
                                variant="outline"
                                onClick={secondaryAction.onClick}
                                className="h-11 px-8 rounded-xl border border-white/10 bg-white/5 text-white font-bold transition-all"
                            >
                                {secondaryAction.label}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Subtle decorative border glow at the bottom */}
            <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#C7AE6A]/50 to-transparent opacity-30" />
        </div>
    );
}
