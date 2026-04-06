import { useQuery } from '@tanstack/react-query';
import type { StreetUniverseEntry } from '../types';

function getAuthHeaders(): Record<string, string> {
  const sessionId = localStorage.getItem('sessionId');
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

interface UniverseParams {
  sector?: string;
  grade?: string;
  signalState?: string;
  confidenceBand?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

interface UniverseResponse {
  entries: StreetUniverseEntry[];
  total: number;
  page: number;
  pageSize: number;
}

export function useSTREETScoreUniverse(params: UniverseParams = {}) {
  const qs = new URLSearchParams();
  if (params.sector) qs.set('sector', params.sector);
  if (params.grade) qs.set('grade', params.grade);
  if (params.signalState) qs.set('signal_state', params.signalState);
  if (params.confidenceBand) qs.set('confidence_band', params.confidenceBand);
  if (params.sortBy) qs.set('sort_by', params.sortBy);
  if (params.page) qs.set('page', String(params.page));
  if (params.pageSize) qs.set('page_size', String(params.pageSize));

  return useQuery<UniverseResponse>({
    queryKey: ['streetscore-universe', params],
    queryFn: () =>
      fetch(`/api/score/universe?${qs.toString()}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      }).then(async r => {
        if (r.status === 403) throw new Error('STREETSCORE_ACCESS_DENIED');
        if (!r.ok) throw new Error('Failed to fetch STREETScore universe');
        return r.json();
      }),
    staleTime: 30 * 60 * 1000,
    retry: false,
  });
}
