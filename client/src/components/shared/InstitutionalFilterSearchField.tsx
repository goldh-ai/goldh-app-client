import { memo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  institutionalFieldLabelClass,
  institutionalFilterInputClass,
} from "@/lib/institutionalDataChrome";
import { cn } from "@/lib/utils";

export type InstitutionalFilterSearchFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Taller control for mobile sheets. */
  comfortable?: boolean;
  className?: string;
};

/**
 * Label + search icon + input — matches Pulse / Portfolio institutional search styling.
 * Use in feature filter toolbars (Module 8+).
 */
function InstitutionalFilterSearchFieldInner({
  id,
  label,
  value,
  onChange,
  placeholder = "Search…",
  comfortable = false,
  className,
}: InstitutionalFilterSearchFieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className={institutionalFieldLabelClass}>
        {label}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id={id}
          type="search"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            institutionalFilterInputClass,
            "pl-10",
            comfortable && "h-12 text-sm",
          )}
        />
      </div>
    </div>
  );
}

export const InstitutionalFilterSearchField = memo(InstitutionalFilterSearchFieldInner);
