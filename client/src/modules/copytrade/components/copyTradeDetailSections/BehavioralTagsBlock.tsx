import { cn } from "@/lib/utils";
import { getCopyTradeProfileVisual } from "../../lib/copyTradeBadges";
import type { CopyTradeTraderDetail } from "../../lib/copyTradeDetail";

type BehavioralTagsBlockProps = {
  detail: CopyTradeTraderDetail;
  fillHeight?: boolean;
};

export function BehavioralTagsBlock({ detail, fillHeight = false }: BehavioralTagsBlockProps) {
  const profile = getCopyTradeProfileVisual(detail.profileTag);
  const tags = (detail.behavioralTags ?? [])
    .map((t) => String(t).trim())
    .filter((t) => t.length > 0)
    .slice(0, 12);

  return (
    <div className={cn("flex flex-col gap-2.5", fillHeight && "min-h-0 flex-1")}>
      <div
        className={cn(
          "rounded-xl bg-muted/10 px-3 py-3 ring-1 ring-inset ring-border/30",
          fillHeight &&
          "flex min-h-[7rem] flex-1 flex-col justify-center py-4 sm:min-h-[6.75rem]",
        )}
      >
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Profile type
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          {profile.icon} {profile.label}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {profile.description}
        </p>
      </div>
      {tags.length > 0 ? (
        <div className={cn("shrink-0", fillHeight && "pt-1")}>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Behavioral tags
          </p>
          <ul
            className={cn(
              "mt-2 flex list-none flex-wrap gap-x-1.5 gap-y-2 rounded-lg bg-muted/[0.08] p-2.5 ring-1 ring-inset ring-border/25",
              fillHeight && "max-h-[min(40vh,14rem)] overflow-y-auto overscroll-y-contain",
            )}
            aria-label="Behavioral tags"
          >
            {tags.map((tag, index) => (
              <li key={`${tag}-${index}`} className="min-w-0 max-w-full">
                <span
                  title={tag}
                  className="inline-flex max-w-full cursor-default break-words rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-primary hyphens-auto"
                >
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={cn("text-xs text-muted-foreground", fillHeight && "shrink-0 pt-1")}>
          No behavioral tags info available yet.
        </p>
      )}
    </div>
  );
}
