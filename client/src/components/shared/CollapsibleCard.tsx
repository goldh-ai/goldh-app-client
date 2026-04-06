import React, { useState, useEffect, useContext, createContext } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Expand/Collapse All Context ───────────────────────────────────────────────
// This allows a parent (like WikiPage) to force all cards open/closed at once.

type ExpandContextValue = { forceOpen: boolean | null };
export const ExpandContext = createContext<ExpandContextValue>({ forceOpen: null });

export function ExpandProvider({
  forceOpen,
  children,
}: {
  forceOpen: boolean | null;
  children: React.ReactNode;
}) {
  return (
    <ExpandContext.Provider value={{ forceOpen }}>
      {children}
    </ExpandContext.Provider>
  );
}

// ── CollapsibleCard ───────────────────────────────────────────────────────────

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
}

/**
 * CollapsibleCard - A premium collapsible container for content sections.
 * Supports a global ExpandContext for bulk actions.
 */
export function CollapsibleCard({
  title,
  children,
  defaultOpen = false,
  className,
  headerClassName,
}: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { forceOpen } = useContext(ExpandContext);

  useEffect(() => {
    if (forceOpen !== null) setIsOpen(forceOpen);
  }, [forceOpen]);

  return (
    <div className={cn(
      "border border-[#1a1a1a] rounded-xl mb-4 overflow-hidden bg-[#0a0a0a]/30 backdrop-blur-sm transition-all duration-300",
      className
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/10 transition-colors text-left group",
          headerClassName
        )}
      >
        <span className="font-bold text-sm tracking-wide text-white group-hover:text-[#C7AE6A] transition-colors">
          {title}
        </span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#C7AE6A] transition-colors" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C7AE6A] transition-colors" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
}
