import React from "react";
import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ElementType;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  homeUrl?: string;
}

/**
 * Breadcrumbs - Standardized navigation hierarchy indicator.
 * Supports icons, wouter Links, and custom callbacks.
 */
export function Breadcrumbs({
  items,
  className,
  homeUrl = "/admin"
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500", className)}
    >
      {/* Home link is often implicitly the first item or separate */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <ChevronRight className="w-3 h-3 text-gray-700 shrink-0 mx-0.5" />
            )}
            
            <div className="flex items-center gap-2">
              {Icon && <Icon className={cn("w-3 h-3 shrink-0", isLast ? "text-white" : "text-[#C7AE6A]/70")} />}
              
              {isLast ? (
                <span className="text-white font-black" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link href={item.href}>
                  <span className="hover:text-[#C7AE6A] transition-colors cursor-pointer">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span
                  className="hover:text-[#C7AE6A] transition-colors cursor-pointer"
                  onClick={item.onClick}
                >
                  {item.label}
                </span>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
