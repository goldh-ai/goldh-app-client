import {
  copyTradeLeaderboardApiResponseSchema,
  mapCopyTradeTraderFromApiDto,
  type CopyTradeLeaderboardApiResponse,
  type CopyTradeTrader,
} from "@shared/types";
import { apiUrl } from "@/lib/queryClient";
import {
  buildCopyTradeDetailFromPayload,
  type CopyTradeTraderDetail,
} from "./copyTradeDetail";

const COPYTRADE_LEADERBOARD_PATH = "/api/copytrade/leaderboard";
const COPYTRADE_TRADER_DETAIL_PATH = "/api/copytrade/trader";
const COPYTRADE_TRADER_HISTORY_PATH = "/api/copytrade/history";

export class CopyTradeHttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "CopyTradeHttpError";
    this.status = status;
  }
}

function getAuthHeaders(): Record<string, string> {
  const sessionId =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("sessionId")
      : null;
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

export type CopyTradeLeaderboardResponse = {
  traders: CopyTradeTrader[];
  raw: CopyTradeLeaderboardApiResponse;
};

export async function fetchCopyTradeLeaderboard(): Promise<CopyTradeLeaderboardResponse> {
  const res = await fetch(apiUrl(COPYTRADE_LEADERBOARD_PATH), {
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new CopyTradeHttpError(res.status, text);
  }

  const json: unknown = await res.json();
  const parsed = copyTradeLeaderboardApiResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(
      `CopyTrade API response did not match contract: ${parsed.error.message}`,
    );
  }

  const body = parsed.data;
  return {
    traders: body.traders.map(mapCopyTradeTraderFromApiDto),
    raw: body,
  };
}

export async function fetchCopyTradeTraderDetail(
  traderId: string,
  baseTrader?: CopyTradeTrader,
): Promise<CopyTradeTraderDetail> {
  const res = await fetch(
    apiUrl(`${COPYTRADE_TRADER_DETAIL_PATH}/${encodeURIComponent(traderId)}`),
    {
      credentials: "include",
      headers: getAuthHeaders(),
    },
  );

  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new CopyTradeHttpError(res.status, text);
  }

  const json: unknown = await res.json();
  return buildCopyTradeDetailFromPayload(json, baseTrader);
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function extractHistorySeries(payload: unknown): number[] {
  if (Array.isArray(payload)) {
    return payload
      .map((point) => {
        if (typeof point === "number" || typeof point === "string") {
          return toFiniteNumber(point);
        }
        if (point && typeof point === "object") {
          const row = point as Record<string, unknown>;
          return (
            toFiniteNumber(row.score) ??
            toFiniteNumber(row.ema_score) ??
            toFiniteNumber(row.value) ??
            toFiniteNumber(row.close) ??
            toFiniteNumber(row.y)
          );
        }
        return null;
      })
      .filter((n): n is number => n !== null);
  }

  if (payload && typeof payload === "object") {
    const row = payload as Record<string, unknown>;
    const candidates = [
      row.history,
      row.series,
      row.values,
      row.points,
      row.data,
      row.items,
      row.trend,
    ];
    for (const candidate of candidates) {
      const parsed = extractHistorySeries(candidate);
      if (parsed.length > 0) return parsed;
    }
  }

  return [];
}

export async function fetchCopyTradeTraderHistory(
  traderId: string,
  days: 30 | 90,
): Promise<number[]> {
  const res = await fetch(
    apiUrl(
      `${COPYTRADE_TRADER_HISTORY_PATH}/${encodeURIComponent(traderId)}?days=${days}`,
    ),
    {
      credentials: "include",
      headers: getAuthHeaders(),
    },
  );

  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new CopyTradeHttpError(res.status, text);
  }

  const json: unknown = await res.json();
  return extractHistorySeries(json);
}
