import { SignalChip } from './SignalChip';
import { GRADE_BG_COLORS } from '../types';
import type { StreetUniverseEntry, StreetGrade } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScoreRowProps {
  entry: StreetUniverseEntry;
}

const GRADE_LEFT_BORDER: Record<StreetGrade, string> = {
  A: 'border-l-emerald-500',
  B: 'border-l-blue-500',
  C: 'border-l-[#C7AE6A]',
  D: 'border-l-orange-500',
  F: 'border-l-rose-500',
};

const GRADE_BG_DARK: Record<StreetGrade, string> = {
  A: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  B: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  C: 'bg-[#C7AE6A]/20 text-[#C7AE6A] border border-[#C7AE6A]/30',
  D: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  F: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
};

function TrendIcon({ trend }: { trend: string | null }) {
  if (trend === 'up') return <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />;
  if (trend === 'down') return <TrendingDown className="h-3.5 w-3.5 text-rose-400" />;
  return <Minus className="h-3.5 w-3.5 text-gray-600" />;
}

export function ScoreRow({ entry }: ScoreRowProps) {
  const borderClass = entry.grade ? GRADE_LEFT_BORDER[entry.grade as StreetGrade] : 'border-l-[#333]';

  return (
    <div className={`group relative flex flex-col md:flex-row md:items-center gap-2 md:gap-4 px-3 py-3 md:py-2.5 border-b border-b-[#1a1a1a] border-l-4 hover:bg-white/[0.02] transition-colors ${borderClass}`}>
      {/* Ticker + Company - Primary Identity */}
      <div className="flex items-center justify-between md:w-28 md:shrink-0">
        <div>
          <span className="font-mono font-black text-sm text-white">{entry.ticker}</span>
          <p className="text-[10px] text-gray-600 truncate md:max-w-[100px]">{entry.company_name ?? entry.companyName}</p>
        </div>
        {/* Mobile-only Signal chip alignment */}
        <div className="md:hidden">
          <SignalChip signal={entry.signalState} />
        </div>
      </div>

      <div className="flex items-center justify-between flex-1 gap-4">
        {/* Score & Grade Group */}
        <div className="flex items-center gap-4">
          <div className="w-12 md:w-16 text-center">
            {entry.streetScore != null ? (
              <span className="text-base font-black text-white">{entry.streetScore.toFixed(0)}</span>
            ) : (
              <span className="text-gray-600 text-sm">—</span>
            )}
            <div className="md:hidden text-[8px] font-black uppercase text-gray-500">Score</div>
          </div>

          <div className="w-10 text-center">
            {entry.grade ? (
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black ${GRADE_BG_DARK[entry.grade as StreetGrade]}`}>
                {entry.grade}
              </span>
            ) : <span className="text-gray-600">—</span>}
            <div className="md:hidden text-[8px] font-black uppercase text-gray-500">Grade</div>
          </div>
        </div>

        {/* Signal chip - Desktop Only */}
        <div className="hidden md:block flex-1">
          <SignalChip signal={entry.signalState} />
        </div>

        {/* Target delta */}
        <div className="w-20 text-right">
          {entry.targetDeltaPct != null ? (
            <span className={`font-mono font-bold text-xs ${entry.targetDeltaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {entry.targetDeltaPct >= 0 ? '+' : ''}{entry.targetDeltaPct.toFixed(1)}%
            </span>
          ) : <span className="text-gray-600">—</span>}
          <div className="md:hidden text-[8px] font-black uppercase text-gray-500">Target</div>
        </div>

        {/* 7d trend */}
        <div className="w-12 flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-1">
          <div className="flex items-center gap-1">
            <TrendIcon trend={entry.trend7d} />
            {entry.delta7d != null && (
              <span className={`text-[10px] font-mono ${entry.delta7d >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {entry.delta7d >= 0 ? '+' : ''}{entry.delta7d.toFixed(1)}
              </span>
            )}
          </div>
          <div className="md:hidden text-[8px] font-black uppercase text-gray-500">7d</div>
        </div>
      </div>
    </div>
  );
}
