import { AlertTriangle } from 'lucide-react';
import { useLocation } from 'wouter';

interface TierBannerProps {
  tier: string;
}

export default function TierBanner({ tier }: TierBannerProps) {
  const [, setLocation] = useLocation();

  if (tier !== 'free') return null;

  return (
    <div
      role="alert"
      className="flex items-center gap-2 px-4 py-2.5 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-sm"
    >
      <AlertTriangle size={14} className="shrink-0" aria-hidden="true" />
      <span>
        You are viewing delayed data.{' '}
        <button
          onClick={() => setLocation('/pricing')}
          className="underline underline-offset-2 hover:text-amber-300 transition-colors cursor-pointer font-medium"
        >
          Upgrade to Essentials
        </button>{' '}
        for live refresh.
      </span>
    </div>
  );
}
