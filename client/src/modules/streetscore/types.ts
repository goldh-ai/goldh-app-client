/**
 * STREETScore Client Types
 */

export type StreetGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export type StreetSignalState =
  | 'strong_bullish'
  | 'bullish_improving'
  | 'neutral_improving'
  | 'weakening'
  | 'strong_bearish'
  | 'none';

export type StreetConfidenceBand = 'High' | 'Medium' | 'Low';

export interface StreetScoreEvent {
  ticker: string;
  streetScore: number | null;
  grade: StreetGrade | null;
  confidenceBand: StreetConfidenceBand | null;
  signalState: StreetSignalState;
  ratingStrength: number | null;
  targetDeltaScore: number | null;
  coverageScore: number | null;
  momentumScore: number | null;
  recencyScore: number | null;
  consensusRating: string | null;
  priceTarget: number | null;
  targetDeltaPct: number | null;
  currentPriceUsd: number | null;
  analystCount: number | null;
  upgradeCount90d: number | null;
  downgradeCount90d: number | null;
  delta7d: number | null;
  trend7d: string | null;
  dataSource: string | null;
  vendorStale: boolean;
  computedAt: string;
  // Joined from universe
  company_name?: string;
  sector?: string | null;
  theme?: string | null;
}

export interface StreetUniverseEntry extends StreetScoreEvent {
  companyName: string;
  indexMembership: string | null;
  marketCapUsd: number | null;
  advUsd: number | null;
  isActive: boolean;
}

export interface StreetSignal {
  ticker: string;
  signalState: StreetSignalState;
  grade: StreetGrade | null;
  delta7d: number | null;
}

export const GRADE_COLORS: Record<StreetGrade, string> = {
  A: 'text-emerald-600',
  B: 'text-blue-600',
  C: 'text-amber-600',
  D: 'text-orange-600',
  F: 'text-rose-600',
};

export const GRADE_BG_COLORS: Record<StreetGrade, string> = {
  A: 'bg-emerald-500 text-white',
  B: 'bg-blue-500 text-white',
  C: 'bg-amber-500 text-white',
  D: 'bg-orange-500 text-white',
  F: 'bg-rose-500 text-white',
};

export const SIGNAL_LABELS: Record<StreetSignalState, string> = {
  strong_bullish: 'Strong Street',
  bullish_improving: 'Street warming up',
  neutral_improving: 'Street warming up',
  weakening: 'Street cooling',
  strong_bearish: 'Street bearish',
  none: '',
};

export const SIGNAL_CATALYST_LABELS: Record<StreetSignalState, string> = {
  strong_bullish: 'Analyst Consensus: Strong',
  bullish_improving: 'Street turning bullish',
  neutral_improving: 'Street turning bullish',
  weakening: 'Street cooling pre event',
  strong_bearish: 'Street bearish',
  none: '',
};
