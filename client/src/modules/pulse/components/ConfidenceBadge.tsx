import { Badge } from '@/components/ui/badge';

interface ConfidenceBadgeProps {
  confidenceScore: number;
  confidenceBadge: 'green' | 'amber' | 'red';
}

export const BADGE_CONFIG = {
  green: {
    label: 'High Confidence',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25',
  },
  amber: {
    label: 'Medium Confidence',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25',
  },
  red: {
    label: 'Low Confidence',
    className: 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25',
  },
} as const;

export default function ConfidenceBadge({ confidenceScore, confidenceBadge }: ConfidenceBadgeProps) {
  const { label, className } = BADGE_CONFIG[confidenceBadge];

  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium border ${className}`}
      aria-label={`Confidence level: ${label} (${confidenceScore}%)`}
    >
      {label}
    </Badge>
  );
}
