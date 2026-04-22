import type { CopyTradeTrader } from "@shared/types";

export type CopyTradeMetric = {
  label: string;
  value: string;
};

export type CopyTradeTraderDetail = CopyTradeTrader & {
  summary?: string;
  subscores: CopyTradeMetric[];
  vendorMetrics: CopyTradeMetric[];
  flags: string[];
  history30d: number[];
  history90d: number[];
};

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  if (!value || typeof value !== "object") return {};
  return value as UnknownRecord;
}

function readString(
  record: UnknownRecord,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const raw = record[key];
    if (typeof raw === "string" && raw.trim().length > 0) return raw;
  }
  return undefined;
}

function readNumber(
  record: UnknownRecord,
  ...keys: string[]
): number | undefined {
  for (const key of keys) {
    const raw = record[key];
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
    if (typeof raw === "string" && raw.trim().length > 0) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

function titleCaseFromSnake(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtMetricValue(value: unknown): string {
  if (typeof value === "number")
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "N/A";
  return String(value);
}

function pickMetrics(
  record: UnknownRecord,
  predicate: (key: string) => boolean,
): CopyTradeMetric[] {
  return Object.entries(record)
    .filter(
      ([key, value]) => predicate(key) && value !== null && value !== undefined,
    )
    .slice(0, 12)
    .map(([key, value]) => ({
      label: titleCaseFromSnake(key),
      value: fmtMetricValue(value),
    }));
}

function toNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) =>
      typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN,
    )
    .filter((n) => Number.isFinite(n))
    .map((n) => Number(n));
}

function buildSyntheticHistory(
  baseScore: number,
  momentum: number,
  points: number,
): number[] {
  const series: number[] = [];
  for (let i = 0; i < points; i++) {
    const phase = i / Math.max(1, points - 1);
    const drift = (phase - 0.5) * momentum * 1.1;
    const wave = Math.sin(i * 0.65) * 1.4 + Math.cos(i * 0.21) * 0.7;
    const value = Math.max(0, Math.min(100, baseScore - drift + wave));
    series.push(Number(value.toFixed(2)));
  }
  return series;
}

function normalizeEnum<T extends readonly string[]>(
  value: string | undefined,
  allowed: T,
  fallback: T[number],
): T[number] {
  if (!value) return fallback;
  return (allowed as readonly string[]).includes(value)
    ? (value as T[number])
    : fallback;
}

export function buildCopyTradeDetailFromPayload(
  payload: unknown,
  baseTrader?: CopyTradeTrader,
): CopyTradeTraderDetail {
  const root = asRecord(payload);
  const nested = asRecord(root.trader);
  const source = { ...root, ...nested };

  const traderId =
    readString(source, "trader_id", "traderId") ??
    baseTrader?.traderId ??
    "UNKNOWN";
  const handle =
    readString(source, "handle", "display_name") ??
    baseTrader?.handle ??
    "Unknown Trader";
  const computedRank =
    readNumber(source, "computed_rank", "computedRank", "rank") ??
    baseTrader?.computedRank ??
    9_999;
  const rankChange7d =
    readNumber(source, "rank_change_7d", "rankChange7d", "rank_change") ??
    baseTrader?.rankChange7d ??
    0;
  const score =
    readNumber(source, "ema_score", "score", "emaScore") ??
    baseTrader?.score ??
    0;
  const momentum =
    readNumber(source, "score_momentum", "momentum", "scoreMomentum") ??
    baseTrader?.momentum ??
    0;
  const lastSeenAt =
    readString(
      source,
      "last_seen_at",
      "lastSeenAt",
      "updated_at",
      "created_at",
    ) ??
    baseTrader?.lastSeenAt ??
    new Date(0).toISOString();

  const grade = normalizeEnum(
    readString(source, "grade"),
    ["A", "B", "C", "D", "F"] as const,
    baseTrader?.grade ?? "C",
  );
  const confidenceBand = normalizeEnum(
    readString(source, "confidence_band", "confidenceBand"),
    ["High", "Medium", "Low"] as const,
    baseTrader?.confidenceBand ?? "Medium",
  );
  const signalState = normalizeEnum(
    readString(source, "signal_state", "signalState"),
    ["Strong", "Moderate", "Weak", "Invalid"] as const,
    baseTrader?.signalState ?? "Weak",
  );
  const lifecycleState = normalizeEnum(
    readString(source, "lifecycle_state", "lifecycleState"),
    ["active", "inactive", "reintroduced"] as const,
    baseTrader?.lifecycleState ?? "inactive",
  );

  const summary =
    readString(
      source,
      "summary",
      "explanation",
      "explanation_summary",
      "disclaimer",
    ) ?? `Trader profile intelligence for ${handle}.`;

  const subscores = pickMetrics(
    source,
    (key) => key.endsWith("_score") || key.endsWith("_rank"),
  );
  const vendorMetrics = pickMetrics(
    source,
    (key) =>
      key.includes("vendor") ||
      key.includes("updated") ||
      key.includes("created") ||
      key.includes("snapshot"),
  );
  const flags = Object.entries(source)
    .filter(
      ([k, v]) =>
        (k.endsWith("_flag") || k.endsWith("_override")) &&
        typeof v === "boolean",
    )
    .map(([k, v]) => `${titleCaseFromSnake(k)}: ${v ? "Yes" : "No"}`)
    .slice(0, 8);

  const history30dRaw =
    toNumberArray(source.history_30d).length > 0
      ? toNumberArray(source.history_30d)
      : toNumberArray(source.history30d).length > 0
        ? toNumberArray(source.history30d)
        : toNumberArray(source.score_history_30d);
  const history90dRaw =
    toNumberArray(source.history_90d).length > 0
      ? toNumberArray(source.history_90d)
      : toNumberArray(source.history90d).length > 0
        ? toNumberArray(source.history90d)
        : toNumberArray(source.score_history_90d);
  const history30d =
    history30dRaw.length >= 8
      ? history30dRaw
      : buildSyntheticHistory(score, momentum, 30);
  const history90d =
    history90dRaw.length >= 12
      ? history90dRaw
      : buildSyntheticHistory(score, momentum * 0.8, 90);

  return {
    traderId,
    handle,
    computedRank,
    rankChange7d,
    grade,
    signalState,
    confidenceBand,
    score,
    momentum,
    lifecycleState,
    lastSeenAt,
    summary,
    subscores,
    vendorMetrics,
    flags,
    history30d,
    history90d,
  };
}
