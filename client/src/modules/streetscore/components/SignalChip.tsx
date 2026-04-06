import type { StreetSignalState } from '../types';

const SIGNAL_CONFIG: Record<StreetSignalState, { label: string; className: string }> = {
  strong_bullish: { label: 'Strong Street', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  bullish_improving: { label: 'Street warming up', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  neutral_improving: { label: 'Street warming up', className: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  weakening: { label: 'Street cooling', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  strong_bearish: { label: 'Street bearish', className: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  none: { label: '', className: '' },
};

interface SignalChipProps {
  signal: StreetSignalState;
  size?: 'sm' | 'md';
}

export function SignalChip({ signal, size = 'sm' }: SignalChipProps) {
  const config = SIGNAL_CONFIG[signal];
  if (!config.label) return null;

  // strong_bearish is feature-flagged
  if (signal === 'strong_bearish' && !import.meta.env.VITE_STREET_SHOW_BEARISH_CHIP) {
    return null;
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full border font-bold uppercase tracking-wider ${sizeClass} ${config.className}`}>
      {config.label}
    </span>
  );
}
