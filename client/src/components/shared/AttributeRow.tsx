import React from "react";
import { cn } from "@/lib/utils";

interface AttributeRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

/**
 * AttributeRow - A standard key-value pair for definitions or metadata.
 * Prominently highlights the label in GOLDH Gold.
 */
export function AttributeRow({
  label,
  value,
  className,
  labelClassName,
}: AttributeRowProps) {
  return (
    <div className={cn("flex flex-col md:flex-row gap-2 md:gap-4 py-1 group", className)}>
      <span className={cn(
        "shrink-0 font-black text-[10px] uppercase tracking-[0.2em] text-[#C7AE6A]/90 md:w-48 pt-0.5",
        labelClassName
      )}>
        {label}
      </span>
      <div className="text-sm text-gray-300 leading-relaxed font-medium">
        {value}
      </div>
    </div>
  );
}
