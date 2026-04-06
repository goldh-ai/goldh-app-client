import { Bell, BellRing } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAlerts } from '../hooks/useAlerts';

interface AlertsBellProps {
  /** User's current plan tier — used to show alert limit indicator */
  tier: string;
  /** Count of alerts currently triggered (from overview ?evaluate=true) */
  triggeredCount?: number;
  onClick: () => void;
}

export function AlertsBell({ tier, triggeredCount = 0, onClick }: AlertsBellProps) {
  const { data: alerts = [] } = useAlerts();
  const isFree = tier === 'free';
  const totalCount = alerts.length;
  const isTriggered = triggeredCount > 0;

  const tooltipText = isTriggered
    ? `${triggeredCount} alert${triggeredCount > 1 ? 's' : ''} triggered`
    : isFree
      ? `Alerts (${totalCount}/${3} used)`
      : `Alerts (${totalCount} active)`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          aria-label={tooltipText}
          className="relative inline-flex items-center justify-center w-7 h-7 rounded-md text-[#6b6b6b] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7AE6A]/50"
        >
          {isTriggered
            ? <BellRing size={15} className="text-amber-500 animate-[wiggle_0.5s_ease-in-out]" />
            : <Bell size={15} />
          }
          {/* Count badge */}
          {totalCount > 0 && !isTriggered && (
            <span
              className="absolute -top-1 -right-1 min-w-[14px] h-[14px] text-[9px] leading-none bg-[#2a2a2a] text-[#aaa] border border-[#3a3a3a] rounded-full px-[3px] flex items-center justify-center font-bold"
              aria-hidden="true"
            >
              {isFree ? `${totalCount}/3` : totalCount}
            </span>
          )}
          {/* Triggered badge (red) */}
          {isTriggered && (
            <span
              className="absolute -top-1 -right-1 min-w-[14px] h-[14px] text-[9px] leading-none bg-amber-500 text-black rounded-full px-[3px] flex items-center justify-center font-black"
              aria-hidden="true"
            >
              {triggeredCount}
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

export default AlertsBell;
