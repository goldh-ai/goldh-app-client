import { useEarningsHeatmap, type EarningsHeatmapRow } from '../hooks/useEarningsHeatmap';

const SECTORS = ['tech', 'financials', 'energy', 'healthcare', 'consumer', 'industrials', 'materials', 'utilities', 'real_estate'];

function intensityClass(intensity: 1 | 2 | 3): string {
    if (intensity === 3) return 'bg-rose-500/50 text-rose-200';
    if (intensity === 2) return 'bg-amber-500/50 text-amber-200';
    return 'bg-slate-700/60 text-slate-300';
}

function formatSector(s: string): string {
    return s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function EarningsHeatmapGrid() {
    const { data, isLoading, isError } = useEarningsHeatmap();

    if (isLoading) return <div className="h-32 flex items-center justify-center text-gray-500 text-sm">Loading heatmap…</div>;
    if (isError || !data?.heatmap.length) return null;

    // Unique weeks, sorted descending
    const weeks = Array.from(new Set(data.heatmap.map(r => r.week_start))).sort((a, b) => b.localeCompare(a)).slice(0, 8);

    // Build lookup: week+sector → row
    const lookup = new Map<string, EarningsHeatmapRow>();
    for (const row of data.heatmap) {
        lookup.set(`${row.week_start}::${row.sector}`, row);
    }

    return (
        <div className="overflow-x-auto">
            <table className="text-xs border-collapse w-full min-w-[640px]">
                <thead>
                    <tr>
                        <th className="text-left text-gray-400 font-medium px-2 py-1 w-24">Week</th>
                        {SECTORS.map(s => (
                            <th key={s} className="text-center text-gray-400 font-medium px-1 py-1 min-w-[72px]">
                                {formatSector(s)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {weeks.map(week => (
                        <tr key={week}>
                            <td className="text-gray-400 px-2 py-1 font-mono">{week}</td>
                            {SECTORS.map(sector => {
                                const cell = lookup.get(`${week}::${sector}`);
                                if (!cell) return <td key={sector} className="px-1 py-1"><div className="h-8 rounded bg-slate-800/40" /></td>;
                                return (
                                    <td key={sector} className="px-1 py-1">
                                        <div
                                            className={`h-8 rounded flex items-center justify-center text-[10px] font-medium cursor-default ${intensityClass(cell.heatmap_intensity)}`}
                                            title={`${cell.earnings_count} events | avg score: ${cell.avg_impact_score ?? 'N/A'}\n${cell.event_ids.slice(0, 5).join(', ')}`}
                                        >
                                            {cell.earnings_count}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="text-[10px] text-gray-500 mt-2 px-1">Intensity: <span className="text-slate-400">Low</span> · <span className="text-amber-400">Medium</span> · <span className="text-rose-400">High</span></p>
        </div>
    );
}
