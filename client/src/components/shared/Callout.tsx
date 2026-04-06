import React from "react";
import { Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  children: React.ReactNode;
  variant?: "gold" | "blue" | "green" | "red";
  title?: string;
  className?: string;
}

/**
 * Callout - A highlighted box for important informational callouts.
 * Uses the GOLDH premium aesthetic with subtle backgrounds and strong borders.
 */
export function Callout({
  children,
  variant = "gold",
  title,
  className,
}: CalloutProps) {
  const styles = {
    gold: {
      container: "bg-[#C7AE6A]/5 border-[#C7AE6A]/20 text-gray-200",
      icon: "text-[#C7AE6A]",
      iconComponent: Info
    },
    blue: {
      container: "bg-blue-500/5 border-blue-500/20 text-blue-100",
      icon: "text-blue-400",
      iconComponent: Info
    },
    green: {
      container: "bg-emerald-500/5 border-emerald-500/20 text-emerald-100",
      icon: "text-emerald-400",
      iconComponent: CheckCircle2
    },
    red: {
      container: "bg-rose-500/5 border-rose-500/20 text-rose-100",
      icon: "text-rose-400",
      iconComponent: AlertCircle
    }
  };

  const current = styles[variant];
  const Icon = current.iconComponent;

  return (
    <div className={cn(
      "border rounded-xl px-4 py-4 text-[13px] leading-relaxed flex flex-col gap-2 my-6 transition-all hover:bg-white/5",
      current.container,
      className
    )}>
      <div className="flex items-center gap-3">
        <Icon className={cn("w-5 h-5 shrink-0 opacity-80", current.icon)} />
        {title && (
          <span className="font-bold text-sm tracking-wide text-white">
            {title}
          </span>
        )}
      </div>
      <div className="font-medium pl-8">
        {children}
      </div>
    </div>
  );
}
