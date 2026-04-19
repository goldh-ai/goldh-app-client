import { Lock, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function ArbitrageTierGate() {
  return (
    <div className="relative min-h-[420px] rounded-2xl overflow-hidden border border-[#1f1f1f]">
      <div className="blur-md select-none pointer-events-none p-6 space-y-3" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-4 flex items-center gap-5"
          >
            <div className="w-1 h-10 rounded-full bg-[#C7AE6A] opacity-40" />
            <div className="flex-1 space-y-2.5">
              <div className="flex items-center gap-4">
                <div className="h-4 w-20 bg-[#1a1a1a] rounded" />
                <div className="h-3 w-14 bg-[#1a1a1a] rounded" />
                <div className="h-3 w-14 bg-[#1a1a1a] rounded" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="h-3 w-16 bg-[#222] rounded" />
                <div className="h-3 w-12 bg-[#222] rounded" />
                <div className="h-3 w-14 bg-[#222] rounded" />
                <div className="h-3 w-10 bg-[#222] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/80 backdrop-blur-sm">
        <div className="text-center space-y-5 max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#C7AE6A]/30 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-[#C7AE6A]" />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-[#C7AE6A]" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C7AE6A]">
                Price Inefficiency Intelligence
              </span>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-white">
              Pro Plan Required
            </h3>
            <p className="text-sm leading-relaxed text-gray-500">
              Go beyond raw spreads. The Arbitrage Scanner evaluates every opportunity through four
              intelligence layers — spread detection, liquidity feasibility, friction modelling, and
              net opportunity scoring — so you see only what is realistically exploitable.
            </p>
          </div>

          <Link href="/pricing">
            <Button className="bg-[#C7AE6A] hover:bg-[#b89d5a] text-black font-black uppercase tracking-widest text-xs px-8 py-3 rounded-xl">
              Upgrade to PRO
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
