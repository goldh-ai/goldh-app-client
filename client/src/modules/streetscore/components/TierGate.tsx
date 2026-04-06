import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

/**
 * PRO upgrade prompt shown to non-PRO users on the STREETScore page.
 * Renders blurred mock rows behind a locked overlay.
 */
export function TierGate() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative">
      {/* Blurred mock rows */}
      <div className="blur-sm pointer-events-none select-none" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-[#1a1a1a] bg-[#0a0a0a]">
            <div className="w-16 h-4 bg-[#1a1a1a] rounded" />
            <div className="w-8 h-4 bg-[#1a1a1a] rounded" />
            <div className="w-24 h-4 bg-[#1a1a1a] rounded" />
            <div className="w-20 h-4 bg-[#1a1a1a] rounded" />
          </div>
        ))}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-xl">
        <div className="p-4 rounded-full bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 mb-4">
          <Lock className="h-8 w-8 text-[#C7AE6A]" />
        </div>
        <h3 className="text-lg font-black text-white mb-1">STREETScore is PRO+</h3>
        <p className="text-sm text-gray-400 mb-5 text-center max-w-xs leading-relaxed">
          Upgrade to PRO to access analyst consensus scores, grade rankings, and signal chips across all 380 tickers.
        </p>
        <Button
          onClick={() => setLocation('/pricing')}
          className="bg-[#C7AE6A] hover:bg-[#D4BD7A] text-black font-bold px-6 h-10 rounded-xl"
        >
          Upgrade to PRO
        </Button>
      </div>
    </div>
  );
}
