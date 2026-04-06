import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterBarProps {
  sector: string;
  grade: string;
  signalState: string;
  confidenceBand: string;
  sortBy: string;
  onSectorChange: (v: string) => void;
  onGradeChange: (v: string) => void;
  onSignalChange: (v: string) => void;
  onConfidenceChange: (v: string) => void;
  onSortChange: (v: string) => void;
}

const SECTORS = [
  'Technology', 'Healthcare', 'Financials', 'Consumer Discretionary',
  'Communication Services', 'Industrials', 'Consumer Staples', 'Energy',
  'Utilities', 'Real Estate', 'Materials',
];

const selectClass = "h-11 text-xs bg-[#0a0a0a] border-[#333] text-white hover:border-[#C7AE6A]/40 focus:border-[#C7AE6A]/60";
const contentClass = "bg-[#141414] border-[#333] text-white";

export function FilterBar({
  sector, grade, signalState, confidenceBand, sortBy,
  onSectorChange, onGradeChange, onSignalChange, onConfidenceChange, onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 py-3">
      <Select value={sector || 'all'} onValueChange={v => onSectorChange(v === 'all' ? '' : v)}>
        <SelectTrigger className={`w-44 ${selectClass}`}>
          <SelectValue placeholder="All Sectors" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          <SelectItem value="all">All Sectors</SelectItem>
          {SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={grade || 'all'} onValueChange={v => onGradeChange(v === 'all' ? '' : v)}>
        <SelectTrigger className={`w-28 ${selectClass}`}>
          <SelectValue placeholder="All Grades" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          <SelectItem value="all">All Grades</SelectItem>
          {['A', 'B', 'C', 'D', 'F'].map(g => <SelectItem key={g} value={g}>Grade {g}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={signalState || 'all'} onValueChange={v => onSignalChange(v === 'all' ? '' : v)}>
        <SelectTrigger className={`w-44 ${selectClass}`}>
          <SelectValue placeholder="All Signals" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          <SelectItem value="all">All Signals</SelectItem>
          <SelectItem value="strong_bullish">Strong Street</SelectItem>
          <SelectItem value="bullish_improving">Street warming up</SelectItem>
          <SelectItem value="neutral_improving">Neutral improving</SelectItem>
          <SelectItem value="weakening">Street cooling</SelectItem>
          <SelectItem value="none">No signal</SelectItem>
        </SelectContent>
      </Select>

      <Select value={confidenceBand || 'all'} onValueChange={v => onConfidenceChange(v === 'all' ? '' : v)}>
        <SelectTrigger className={`w-32 ${selectClass}`}>
          <SelectValue placeholder="All Confidence" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          <SelectItem value="all">All Confidence</SelectItem>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy || 'score_desc'} onValueChange={onSortChange}>
        <SelectTrigger className={`w-40 ${selectClass}`}>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          <SelectItem value="score_desc">Score ↓</SelectItem>
          <SelectItem value="score_asc">Score ↑</SelectItem>
          <SelectItem value="delta7d_desc">7d Change ↓</SelectItem>
          <SelectItem value="delta7d_asc">7d Change ↑</SelectItem>
          <SelectItem value="target_delta_desc">Target Upside ↓</SelectItem>
          <SelectItem value="momentum_desc">Momentum ↓</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
