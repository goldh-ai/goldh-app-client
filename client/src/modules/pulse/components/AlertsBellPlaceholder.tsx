// STAGE 3B INTEGRATION: Connect to Alerts engine
// This component is a visual placeholder only.
// Free tier: max 3 alerts (show count badge when alert limit feature is built)
// Essentials+: unlimited alerts
// The bell icon will open an Alerts panel when the engine is implemented.

import { Bell } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AlertsBellPlaceholderProps {
  /** User's current plan tier — used to show alert limit indicator */
  tier?: string;
}

export function AlertsBellPlaceholder({ tier = 'free' }: AlertsBellPlaceholderProps) {
  const isFree = tier === 'free';
  const tooltipText = isFree ? 'Alerts coming soon (Free: 3 max)' : 'Alerts coming soon';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          disabled
          aria-label="Alerts (coming soon)"
          aria-disabled="true"
          className="relative inline-flex items-center justify-center w-7 h-7 rounded-md text-[#6b6b6b] cursor-not-allowed opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7AE6A]/50"
        >
          <Bell size={15} />
          {isFree && (
            <span
              className="absolute -top-1 -right-1 text-[9px] leading-none bg-[#2a2a2a] text-[#6b6b6b] border border-[#3a3a3a] rounded-full px-[3px] py-[1px]"
              aria-hidden="true"
            >
              0/3
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}

/** @deprecated Use named export {@link AlertsBellPlaceholder} */
export default AlertsBellPlaceholder;
