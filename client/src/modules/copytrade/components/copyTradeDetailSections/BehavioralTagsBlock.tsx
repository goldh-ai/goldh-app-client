import { getCopyTradeProfileVisual } from "../../lib/copyTradeBadges";
import type { CopyTradeTraderDetail } from "../../lib/copyTradeDetail";

type BehavioralTagsBlockProps = {
  detail: CopyTradeTraderDetail;
};

export function BehavioralTagsBlock({ detail }: BehavioralTagsBlockProps) {
  const profile = getCopyTradeProfileVisual(detail.profileTag);
  const tags = detail.behavioralTags ?? [];

  return (
    <div className="space-y-2.5">
      <div className="rounded-lg border border-border bg-card px-3 py-2.5">
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
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Behavioral tags are not available yet.
        </p>
      )}
    </div>
  );
}
