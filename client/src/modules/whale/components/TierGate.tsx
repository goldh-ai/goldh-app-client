/**
 * Whale Watch — Tier Gate Overlay
 *
 * Blurs and locks the content area for free-tier users.
 * Prompts upgrade with a link to /pricing.
 */

import React from 'react';
import { Lock, Waves } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export function TierGate() {
    return (
        <div className="relative min-h-[400px] rounded-2xl overflow-hidden border border-[#1f1f1f]">
            {/* Blurred mock content behind the gate */}
            <div className="blur-md select-none pointer-events-none p-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 flex gap-5">
                        <div className="w-1 h-14 rounded-full bg-rose-500 opacity-60" />
                        <div className="flex-1 space-y-3">
                            <div className="h-4 w-32 bg-[#1a1a1a] rounded" />
                            <div className="h-3 w-48 bg-[#1a1a1a] rounded" />
                            <div className="grid grid-cols-2 gap-4 bg-[#111] rounded-lg p-3">
                                <div className="h-3 w-20 bg-[#222] rounded" />
                                <div className="h-3 w-20 bg-[#222] rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/80 backdrop-blur-sm">
                <div className="text-center space-y-5 max-w-sm px-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#C7AE6A]/30 flex items-center justify-center mx-auto">
                        <Lock className="w-7 h-7 text-[#C7AE6A]" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                            <Waves className="w-4 h-4 text-[#C7AE6A]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C7AE6A]">
                                Whale Watch
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-white">
                            Essential Plan Required
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Institutional-grade on-chain whale flow analysis is available on the Essential plan and above.
                        </p>
                    </div>
                    <Link href="/pricing">
                        <Button className="bg-[#C7AE6A] hover:bg-[#b89d5a] text-black font-black uppercase tracking-widest text-xs px-8 py-3 rounded-xl">
                            Upgrade to Essential
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
