import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    /** Eyebrow label above the title (e.g. "Protocol Diagnostics") */
    label?: string;
    /** Main page heading (H1) */
    title: string;
    /** Short subtitle / description — sentence case, one line */
    description?: string;
    /** Optional icon rendered beside the title */
    icon?: React.ReactNode;
    /** Action buttons slot (top right) */
    actions?: React.ReactNode;
    className?: string;
}

/**
 * Standardized page header used across the application.
 *
 * Enforces a consistent typographic scale:
 * - Eyebrow:    text-[10px] font-black uppercase tracking-[0.3em] text-[#C7AE6A]
 * - Title (H1): text-2xl sm:text-3xl font-bold text-white
 * - Subtitle:   text-sm text-gray-400  (sentence case, no uppercase)
 */
export function PageHeader({
    label,
    title,
    description,
    icon,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 relative",
                className
            )}
        >
            {/* Ambient glow */}
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#C7AE6A]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Left: title block */}
            <div className="relative z-10 flex-1 min-w-0">
                {label && (
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-px w-6 bg-[#C7AE6A] shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C7AE6A]">
                            {label}
                        </span>
                    </div>
                )}

                <h1 className="flex items-center gap-3 text-2xl sm:text-3xl font-bold leading-tight">
                    {icon && (
                        <span className="text-[#C7AE6A] shrink-0">{icon}</span>
                    )}
                    {(() => {
                        const words = title.trim().split(" ");
                        if (words.length === 1) {
                            return <span className="text-white">{title}</span>;
                        }
                        const firstPart = words.slice(0, -1).join(" ");
                        const lastWord = words[words.length - 1];
                        return (
                            <>
                                <span className="text-white">{firstPart}</span>
                                {" "}
                                <span className="bg-gradient-to-r from-[#C7AE6A] to-[#E5D5A5] bg-clip-text text-transparent">
                                    {lastWord}
                                </span>
                            </>
                        );
                    })()}
                </h1>

                {description && (
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed max-w-2xl truncate">
                        {description}
                    </p>
                )}
            </div>

            {/* Right: actions slot */}
            {actions && (
                <div className="relative z-10 flex items-center gap-3 w-full md:w-auto shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
}
