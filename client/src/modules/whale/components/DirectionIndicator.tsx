import React from 'react';
import { cn } from '@/lib/utils';
import type { WhaleDirection } from '../types';

interface DirectionIndicatorProps {
    direction: WhaleDirection;
    isSpike?: boolean;
}

const DIRECTION_COLORS: Record<WhaleDirection, string> = {
    inflow: 'bg-rose-500',
    outflow: 'bg-emerald-500',
    transfer: 'bg-blue-500',
};

export function DirectionIndicator({ direction, isSpike }: DirectionIndicatorProps) {
    const color = DIRECTION_COLORS[direction];
    return (
        <div
            className={cn(
                'w-1 h-14 rounded-full flex flex-col justify-end',
                color,
                isSpike && 'animate-pulse'
            )}
        >
            {isSpike && <div className="w-1 h-1 bg-white rounded-full mb-1 animate-ping" />}
        </div>
    );
}
