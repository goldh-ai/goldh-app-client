import { TrendingUp, Award, BarChart3 } from 'lucide-react';
import type { StreetUniverseEntry, StreetGrade } from '../types';

interface STREETScoreHeroProps {
  total: number;
  entries: StreetUniverseEntry[];
}

const GRADE_BG_DARK: Record<StreetGrade, string> = {
  A: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  B: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  C: 'bg-[#C7AE6A]/20 text-[#C7AE6A] border border-[#C7AE6A]/30',
  D: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  F: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
};

export function STREETScoreHero({ total, entries }: STREETScoreHeroProps) {
  const strongBullishCount = entries.filter(e => e.signalState === 'strong_bullish').length;
  const top3 = [...entries]
    .filter(e => e.streetScore != null)
    .sort((a, b) => (b.streetScore ?? 0) - (a.streetScore ?? 0))
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Universe count */}
      <div className="rounded-xl border border-[#222] bg-[#0a0a0a] p-5 flex items-start gap-4 hover:border-[#333] transition-colors">
        <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <BarChart3 className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Universe Coverage</p>
          <p className="text-2xl font-black text-white mt-0.5">{total}</p>
          <p className="text-[10px] text-gray-600 mt-0.5">tickers scored</p>
        </div>
      </div>

      {/* Strong bullish count */}
      <div className="rounded-xl border border-[#222] bg-[#0a0a0a] p-5 flex items-start gap-4 hover:border-emerald-500/20 transition-colors">
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Strong Street Signal</p>
          <p className="text-2xl font-black text-emerald-400 mt-0.5">{strongBullishCount}</p>
          <p className="text-[10px] text-gray-600 mt-0.5">strong bullish consensus</p>
        </div>
      </div>

      {/* Top 3 */}
      <div className="rounded-xl border border-[#222] bg-[#0a0a0a] p-5 hover:border-[#C7AE6A]/20 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <Award className="h-4 w-4 text-[#C7AE6A]" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Top Ranked</p>
        </div>
        <div className="space-y-2">
          {top3.map((entry, i) => (
            <div key={entry.ticker} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-600 w-4 font-bold">{i + 1}.</span>
                <span className="font-mono text-sm font-black text-white">{entry.ticker}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">{entry.streetScore?.toFixed(0)}</span>
                {entry.grade && (
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black ${GRADE_BG_DARK[entry.grade as StreetGrade]}`}>
                    {entry.grade}
                  </span>
                )}
              </div>
            </div>
          ))}
          {top3.length === 0 && (
            <p className="text-xs text-gray-600">No scores yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
