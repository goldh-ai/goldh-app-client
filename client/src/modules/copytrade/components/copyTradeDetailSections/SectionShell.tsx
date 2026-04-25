import type { ReactNode } from "react";

type SectionShellProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
};

export function SectionShell({
  title,
  subtitle,
  right,
  children,
}: SectionShellProps) {
  return (
    <section className="rounded-xl border border-border/80 bg-card/70 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-primary/90">
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
