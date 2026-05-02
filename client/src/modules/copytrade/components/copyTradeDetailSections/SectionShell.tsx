import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionShellProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  /** `card` — default bordered card. `soft` — lighter frame for secondary strips. */
  variant?: "card" | "soft";
};

const SECTION_VARIANT: Record<NonNullable<SectionShellProps["variant"]>, string> = {
  card: "rounded-xl border border-border/80 bg-card/70 p-3",
  soft: "rounded-2xl border border-border/45 bg-gradient-to-br from-muted/15 to-card/40 p-4 shadow-sm",
};

export function SectionShell({
  title,
  subtitle,
  right,
  children,
  variant = "card",
}: SectionShellProps) {
  return (
    <section className={cn(SECTION_VARIANT[variant])}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-primary/95">
            {title}
          </h4>
          {subtitle ? (
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
        {right}
      </div>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}
