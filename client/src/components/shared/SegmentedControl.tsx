import React from "react";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  label: string;
  icon?: React.ElementType;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  activeClassName?: string;
}

/**
 * SegmentedControl - A premium toggle switcher for mutually exclusive options.
 * Matches the GOLDH "Perspective Switcher" aesthetic.
 */
export function SegmentedControl({
  options,
  value,
  onChange,
  className,
  activeClassName,
}: SegmentedControlProps) {
  return (
    <div className={cn(
      "flex p-0.5 bg-[#050505] border border-[#1a1a1a] rounded-xl shadow-inner",
      className
    )}>
      {options.map((option) => {
        const isActive = value === option.id;
        const Icon = option.icon;

        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300",
              isActive
                ? cn("bg-[#C7AE6A] text-black shadow-[0_0_15px_rgba(199,174,106,0.3)]", activeClassName)
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
            aria-pressed={isActive}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
