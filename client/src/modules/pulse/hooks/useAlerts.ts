import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PulseAlert, CreatePulseAlertInput, UpdatePulseAlertInput } from '@shared/types';

const ALERTS_KEY = ['/api/pulse/alerts'] as const;

function getAuthHeaders(): Record<string, string> {
  const sessionId = localStorage.getItem('sessionId');
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

/** Fetch the current user's pulse alerts. */
export function useAlerts() {
  return useQuery<PulseAlert[]>({
    queryKey: ALERTS_KEY,
    queryFn: async () => {
      const res = await fetch('/api/pulse/alerts', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `${res.status}`);
      }
      return res.json();
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 4 * 60 * 60 * 1000, // 4 hours
  });
}

/** Create a new alert. Rejects with server error message on free-tier cap. */
export function useCreateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePulseAlertInput) => {
      const res = await fetch('/api/pulse/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Create failed: ${res.status}`);
      }
      return res.json() as Promise<PulseAlert>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ALERTS_KEY }),
  });
}

/** Toggle enabled/disabled or update threshold/direction of an alert. */
export function useUpdateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePulseAlertInput }) => {
      const res = await fetch(`/api/pulse/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Update failed: ${res.status}`);
      }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ALERTS_KEY }),
  });
}

/** Delete an alert by ID. */
export function useDeleteAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/pulse/alerts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Delete failed: ${res.status}`);
      }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ALERTS_KEY }),
  });
}
