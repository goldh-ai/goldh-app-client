import { useQuery } from '@tanstack/react-query';
import type { StreetScoreEvent } from '../types';

function getAuthHeaders(): Record<string, string> {
  const sessionId = localStorage.getItem('sessionId');
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

export function useSTREETScoreTicker(ticker: string | null | undefined) {
  return useQuery<StreetScoreEvent | null>({
    queryKey: ['streetscore-ticker', ticker],
    queryFn: () =>
      fetch(`/api/score/${encodeURIComponent(ticker!)}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      }).then(async r => {
        if (r.status === 401 || r.status === 403) return null;
        if (r.status === 404) return null;
        if (!r.ok) throw new Error('Failed to fetch STREETScore');
        return r.json();
      }),
    enabled: !!ticker,
    staleTime: 30 * 60 * 1000,
    retry: false,
  });
}
