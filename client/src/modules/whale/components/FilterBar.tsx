/**
 * Whale Watch — Filter Bar
 *
 * Desktop: sticky pill filter row + search input.
 * Mobile: search input + bottom Sheet drawer.
 * Maps to WhaleEventsFilter shape (chain, direction, walletType).
 */

import React from 'react';
import { Filter, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { WhaleEventsFilter, WhaleDirection, WalletClassification } from '../types';

interface FilterBarProps {
    filter: WhaleEventsFilter;
    onChange: (next: Partial<WhaleEventsFilter>) => void;
    searchQuery: string;
    setSearchQuery: (val: string) => void;
}

interface PillOption<T extends string> {
    label: string;
    value: T | undefined;
}

const CHAIN_OPTIONS: PillOption<string>[] = [
    { label: 'All chains', value: undefined },
    { label: 'BTC', value: 'BTC' },
    { label: 'ETH', value: 'ETH' },
];

const DIRECTION_OPTIONS: PillOption<WhaleDirection>[] = [
    { label: 'All directions', value: undefined },
    { label: 'Inflow', value: 'inflow' },
    { label: 'Outflow', value: 'outflow' },
    { label: 'Transfer', value: 'transfer' },
];

const WALLET_TYPE_OPTIONS: PillOption<WalletClassification>[] = [
    { label: 'All types', value: undefined },
    { label: 'Exchange', value: 'exchange' },
    { label: 'Fund', value: 'fund' },
    { label: 'Custodian', value: 'custodian' },
    { label: 'Unknown', value: 'unknown' },
];

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap',
                active
                    ? 'bg-[#C7AE6A] text-black shadow-lg'
                    : 'bg-[#111] text-gray-500 border border-[#222] hover:border-gray-700 hover:text-gray-300',
            )}
        >
            {label}
        </button>
    );
}

function MobileSheetRow<T extends string>({
    title,
    options,
    value,
    onSelect,
}: {
    title: string;
    options: PillOption<T>[];
    value: T | undefined;
    onSelect: (v: T | undefined) => void;
}) {
    return (
        <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">{title}</h4>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt.label}
                        onClick={() => onSelect(opt.value)}
                        className={cn(
                            'px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all w-full text-left',
                            value === opt.value
                                ? 'bg-[#C7AE6A] text-black'
                                : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#222]',
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export function FilterBar({ filter, onChange, searchQuery, setSearchQuery }: FilterBarProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 md:top-14 bg-[#050505]/80 backdrop-blur-xl py-4 z-40 border-b border-[#1a1a1a] -mx-4 sm:-mx-6 px-4 sm:px-6">

            {/* Desktop filters */}
            <div className="hidden md:flex items-center gap-4 overflow-x-auto no-scrollbar w-full">
                <div className="p-2 bg-[#1a1a1a] rounded-lg border border-[#222] shrink-0">
                    <Filter className="w-3.5 h-3.5 text-[#C7AE6A]" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {CHAIN_OPTIONS.map((opt) => (
                        <FilterPill
                            key={opt.label}
                            label={opt.label}
                            active={filter.chain === opt.value}
                            onClick={() => onChange({ chain: opt.value, page: 1 })}
                        />
                    ))}
                    <div className="w-px h-4 bg-[#222] mx-1" />
                    {DIRECTION_OPTIONS.map((opt) => (
                        <FilterPill
                            key={opt.label}
                            label={opt.label}
                            active={filter.direction === opt.value}
                            onClick={() => onChange({ direction: opt.value, page: 1 })}
                        />
                    ))}
                    <div className="w-px h-4 bg-[#222] mx-1" />
                    {WALLET_TYPE_OPTIONS.slice(0, 4).map((opt) => (
                        <FilterPill
                            key={opt.label}
                            label={opt.label}
                            active={filter.walletType === opt.value}
                            onClick={() => onChange({ walletType: opt.value, page: 1 })}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile: search + sheet trigger */}
            <div className="md:hidden w-full flex items-center gap-3">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-600 group-focus-within:text-[#C7AE6A] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search tx..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111] border border-[#222] rounded-xl pl-10 pr-4 h-10 text-xs text-white focus:outline-none focus:border-[#C7AE6A]/50 transition-all font-medium"
                    />
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="p-3 bg-[#1a1a1a] rounded-lg border border-[#222] active:scale-95 transition-transform">
                            <Filter className="w-4 h-4 text-[#C7AE6A]" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="bg-[#0a0a0a] border-t border-[#222] rounded-t-3xl h-[500px]">
                        <div className="space-y-6 pt-6 overflow-y-auto h-full pb-8">
                            <MobileSheetRow
                                title="Chain"
                                options={CHAIN_OPTIONS}
                                value={filter.chain as string | undefined}
                                onSelect={(v) => onChange({ chain: v, page: 1 })}
                            />
                            <MobileSheetRow
                                title="Direction"
                                options={DIRECTION_OPTIONS}
                                value={filter.direction}
                                onSelect={(v) => onChange({ direction: v, page: 1 })}
                            />
                            <MobileSheetRow
                                title="Wallet type"
                                options={WALLET_TYPE_OPTIONS}
                                value={filter.walletType}
                                onSelect={(v) => onChange({ walletType: v, page: 1 })}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
