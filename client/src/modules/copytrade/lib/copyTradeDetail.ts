import type {
  CopyTradeConfidenceBand,
  CopyTradeGrade,
  CopyTradeLifecycleState,
  CopyTradeSignalState,
  CopyTradeTrader,
} from "@shared/types";
import type {
  CopyTradePerformancePoint,
  CopyTradeScoreTrendPoint,
} from "./copyTradeHistoryTransforms";

export type CopyTradeMetric = {
  label: string;
  value: string;
};

/** Present when `/trader/:id` includes risk_level (Low / Medium / High). */
export type CopyTradeRiskLevel = "Low" | "Medium" | "High";

/** Score stability classification from `score_explanation_summary.score_stability`. */
export type CopyTradeScoreStability = "stable" | "moderate" | "volatile";

/** A single parsed driver from `score_explanation_summary.top_3_drivers`. */
export type CopyTradeScoreDriver = {
  label: string;
  /** Signed delta in points. Positive contributors lift the score, negative ones drag it down. */
  delta: number | null;
  /** Original API string (e.g. `"Consistency (+15pts)"`) preserved for tooltips. */
  raw: string;
};

/**
 * Detail can omit grade / confidence / signal / lifecycle when the payload and
 * list-row merge do not supply them — we do **not** invent Low/Medium/C etc. on
 * the DTO. UI merges from the leaderboard row for display where needed.
 */
export type CopyTradeTraderDetail = Omit<
  CopyTradeTrader,
  "grade" | "confidenceBand" | "signalState" | "lifecycleState"
> & {
  grade?: CopyTradeGrade;
  confidenceBand?: CopyTradeConfidenceBand;
  signalState?: CopyTradeSignalState;
  lifecycleState?: CopyTradeLifecycleState | null;
} & {
  summary?: string;
  subscores: CopyTradeMetric[];
  vendorMetrics: CopyTradeMetric[];
  flags: string[];
  /** Legacy numeric series (EMA); still used as fallback when history API fails. */
  history30d: number[];
  history90d: number[];
  riskLevel?: CopyTradeRiskLevel | null;
  emaSnapshot?: number | null;
  rawSnapshot?: number | null;
  scoreTrend30?: CopyTradeScoreTrendPoint[];
  scoreTrend90?: CopyTradeScoreTrendPoint[];
  scoreTrend365?: CopyTradeScoreTrendPoint[];
  performance30?: CopyTradePerformancePoint[];
  performance90?: CopyTradePerformancePoint[];
  performance365?: CopyTradePerformancePoint[];
  maxDrawdownPct?: number | null;
  winRatePct?: number | null;
  strategyLabel?: string | null;
  totalTradesProfile?: number | null;
  monthsActiveProfile?: number | null;
  avgTradesPerMonth?: number | null;
  behavioralTags?: string[];
  generatedAt?: string | null;
  /** Top contributors to the score, sourced from `score_explanation_summary.top_3_drivers`. */
  topDrivers: CopyTradeScoreDriver[];
  /** Plain-English signal trigger explanation, sourced from `score_explanation_summary.signal_reason`. */
  signalReason?: string | null;
  /** Plain-English confidence band explanation, sourced from `score_explanation_summary.confidence_reason`. */
  confidenceReason?: string | null;
  /** Stability classification of the score over time. */
  scoreStability?: CopyTradeScoreStability | null;
  /** True when the score was capped by a guardrail rule (e.g. drawdown cap). */
  scoreCapApplied?: boolean;
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

/** Returns `null` when the API explicitly sent JSON `null`. */
function readNullableInt(
  record: UnknownRecord,
  ...keys: string[]
): number | null | undefined {
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(record, key)) continue;
    const raw = record[key];
    if (raw === null) return null;
    if (typeof raw === "number" && Number.isFinite(raw)) return Math.trunc(raw);
    if (typeof raw === "string" && raw.trim().length > 0) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) return Math.trunc(parsed);
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
  if (value === null || value === undefined) return "—";
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

function subscoresFromSubScoresBlock(obj: unknown): CopyTradeMetric[] {
  if (!obj || typeof obj !== "object") return [];
  const rec = obj as UnknownRecord;
  return Object.entries(rec)
    .filter(
      ([k, v]) =>
        (k.endsWith("_score") || k.endsWith("_penalty")) &&
        typeof v === "number" &&
        Number.isFinite(v),
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

function normalizeEnum<T extends readonly string[]>(
  value: string | undefined,
  allowed: T,
  fallback: T[number] | undefined,
): T[number] | undefined {
  if (!value) return fallback;
  return (allowed as readonly string[]).includes(value)
    ? (value as T[number])
    : fallback;
}

function normalizeWinRateToPct(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value >= 0 && value <= 1) return Math.round(value * 1000) / 10;
  return Math.round(value * 10) / 10;
}

/**
 * Parses a driver string like `"Consistency (+15pts)"` into a label + signed delta.
 * Falls back gracefully when the format is unfamiliar so the UI can still surface the raw label.
 */
function parseScoreDriver(raw: string): CopyTradeScoreDriver | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  const match = trimmed.match(
    /^(.*?)\s*\(([+-]?\d+(?:\.\d+)?)\s*pts?\s*\)\s*$/i,
  );
  if (match) {
    const label = match[1]!.trim();
    const delta = Number(match[2]);
    return {
      label: label.length > 0 ? label : trimmed,
      delta: Number.isFinite(delta) ? delta : null,
      raw: trimmed,
    };
  }
  return { label: trimmed, delta: null, raw: trimmed };
}

function readTopDrivers(record: UnknownRecord): CopyTradeScoreDriver[] {
  const value = record.top_3_drivers ?? record.topDrivers ?? record.top3Drivers;
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map(parseScoreDriver)
    .filter((entry): entry is CopyTradeScoreDriver => entry !== null)
    .slice(0, 3);
}

function readScoreStability(
  record: UnknownRecord,
): CopyTradeScoreStability | null {
  const raw = readString(record, "score_stability", "scoreStability");
  if (!raw) return null;
  const normalized = raw.trim().toLowerCase();
  if (
    normalized === "stable" ||
    normalized === "moderate" ||
    normalized === "volatile"
  ) {
    return normalized;
  }
  return null;
}

function readBoolean(
  record: UnknownRecord,
  ...keys: string[]
): boolean | undefined {
  for (const key of keys) {
    const raw = record[key];
    if (typeof raw === "boolean") return raw;
    if (typeof raw === "string") {
      const lc = raw.trim().toLowerCase();
      if (lc === "true") return true;
      if (lc === "false") return false;
    }
  }
  return undefined;
}

export function buildCopyTradeDetailFromPayload(
  payload: unknown,
  baseTrader?: CopyTradeTrader,
): CopyTradeTraderDetail {
  const root = asRecord(payload);
  const nested = asRecord(root.trader);
  const source = { ...root, ...nested };
  const rawMetrics = asRecord(source.raw_metrics ?? {});

  const traderId =
    readString(source, "trader_id", "traderId") ??
    baseTrader?.traderId ??
    "UNKNOWN";
  const handle =
    readString(source, "handle", "display_name") ??
    readString(rawMetrics, "handle") ??
    baseTrader?.handle ??
    "Unknown Trader";
  const computedRank =
    readNumber(source, "computed_rank", "computedRank", "rank") ??
    baseTrader?.computedRank ??
    9_999;
  const rankChange7d =
    readNullableInt(source, "rank_change_7d", "rankChange7d", "rank_change") ??
    baseTrader?.rankChange7d ??
    null;
  const score =
    readNumber(source, "ema_score", "score", "emaScore") ??
    baseTrader?.score ??
    0;
  const rawSnapshot =
    readNumber(source, "raw_score", "rawScore") ??
    readNumber(rawMetrics, "raw_score") ??
    null;
  const emaSnapshot = readNumber(source, "ema_score", "emaScore") ?? null;
  const momentum =
    readNumber(source, "score_momentum", "momentum", "scoreMomentum") ??
    baseTrader?.momentum ??
    0;
  const generatedAt =
    readString(
      source,
      "generatedAt",
      "generated_at",
      "fetched_at",
      "fetchedAt",
    ) ?? null;
  const lastSeenAt =
    readString(
      source,
      "last_seen_at",
      "lastSeenAt",
      "updated_at",
      "created_at",
    ) ??
    generatedAt ??
    baseTrader?.lastSeenAt ??
    new Date(0).toISOString();

  const grade = normalizeEnum(
    readString(source, "grade"),
    ["A", "B", "C", "D", "F"] as const,
    baseTrader?.grade,
  );
  const confidenceBand = normalizeEnum(
    readString(source, "confidence_band", "confidenceBand"),
    ["High", "Medium", "Low"] as const,
    baseTrader?.confidenceBand,
  );
  const signalState = normalizeEnum(
    readString(source, "signal_state", "signalState"),
    ["Strong", "Moderate", "Weak", "Invalid"] as const,
    baseTrader?.signalState,
  );
  const lifecycleState = normalizeEnum(
    readString(source, "lifecycle_state", "lifecycleState"),
    ["active", "inactive", "reintroduced"] as const,
    baseTrader?.lifecycleState ?? undefined,
  );

  const riskRaw = readString(source, "risk_level", "riskLevel");
  const explicitRisk: CopyTradeRiskLevel | null =
    riskRaw &&
    (["Low", "Medium", "High"] as const).includes(riskRaw as CopyTradeRiskLevel)
      ? (riskRaw as CopyTradeRiskLevel)
      : null;

  const maxDrawdownPct =
    readNumber(rawMetrics, "max_drawdown_pct") ??
    readNumber(source, "max_drawdown_pct") ??
    null;
  const winRatePct =
    normalizeWinRateToPct(rawMetrics.win_rate_pct) ??
    normalizeWinRateToPct(rawMetrics.win_rate) ??
    null;
  const totalTradesProfile =
    readNumber(rawMetrics, "total_trades") ??
    readNumber(source, "total_trades") ??
    null;
  const monthsActiveProfile =
    readNumber(rawMetrics, "months_active") ??
    readNumber(source, "months_active") ??
    null;
  const avgTradesPerMonth =
    readNumber(rawMetrics, "avg_trades_per_month") ?? null;
  const profileTag =
    readString(source, "profile_tag", "profileTag", "strategy_type") ?? null;
  const capacityFlagRaw = readString(source, "capacity_flag", "capacityFlag");
  const capacityFlag =
    capacityFlagRaw === "Low" ||
    capacityFlagRaw === "Medium" ||
    capacityFlagRaw === "High"
      ? capacityFlagRaw
      : null;

  const riskLevel = explicitRisk;

  const ses = asRecord(source.score_explanation_summary ?? {});
  const signalReason = readString(ses, "signal_reason") ?? null;
  const confidenceReason = readString(ses, "confidence_reason") ?? null;
  const topDrivers = readTopDrivers(ses);
  const scoreStability = readScoreStability(ses);
  const scoreCapApplied =
    readBoolean(ses, "cap_applied", "capApplied") ??
    readBoolean(source, "cap_applied", "capApplied") ??
    false;
  const summary =
    ([signalReason, confidenceReason].filter(Boolean).join(" · ") ||
      readString(
        source,
        "summary",
        "explanation",
        "explanation_summary",
        "disclaimer",
      )) ??
    `Trader profile intelligence for ${handle}.`;

  const subscoresBlock = source.sub_scores ?? source.subScores;
  const subscoresFromBlock = subscoresFromSubScoresBlock(subscoresBlock);
  const subscores = subscoresFromBlock;

  const vendorMetrics = pickMetrics(
    source,
    (key) =>
      key.includes("vendor") ||
      key.includes("snapshot") ||
      key === "model_version" ||
      key === "compute_hash",
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
  const history30d = history30dRaw;
  const history90d = history90dRaw;

  const tagsRaw = source.behavioral_tags ?? source.behavioralTags;
  const behavioralTags = Array.isArray(tagsRaw)
    ? tagsRaw.filter((t): t is string => typeof t === "string").slice(0, 12)
    : [];

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
    profileTag,
    capacityFlag,
    lifecycleState,
    lastSeenAt,
    riskLevel,
    emaSnapshot,
    rawSnapshot,
    summary,
    subscores,
    vendorMetrics,
    flags,
    history30d,
    history90d,
    maxDrawdownPct,
    winRatePct,
    strategyLabel: profileTag,
    totalTradesProfile,
    monthsActiveProfile,
    avgTradesPerMonth,
    behavioralTags,
    generatedAt,
    topDrivers,
    signalReason,
    confidenceReason,
    scoreStability,
    scoreCapApplied,
  };
}
