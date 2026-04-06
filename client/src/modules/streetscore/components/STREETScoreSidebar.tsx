/**
 * STREETScore Sidebar — Guru Talk Cross-Module Integration
 *
 * Mini score card shown inline on Guru Talk insight cards for equity symbols.
 * Displays ticker, score, grade, confidence band, trend, and signal chip.
 * Only shown for PRO+ users with equity/stock asset class.
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useSTREETScoreTicker } from '../hooks/useSTREETScoreTicker';
import { SignalChip } from './SignalChip';
import { GRADE_BG_COLORS } from '../types';
import type { StreetGrade } from '../types';

interface STREETScoreSidebarProps {
  ticker: string | undefined | null;
  tier: string | undefined;
  assetClass?: string | null;
}

const EQUITY_CLASSES = ['equity', 'stock', 'etf', 'Equity', 'Stock', 'ETF'];

function TrendArrow({ trend }: { trend: string | null | undefined }) {
  if (trend === 'up') return <TrendingUp className="h-3 w-3 text-emerald-500" />;
  if (trend === 'down') return <TrendingDown className="h-3 w-3 text-rose-500" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}

export function STREETScoreSidebar({ ticker, tier, assetClass }: STREETScoreSidebarProps) {
  const isPro = ['pro', 'elite', 'admin'].includes(tier ?? '');
  const isEquity = EQUITY_CLASSES.some(c => c.toLowerCase() === (assetClass ?? '').toLowerCase());

  const { data } = useSTREETScoreTicker(isPro && isEquity && ticker ? ticker : null);

  if (!isPro || !isEquity || !data || data.streetScore == null) return null;

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md border bg-muted/10 text-xs">
      <span className="font-mono font-bold text-xs">{ticker}</span>
      <span className="font-bold">{data.streetScore.toFixed(0)}</span>
      {data.grade && (
        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${GRADE_BG_COLORS[data.grade as StreetGrade]}`}>
          {data.grade}
        </span>
      )}
      {data.confidenceBand && (
        <span className="text-muted-foreground text-[10px]">{data.confidenceBand}</span>
      )}
      <TrendArrow trend={data.trend7d} />
      {data.delta7d != null && (
        <span className={`text-[10px] ${data.delta7d >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {data.delta7d >= 0 ? '+' : ''}{data.delta7d.toFixed(1)}
        </span>
      )}
      {data.signalState !== 'none' && (
        <SignalChip signal={data.signalState} size="sm" />
      )}
    </div>
  );
}
