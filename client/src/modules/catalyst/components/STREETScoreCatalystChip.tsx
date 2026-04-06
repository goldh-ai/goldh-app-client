/**
 * STREETScore Catalyst Chip — Catalyst Cross-Module Integration
 *
 * Shown on EarningsEventRow for PRO+ users when the ticker has a
 * non-none STREETScore signal. Uses Catalyst-specific label mapping.
 *
 * Usage:
 *   <STREETScoreCatalystChip ticker="AAPL" tier="pro" />
 */

import { useSTREETScoreTicker } from '@/modules/streetscore/hooks/useSTREETScoreTicker';
import { SIGNAL_CATALYST_LABELS } from '@/modules/streetscore/types';
import type { StreetSignalState } from '@/modules/streetscore/types';

interface STREETScoreCatalystChipProps {
  ticker: string | undefined | null;
  tier: string | undefined;
}

const CHIP_STYLES: Record<StreetSignalState, string> = {
  strong_bullish: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  bullish_improving: 'bg-green-500/10 text-green-400 border-green-500/20',
  neutral_improving: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  weakening: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  strong_bearish: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  none: '',
};

export function STREETScoreCatalystChip({ ticker, tier }: STREETScoreCatalystChipProps) {
  const isPro = ['pro', 'elite', 'admin'].includes(tier ?? '');
  const { data } = useSTREETScoreTicker(isPro && ticker ? ticker : null);

  if (!isPro || !data || data.signalState === 'none') return null;

  const label = SIGNAL_CATALYST_LABELS[data.signalState as StreetSignalState];
  if (!label) return null;

  // strong_bearish is feature-flagged
  if (data.signalState === 'strong_bearish' && !import.meta.env.VITE_STREET_SHOW_BEARISH_CHIP) {
    return null;
  }

  const style = CHIP_STYLES[data.signalState as StreetSignalState];

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] uppercase font-bold tracking-widest ${style}`}>
      {label}
    </div>
  );
}
