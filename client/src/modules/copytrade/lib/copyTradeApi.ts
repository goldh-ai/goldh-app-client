import {
  copyTradeLeaderboardApiResponseSchema,
  mapCopyTradeTraderFromApiDto,
  type CopyTradeHistoryRecord,
  type CopyTradeLeaderboardApiResponse,
  type CopyTradeTrader,
} from "@shared/types";
import { apiUrl } from "@/lib/queryClient";
import {
  buildCopyTradeDetailFromPayload,
  type CopyTradeTraderDetail,
} from "./copyTradeDetail";
import {
  historyRecordsToPerformancePoints,
  historyRecordsToScoreTrend,
  parseCopyTradeHistoryPayload,
} from "./copyTradeHistoryTransforms";

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

export type CopyTradeLeaderboardRequest = {
  grade?: string;
  confidence?: string;
  signal?: string;
  capacity?: string;
  pageSize?: number;
  cursor?: string;
  /** When backend supports server-side sort (e.g. `ema_score_desc`). */
  sortBy?: string;
};

export type CopyTradeLeaderboardResponse = {
  traders: CopyTradeTrader[];
  raw: CopyTradeLeaderboardApiResponse;
};

function buildLeaderboardQueryString(
  query?: CopyTradeLeaderboardRequest,
): string {
  if (!query) return "";
  const params = new URLSearchParams();
  if (query.grade && query.grade !== "all") params.append("grade", query.grade);
  if (query.confidence && query.confidence !== "all")
    params.append("confidence", query.confidence);
  if (query.signal && query.signal !== "all")
    params.append("signal", query.signal);
  if (query.capacity && query.capacity !== "all")
    params.append("capacity", query.capacity);
  if (typeof query.pageSize === "number" && query.pageSize > 0)
    params.set("pageSize", String(query.pageSize));
  if (query.cursor) params.set("cursor", query.cursor);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  const s = params.toString();
  return s ? `?${s}` : "";
}

export async function fetchCopyTradeLeaderboard(
  query?: CopyTradeLeaderboardRequest,
): Promise<CopyTradeLeaderboardResponse> {
  const qs = buildLeaderboardQueryString(query);
  const res = await fetch(apiUrl(`${COPYTRADE_LEADERBOARD_PATH}${qs}`), {
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

export async function fetchCopyTradeTraderHistory(
  traderId: string,
  days: 30 | 90 | 365,
): Promise<CopyTradeHistoryRecord[]> {
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
  return parseCopyTradeHistoryPayload(json);
}

/** Maps live history rows into chart-ready structures merged onto trader detail. */
export function mergeCopyTradeHistoryIntoDetail(
  detail: CopyTradeTraderDetail,
  records30: CopyTradeHistoryRecord[],
  records90: CopyTradeHistoryRecord[],
  records365: CopyTradeHistoryRecord[],
): CopyTradeTraderDetail {
  const has30 = records30.length > 0;
  const has90 = records90.length > 0;
  const has365 = records365.length > 0;

  const scoreTrend30 = has30
    ? historyRecordsToScoreTrend(records30, "ema_score")
    : undefined;
  const scoreTrend90 = has90
    ? historyRecordsToScoreTrend(records90, "ema_score")
    : undefined;
  const scoreTrend365 = has365
    ? historyRecordsToScoreTrend(records365, "ema_score")
    : scoreTrend90;

  const performance30 = has30
    ? historyRecordsToPerformancePoints(records30)
    : undefined;
  const performance90 = has90
    ? historyRecordsToPerformancePoints(records90)
    : undefined;
  const performance365 = has365
    ? historyRecordsToPerformancePoints(records365)
    : performance90;

  const emaSeries30 = has30 ? records30.map((r) => r.ema_score) : [];
  const emaSeries90 = has90 ? records90.map((r) => r.ema_score) : [];

  return {
    ...detail,
    scoreTrend30,
    scoreTrend90,
    scoreTrend365,
    performance30,
    performance90,
    performance365,
    history30d: emaSeries30.length >= 2 ? emaSeries30 : detail.history30d,
    history90d: emaSeries90.length >= 2 ? emaSeries90 : detail.history90d,
  };
}
