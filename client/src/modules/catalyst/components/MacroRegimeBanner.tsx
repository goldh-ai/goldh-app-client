import { useMacroRegime } from '../hooks/useMacroRegime';

type InflationRegime = 'Rising' | 'Cooling' | 'Persistent';
type LiquidityRegime = 'Expanding' | 'Neutral' | 'Tightening';
type RiskRegime = 'Risk-On' | 'Neutral' | 'Risk-Off';

function inflationColor(r: InflationRegime): string {
    if (r === 'Rising') return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
    if (r === 'Cooling') return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
}

function liquidityColor(r: LiquidityRegime): string {
    if (r === 'Tightening') return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
    if (r === 'Expanding') return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
}

function riskColor(r: RiskRegime): string {
    if (r === 'Risk-Off') return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
    if (r === 'Risk-On') return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
}

export function MacroRegimeBanner() {
    const { data: regime, isLoading } = useMacroRegime();

    if (isLoading || !regime) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#C7AE6A]/20 rounded-lg text-xs font-medium">
            <span className="text-gray-400 text-xs">Macro Regime</span>
            <span className={`px-2 py-0.5 rounded-full ${inflationColor(regime.inflation_regime)}`}>
                Inflation: {regime.inflation_regime}
            </span>
            <span className={`px-2 py-0.5 rounded-full ${liquidityColor(regime.liquidity_regime)}`}>
                Liquidity: {regime.liquidity_regime}
            </span>
            <span className={`px-2 py-0.5 rounded-full ${riskColor(regime.risk_regime)}`}>
                {regime.risk_regime}
            </span>
        </div>
    );
}
