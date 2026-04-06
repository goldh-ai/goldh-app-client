/**
 * STREETScore Chip — Pulse Cross-Module Integration
 *
 * Shown on Pulse equity/ETF asset rows for PRO+ users when the ticker
 * has a non-none STREETScore signal. Uses /api/score/:ticker.
 *
 * Usage:
 *   <STREETScoreChip ticker="AAPL" assetClass="equity" tier="pro" />
 */

import { SignalChip } from '@/modules/streetscore/components/SignalChip';
import { useSTREETScoreTicker } from '@/modules/streetscore/hooks/useSTREETScoreTicker';

interface STREETScoreChipProps {
  ticker: string;
  assetClass: string;
  tier: string | undefined;
  className?: string;
}

const EQUITY_CLASSES = ['equity', 'etf'];

export function STREETScoreChip({ ticker, assetClass, tier, className }: STREETScoreChipProps) {
  const isPro = ['pro', 'elite', 'admin'].includes(tier ?? '');
  const isEquity = EQUITY_CLASSES.includes(assetClass?.toLowerCase() ?? '');

  const { data } = useSTREETScoreTicker(isPro && isEquity ? ticker : null);

  if (!isPro || !isEquity || !data || data.signalState === 'none') return null;

  return <SignalChip signal={data.signalState} size="sm" />;
}
