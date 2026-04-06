import { useQuery } from '@tanstack/react-query';
import type { MorningBrief } from '@shared/types';

async function fetchMorningBrief(): Promise<MorningBrief | null> {
  const res = await fetch('/api/pulse/morningbrief');
  if (res.status === 503) return null; // not yet generated
  if (!res.ok) throw new Error(`Morning brief fetch failed: ${res.status}`);
  return res.json();
}

export function useMorningBrief() {
  return useQuery<MorningBrief | null>({
    queryKey: ['pulse', 'morningbrief'],
    queryFn: fetchMorningBrief,
    staleTime: 5 * 60 * 1000, // 5 minutes — brief changes once daily
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
