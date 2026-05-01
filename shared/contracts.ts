import { z } from "zod";

/** Browser-safe API contracts — Zod schemas and TS interfaces for client and server. */

// ─── Enums & Constants ───────────────────────────────────────────────────────

export const planTierSchema = z.enum([
  "free",
  "essential",
  "pro",
  "elite",
  "admin",
]);
export type PlanTier = z.infer<typeof planTierSchema>;

export const impactBandSchema = z.enum(["Low", "Medium", "High"]);
export type ImpactBand = "Low" | "Medium" | "High";

export const biasSchema = z.enum(["Risk-On", "Risk-Off", "Neutral"]);
export type Bias = "Risk-On" | "Risk-Off" | "Neutral";

// ─── Core Interfaces ─────────────────────────────────────────────────────────

export interface RegistryAsset {
  symbol: string;
  name: string;
  class: "index" | "equity" | "commodity" | "forex" | "etf" | "bond";
  yahooTicker: string;
  eodhdTicker: string | null;
  description?: string;
}

export interface RegistryData {
  equities: RegistryAsset[];
  indices: RegistryAsset[];
  commodities: RegistryAsset[];
  forex: RegistryAsset[];
  etfs: RegistryAsset[];
  bonds: RegistryAsset[];
  lastUpdated?: any;
  seededAt?: string;
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export const signUpSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    experienceLevel: z.string().optional(),
    agreeToUpdates: z.boolean().optional().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpData = z.infer<typeof signUpSchema>;

export const serverSignUpSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  experienceLevel: z.string().optional(),
  agreeToUpdates: z.boolean().optional().default(false),
});

// ─── Content ────────────────────────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  question: string;
  answer: string;
  relatedTopics: string[];
}

// ─── Economic Calendar ──────────────────────────────────────────────────────

export const econEventSchema = z.preprocess(
  (val: any) => {
    if (!val || typeof val !== "object") return val;
    const date = val.date || val.datetime_utc;
    let impact = val.impact || "Medium";
    if (
      typeof impact === "string" &&
      !["Low", "Medium", "High", "Holiday"].includes(impact)
    ) {
      const lowerImpact = impact.toLowerCase();
      if (lowerImpact.includes("high")) impact = "High";
      else if (lowerImpact.includes("low")) impact = "Low";
      else if (lowerImpact.includes("holiday") || lowerImpact.includes("bank"))
        impact = "Holiday";
      else impact = "Medium";
    }
    const country = val.country || "Global";
    return {
      ...val,
      date,
      impact,
      country,
      forecast:
        val.forecast !== undefined && val.forecast !== null
          ? String(val.forecast)
          : "",
      previous:
        val.previous !== undefined && val.previous !== null
          ? String(val.previous)
          : "",
    };
  },
  z.object({
    id: z.string().optional().default("unknown"),
    title: z.string().min(1, "Event title is required"),
    country: z.string().default("Global"),
    date: z.string().min(1, "Date is required"),
    impact: z.enum(["Low", "Medium", "High", "Holiday"]).default("Medium"),
    forecast: z.string().default(""),
    previous: z.string().default(""),
  }),
);

export type EconEvent = z.infer<typeof econEventSchema>;

// ─── UMF (Universal Market Financials) ──────────────────────────────────────

export const umfAssetClassEnum = z.enum([
  "crypto",
  "index",
  "forex",
  "commodity",
  "etf",
  "equity",
  "bond",
]);
export type UmfAssetClass = z.infer<typeof umfAssetClassEnum>;

export const umfAssetSchema = z.object({
  id: z.string().min(1, "Asset ID is required"),
  symbol: z.string().min(1, "Symbol is required"),
  name: z.string().min(1, "Asset name is required"),
  class: umfAssetClassEnum,
  image: z.string().url().nullable().optional(),
  price: z.number().positive("Price must be positive"),
  changePct24h: z.number(),
  volume24h: z.number().positive("Volume must be positive").nullable(),
  marketCap: z.number().positive("Market cap must be positive").nullable(),
  updatedAt_utc: z.string().datetime(),
});

export type UmfAsset = z.infer<typeof umfAssetSchema>;

export const umfSnapshotSchema = z.object({
  timestamp_utc: z.string().datetime(),
  assets: z.array(umfAssetSchema),
});

export type UmfSnapshot = z.infer<typeof umfSnapshotSchema>;

export const umfAssetLiveSchema = z.object({
  id: z.string().min(1, "Asset ID is required"),
  symbol: z.string().min(1, "Symbol is required"),
  name: z.string().min(1, "Asset name is required"),
  class: umfAssetClassEnum.or(z.literal("equity")),
  image: z.string().url().nullable().optional(),
  price: z.number().positive("Price must be positive"),
  changePct24h: z.number().nullable(),
  volume24h: z.number().nonnegative().nullable(),
  marketCap: z.number().nonnegative().nullable(),
  marketCapRank: z.number().int().positive().nullable().optional(),
  high24h: z.number().nonnegative().nullable().optional(),
  low24h: z.number().nonnegative().nullable().optional(),
  circulatingSupply: z.number().nonnegative().nullable().optional(),
  totalSupply: z.number().nonnegative().nullable().optional(),
  maxSupply: z.number().nonnegative().nullable().optional(),
  updatedAt_utc: z.string().datetime(),
});

export type UmfAssetLive = z.infer<typeof umfAssetLiveSchema>;

export const providerMetaSchema = z.record(
  z.string(),
  z.object({
    lastFetch: z.string().datetime(),
    degraded: z.boolean().default(false),
  }),
);

export type ProviderMeta = z.infer<typeof providerMetaSchema>;

export const umfSnapshotLiveSchema = z.object({
  timestamp_utc: z.string().datetime(),
  assets: z.array(umfAssetLiveSchema),
  degraded: z.boolean().optional(),
  providerMeta: providerMetaSchema.optional(),
});

export type UmfSnapshotLive = z.infer<typeof umfSnapshotLiveSchema>;

export const umfMoversLiveSchema = z.object({
  timestamp_utc: z.string().datetime(),
  gainers: z.array(umfAssetLiveSchema),
  losers: z.array(umfAssetLiveSchema),
  degraded: z.boolean().optional(),
});

export type UmfMoversLive = z.infer<typeof umfMoversLiveSchema>;

export const umfMoverSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  class: umfAssetClassEnum,
  image: z.string().url().nullable().optional(),
  direction: z.enum(["gainer", "loser"]),
  changePct24h: z.number(),
  price: z.number().positive(),
  marketCap: z.number().nullable().optional(),
  volume24h: z.number().nullable().optional(),
  updatedAt_utc: z.string().datetime(),
});

export type UmfMover = z.infer<typeof umfMoverSchema>;

export const umfBriefSchema = z.object({
  date_utc: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  headline: z.string().min(10).max(200),
  bullets: z.array(z.string().min(10)).min(1).max(5),
});

export type UmfBrief = z.infer<typeof umfBriefSchema>;

export const umfAlertSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(5).max(100),
  body: z.string().min(10).max(500),
  severity: z.enum(["info", "warn", "high"]),
  createdAt_utc: z.string().datetime(),
});

export type UmfAlert = z.infer<typeof umfAlertSchema>;

// ─── Asset Overview ──────────────────────────────────────────────────────────

export const assetOverviewSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  class: umfAssetClassEnum,
  image: z.string().url().nullable().optional(),
  priceSummary: z
    .object({
      price: z.number().positive(),
      changePct24h: z.number(),
      volume24h: z.number().nonnegative().nullable(),
      marketCap: z.number().nonnegative().nullable(),
      updatedAt_utc: z.string().datetime(),
    })
    .nullable(),
  news: z.array(
    z.object({
      title: z.string(),
      summary: z.string(),
      link: z.string().url(),
      date: z.string().datetime(),
    }),
  ),
  events: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      datetime_utc: z.string().datetime(),
      importance: z.enum(["High", "Medium", "Low"]),
      category: z.string(),
    }),
  ),
  degraded: z.object({
    price: z.boolean(),
    news: z.boolean(),
    events: z.boolean(),
  }),
});

export type AssetOverview = z.infer<typeof assetOverviewSchema>;

// ─── Portfolio Intelligence ───────────────────────────────────────────────────

export const portfolioIntelligenceSchema = z.object({
  id: z.string().optional(),
  ticker: z.string().min(1).toUpperCase(),
  name: z.string().min(1),
  assetType: z.string().min(1),
  entryPrice: z.number().positive(),
  stopLoss: z.union([z.number().positive(), z.null(), z.undefined()]),
  status: z.enum(["Open", "Hold", "Partial", "Closed"]).default("Open"),
  createdAt_utc: z.string().datetime().optional(),
  updatedAt_utc: z.string().datetime().optional(),
  isDeleted: z.boolean().default(false),
  versionNumber: z.number().int().default(1),
});

export type PortfolioIntelligence = z.infer<typeof portfolioIntelligenceSchema>;

export interface PortfolioIntelligenceItem extends PortfolioIntelligence {
  currentPrice: number;
  realizedReturnPct: number;
  dailyPnLPct: number | null;
  snapshotTimestamp_utc: string;
  riskUpdateDate?: string;
  effectiveStopLoss: number;
  stopPhase: "capital_protection" | "profit_protection";
  highWaterMark?: number;
  trailingStopPct?: number;
  closeReason?: string;
}

export const portfolioIntelligenceHistorySchema = z.object({
  id: z.string().optional(),
  portfolioId: z.string().min(1),
  status: z.string(),
  stopLoss: z.number().nullable().optional(),
  changedAt_utc: z
    .string()
    .datetime()
    .default(() => new Date().toISOString()),
  changeType: z.string(),
  versionNumber: z.number().int(),
});

export type PortfolioIntelligenceHistory = z.infer<
  typeof portfolioIntelligenceHistorySchema
>;
export type PortfolioHistory = PortfolioIntelligenceHistory;

// ─── Content / Guru ───────────────────────────────────────────────────────────

export const symbolSectionSchema = z.object({
  section_id: z.string(),
  html_segment: z.string(),
  symbols: z.array(z.string()),
  auto_detected: z.boolean().default(true),
  manual_override: z.boolean().default(false),
  start_offset: z.number().optional(),
  end_offset: z.number().optional(),
  is_placeholder: z.boolean().optional(),
});

export type SymbolSection = z.infer<typeof symbolSectionSchema>;

export const contentItemSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["brief", "alert"]),
  display_name: z.string().min(1),
  uploaded_by: z.string().min(1),
  uploaded_at: z.string().datetime(),
  actual_uploaded_at: z.string().datetime().optional(),
  html_content: z.string().min(1),
  tags: z.array(z.string()).default([]),
  symbols: z.array(z.string()).default([]),
  symbol_sections: z
    .record(z.string(), z.array(symbolSectionSchema))
    .default({}),
  status: z.enum(["published", "unpublished", "draft"]).default("draft"),
  summary: z.string().optional(),
  read_only: z.boolean().default(true),
  version: z.number().default(1),
});

export type ContentItem = z.infer<typeof contentItemSchema>;

export const guruSchema = z.object({
  guruId: z.string().min(1),
  displayName: z.string().min(1),
  entityType: z.enum(["Investor", "Institution", "Analyst", "Insider"]),
  organization: z.string().nullable().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  iconUrl: z.string().nullable().optional(),
  createdBy: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  updatedBy: z.string(),
});

export type Guru = z.infer<typeof guruSchema>;

export const guruInsightSchema = z.object({
  insightId: z.string().min(1),
  guruId: z.string().min(1),
  guruDisplayName: z.string().min(1),
  guruEntityType: z
    .enum(["Investor", "Institution", "Analyst", "Insider"])
    .default("Investor"),
  guruIconUrl: z.string().nullable().optional(),
  assetSymbol: z.string().min(1).toUpperCase(),
  assetClass: z.enum(["Equities", "Crypto", "Commodities", "FX", "Macro"]),
  actionType: z.enum([
    "BUY",
    "SELL",
    "HOLD",
    "UPGRADE",
    "DOWNGRADE",
    "COMMENT",
  ]),
  sourceTimestamp: z.string().datetime(),
  ingestTimestamp: z.string().datetime(),
  summaryText: z.string().min(1),
  sourceUrl: z.string().url().min(1),
  sentiment: z.enum(["Positive", "Neutral", "Negative"]).default("Neutral"),
  themeTags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  versionNumber: z.number().int().default(1),
  searchKeywords: z.array(z.string()).default([]),
  visibilityTier: z.enum(["FREE", "ESSENTIALS"]).default("FREE"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  updatedBy: z.string(),
});

export type GuruInsight = z.infer<typeof guruInsightSchema>;

// ─── Pulse ──────────────────────────────────────────────────────────────────

export const pulseProviderNameEnum = z.enum([
  "coingecko",
  "binance",
  "coinbase",
  "twelvedata",
  "eodhd",
  "yahoo",
  "frankfurter",
  "coin_gecko",
  "twelve_data",
  "yahoo_finance",
]);

export type PulseProviderName = z.infer<typeof pulseProviderNameEnum>;

export const pulseAssetClassEnum = z.enum([
  "crypto",
  "equity",
  "index",
  "commodity",
  "bond",
  "etf",
  "fx",
]);

export type PulseAssetClass = z.infer<typeof pulseAssetClassEnum>;

export const pulseProviderSchema = z.object({
  name: pulseProviderNameEnum,
  priority: z.number().int().min(1).max(3),
  enabled: z.boolean(),
  ticker: z.string().min(1),
});

export type PulseProvider = z.infer<typeof pulseProviderSchema>;

export const pulseRegistryEntrySchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  assetClass: pulseAssetClassEnum,
  active: z.boolean().default(true),
  isHidden: z.boolean().default(false).optional(),
  coinGeckoId: z.string().optional(),
  providers: z.array(pulseProviderSchema).min(1),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PulseRegistryEntry = z.infer<typeof pulseRegistryEntrySchema>;

export const confidenceBadgeSchema = z.enum(["green", "amber", "red"]);
export type ConfidenceBadge = z.infer<typeof confidenceBadgeSchema>;

export const pulseNormalizedEntrySchema = z.object({
  symbol: z.string(),
  name: z.string(),
  assetClass: pulseAssetClassEnum,
  price: z.number().positive(),
  previousClose: z.number().nullable().optional(),
  percentChange24h: z.number().nullable(),
  volume24h: z.number().nullable(),
  marketCap: z.number().nullable(),
  providerUsed: pulseProviderNameEnum,
  providerPriority: z.number().int().min(1).max(3),
  isFallback: z.boolean(),
  baseConfidence: z.number().int().min(0).max(100),
  lastUpdated: z.string().datetime(),
  confidenceScore: z.number().min(0).max(100),
  confidenceBadge: confidenceBadgeSchema,
});

export type PulseNormalizedEntry = z.infer<typeof pulseNormalizedEntrySchema>;

export const pulseSnapshotSchema = z.object({
  timestamp_utc: z.string().datetime(),
  assets: z.array(pulseNormalizedEntrySchema),
  degraded: z.boolean().optional(),
  providerMeta: z
    .record(
      z.string(),
      z.object({
        lastFetch: z.string().datetime(),
        degraded: z.boolean().default(false),
      }),
    )
    .optional(),
});

export type PulseSnapshot = z.infer<typeof pulseSnapshotSchema>;

// ─── Catalyst ───────────────────────────────────────────────────────────────

export const macroEventNameEnum = z.enum([
  "CPI",
  "Core CPI",
  "NFP",
  "FOMC Decision",
  "GDP Advance",
  "PCE",
  "ISM Manufacturing",
  "ISM Services",
  "Retail Sales",
  "Consumer Confidence",
  "Initial Claims",
  "Rate Decision",
  "PMI",
  "Consumer Sentiment",
]);
export type MacroEventName = z.infer<typeof macroEventNameEnum>;

export const macroEventUnitEnum = z.enum([
  "Index",
  "Thousands",
  "$ Millions",
  "%",
]);
export type MacroEventUnit = z.infer<typeof macroEventUnitEnum>;

export const macroVolatilityBucketEnum = z.union([
  z.literal(0),
  z.literal(40),
  z.literal(80),
]);
export type MacroVolatilityBucket = z.infer<typeof macroVolatilityBucketEnum>;

export const macroEventSchema = z.object({
  event_id: z.string().uuid(),
  event_type: z.literal("macro"),
  event_name: macroEventNameEnum,
  country: z.string().default("US"),
  scheduled_time: z.string().datetime(),
  forecast_value: z.number().nullable().optional(),
  previous_value: z.number().nullable().optional(),
  actual_value: z.number().nullable().optional(),
  unit: macroEventUnitEnum,
  volatility_bucket: macroVolatilityBucketEnum,
  source_url: z.string().url(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  impact_score: z.number().min(0).max(100).optional(),
  impact_band: impactBandSchema.optional(),
  bias: biasSchema.optional(),
  bias_override: z.boolean().optional(),
  bias_override_reason: z.string().optional(),
  bias_override_by: z.string().optional(),
  bias_override_at: z.string().datetime().optional(),
  cross_module_trigger: z.boolean().optional(),
  previous_impact_score: z.number().optional(),
  previous_bias: biasSchema.optional(),
  relevance_score: z.number().int().min(0).max(100).optional(),
  relevance_band: impactBandSchema.optional(),
  asset_class_tags: z.array(z.string()).optional(),
  asset_biases: z
    .array(
      z.object({ sector: z.string(), bias: z.enum(["Risk-On", "Risk-Off"]) }),
    )
    .optional(),
  base_impact_score: z.number().optional(),
  score_version: z.string().optional(),
  config_source: z.string().optional(),
  market_impact_score: z.number().optional(),
  policy_sensitivity_score: z.number().optional(),
  sector_sensitivity_score: z.number().optional(),
  index_weight_score: z.number().optional(),
  lifecycle_stage: z
    .enum([
      "scheduled",
      "imminent",
      "live",
      "released",
      "interpreted",
      "expired",
    ])
    .optional(),
  named_triggers: z.array(z.string()).optional(),
});

export type MacroEvent = z.infer<typeof macroEventSchema>;

export const earningsEventSchema = z.object({
  event_id: z.string().uuid(),
  event_type: z.literal("earnings"),
  event_name: z.string(),
  country: z.string().default("US"),
  scheduled_time: z.string().datetime(),
  ticker: z.string(),
  company_name: z.string(),
  sector: z.string(),
  market_cap: z.number().int().optional(),
  fiscal_quarter: z.string(),
  consensus_eps: z.number().nullable().optional(),
  actual_eps: z.number().nullable().optional(),
  eps_surprise_pct: z.number().nullable().optional(),
  outcome_label: z.enum(["Beat", "Miss", "Inline"]).nullable().optional(),
  call_datetime: z.string().datetime().optional(),
  impact_score: z.number().min(0).max(100).optional(),
  impact_band: impactBandSchema.optional(),
  bias: biasSchema.optional(),
  bias_override: z.boolean().optional(),
  bias_override_reason: z.string().optional(),
  bias_override_by: z.string().optional(),
  bias_override_at: z.string().datetime().optional(),
  cross_module_trigger: z.boolean().optional(),
  previous_impact_score: z.number().optional(),
  previous_bias: biasSchema.optional(),
  relevance_score: z.number().int().min(0).max(100).optional(),
  relevance_band: impactBandSchema.optional(),
  asset_class_tags: z.array(z.string()).optional(),
  asset_biases: z
    .array(
      z.object({ sector: z.string(), bias: z.enum(["Risk-On", "Risk-Off"]) }),
    )
    .optional(),
  base_impact_score: z.number().optional(),
  score_version: z.string().optional(),
  config_source: z.string().optional(),
  market_impact_score: z.number().optional(),
  policy_sensitivity_score: z.number().optional(),
  sector_sensitivity_score: z.number().optional(),
  index_weight_score: z.number().optional(),
  lifecycle_stage: z
    .enum([
      "scheduled",
      "imminent",
      "live",
      "released",
      "interpreted",
      "expired",
    ])
    .optional(),
  named_triggers: z.array(z.string()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type EarningsEvent = z.infer<typeof earningsEventSchema>;

export const catalystEventSchema = z.discriminatedUnion("event_type", [
  macroEventSchema,
  earningsEventSchema,
]);

export type CatalystEvent = z.infer<typeof catalystEventSchema>;

export const macroRegimeSchema = z.object({
  inflation_regime: z.enum(["Rising", "Cooling", "Persistent"]),
  liquidity_regime: z.enum(["Expanding", "Neutral", "Tightening"]),
  risk_regime: z.enum(["Risk-On", "Neutral", "Risk-Off"]),
  detected_at: z.string().datetime(),
  changed_at: z.string().datetime().nullable(),
  previous_inflation_regime: z
    .enum(["Rising", "Cooling", "Persistent"])
    .nullable()
    .optional(),
  previous_liquidity_regime: z
    .enum(["Expanding", "Neutral", "Tightening"])
    .nullable()
    .optional(),
  previous_risk_regime: z
    .enum(["Risk-On", "Neutral", "Risk-Off"])
    .nullable()
    .optional(),
  contributing_event_ids: z.array(z.string()),
});

export type MacroRegime = z.infer<typeof macroRegimeSchema>;

export const earningsHeatmapRowSchema = z.object({
  week_start: z.string(),
  sector: z.string(),
  earnings_count: z.number().int(),
  avg_impact_score: z.number().nullable(),
  heatmap_intensity: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  event_ids: z.array(z.string()),
});

export type EarningsHeatmapRow = z.infer<typeof earningsHeatmapRowSchema>;

// ─── Pulse Alerts ───────────────────────────────────────────────────────────

export const alertEvaluationResultSchema = z.object({
  alertId: z.string(),
  symbol: z.string(),
  alertType: z.enum([
    "price_threshold",
    "pct_change",
    "volume_spike",
    "intraday_break",
  ]),
  triggered: z.boolean(),
  currentValue: z.number().nullable(),
  threshold: z.number().nullable(),
  direction: z.enum(["above", "below"]).nullable(),
});

export type AlertEvaluationResult = z.infer<typeof alertEvaluationResultSchema>;

export const createPulseAlertSchema = z.object({
  symbol: z.string().min(1).toUpperCase(),
  alertType: z.enum([
    "price_threshold",
    "pct_change",
    "volume_spike",
    "intraday_break",
  ]),
  threshold: z.number().positive().optional(),
  direction: z.enum(["above", "below"]).optional(),
  enabled: z.boolean().optional().default(true),
});

export const updatePulseAlertSchema = z.object({
  threshold: z.number().positive().optional(),
  direction: z.enum(["above", "below"]).optional(),
  enabled: z.boolean().optional(),
});

export type CreatePulseAlertInput = z.infer<typeof createPulseAlertSchema>;
export type UpdatePulseAlertInput = z.infer<typeof updatePulseAlertSchema>;

export const pulseAlertSchema = createPulseAlertSchema.extend({
  id: z.string().min(1),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type PulseAlert = z.infer<typeof pulseAlertSchema>;

// ─── User Preferences ────────────────────────────────────────────────────────

export const userPreferencesSchema = z.object({
  sectionOrder: z
    .array(z.string())
    .default(["crypto", "equity", "index", "commodity", "bond", "etf", "fx"]),
  hiddenSections: z.array(z.string()).default([]),
  sidebarCollapsed: z.boolean().default(false),
});
export type UserPreferencesData = z.infer<typeof userPreferencesSchema>;

// ─── Pulse EOD Snapshot (Firestore shape) ────────────────────────────────────

export const eodPricePointSchema = z.object({
  date: z.string(),
  open: z.number().optional(),
  high: z.number().optional(),
  low: z.number().optional(),
  close: z.number(),
  volume: z.number().optional(),
});
export type EodPricePoint = z.infer<typeof eodPricePointSchema>;

export const eodAssetHistorySchema = z.object({
  symbol: z.string(),
  assetClass: pulseAssetClassEnum,
  prices: z.array(eodPricePointSchema),
  fiftyTwoWeekHigh: z.number().optional(),
  fiftyTwoWeekLow: z.number().optional(),
  sma50: z.number().optional(),
  sma200: z.number().optional(),
});
export type EodAssetHistory = z.infer<typeof eodAssetHistorySchema>;

export const eodSnapshotSchema = z.object({
  dateUtc: z.string(),
  capturedAt: z.string().datetime(),
  assets: z.array(eodAssetHistorySchema),
});
export type EodSnapshot = z.infer<typeof eodSnapshotSchema>;

// ─── Morning Pulse Brief (Firestore shape) ────────────────────────────────────

export const morningBriefTopMoverSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  assetClass: z.string(),
  percentChange24h: z.number(),
  direction: z.enum(["up", "down"]),
});
export type MorningBriefTopMover = z.infer<typeof morningBriefTopMoverSchema>;

export const watchTodayEventSchema = z.object({
  name: z.string(),
  scheduledTime: z.string(),
  bucket: z.number(),
});
export type WatchTodayEvent = z.infer<typeof watchTodayEventSchema>;

export const marketRegimeSchema = z.enum([
  "risk_on",
  "risk_off",
  "mixed",
  "transition",
  "neutral",
]);
export type MarketRegime = z.infer<typeof marketRegimeSchema>;

export const morningBriefSchema = z.object({
  generatedAt: z.string().datetime(),
  dateFor: z.string(),
  headline: z.string(),
  summary: z.string(),
  topMovers: z.array(morningBriefTopMoverSchema),
  generationMode: z.enum(["template", "ai"]).default("template"),
  briefMode: z.enum(["daily", "weekly_recap"]).default("daily"),
  regime: marketRegimeSchema.optional(),
  watchToday: z.array(watchTodayEventSchema).max(3).optional(),
  watchThisWeek: z.array(watchTodayEventSchema).max(3).optional(),
  noCatalystMode: z.boolean().optional(),
});
export type MorningBrief = z.infer<typeof morningBriefSchema>;

// ─── Whale Watch (Module 4) ──────────────────────────────────────────────────

export const whaleDirectionZod = z.enum(["inflow", "outflow", "transfer"]);
export const walletClassificationZod = z.enum([
  "exchange",
  "fund",
  "custodian",
  "unknown",
]);
export const whaleConfidenceBandZod = z.enum(["low", "medium", "high"]);
export const flowDirectionZod = z.enum(["bullish", "bearish", "neutral"]);
export const crossModuleSignalZod = z.enum(["none", "spike_detected"]);

export const whaleEventSchema = z.object({
  txId: z.string(),
  chain: z.string(),
  assetSymbol: z.string(),
  amountNative: z.number(),
  amountUsd: z.number(),
  fromWallet: z.string(),
  toWallet: z.string(),
  direction: whaleDirectionZod,
  walletClassification: walletClassificationZod,
  timestamp: z.string().datetime(),
  ingestTimestamp: z.string().datetime(),
  confidenceScore: z.number().int().min(0).max(100),
  confidenceBand: whaleConfidenceBandZod,
});
export type WhaleEvent = z.infer<typeof whaleEventSchema>;

export const createWalletTagSchema = z.object({
  walletAddress: z.string().min(1),
  chain: z.string().min(1),
  classification: walletClassificationZod,
  label: z.string().min(1),
});
export type CreateWalletTagInput = z.infer<typeof createWalletTagSchema>;

export const whaleEventsResponseSchema = z.object({
  events: z.array(whaleEventSchema),
  page: z.number().int(),
  pageSize: z.number().int(),
  totalCount: z.number().int(),
  chain: z.string().nullable(),
});
export type WhaleEventsResponse = z.infer<typeof whaleEventsResponseSchema>;

export const netFlowResponseSchema = z.object({
  chain: z.string(),
  netFlowUsd: z.number(),
  baseline7d: z.number(),
  flowSpike: z.boolean(),
  flowDirection: flowDirectionZod,
  confidenceBand: whaleConfidenceBandZod,
  crossModuleSignal: crossModuleSignalZod,
  windowStart: z.string().datetime(),
  windowEnd: z.string().datetime(),
});
export type NetFlowResponse = z.infer<typeof netFlowResponseSchema>;

export const whaleSummarySchema = z.object({
  btc: netFlowResponseSchema.nullable(),
  eth: netFlowResponseSchema.nullable(),
  recentSpikes: z.array(
    z.object({
      chain: z.string(),
      flowDirection: flowDirectionZod,
      netFlowUsd: z.number(),
      baseline7d: z.number(),
      windowStart: z.string().datetime(),
    }),
  ),
  generatedAt: z.string().datetime(),
});
export type WhaleSummary = z.infer<typeof whaleSummarySchema>;

// ─── STREETScore ─────────────────────────────────────────────────────────────

export const streetSignalStateSchema = z.enum([
  "strong_bullish",
  "bullish_improving",
  "neutral_improving",
  "weakening",
  "strong_bearish",
  "none",
]);
export type StreetSignalState = z.infer<typeof streetSignalStateSchema>;

export const streetGradeSchema = z.enum(["A", "B", "C", "D", "F"]);
export type StreetGrade = z.infer<typeof streetGradeSchema>;

export const streetConfidenceBandSchema = z.enum(["High", "Medium", "Low"]);
export type StreetConfidenceBand = z.infer<typeof streetConfidenceBandSchema>;

export const streetScoreEventSchema = z.object({
  ticker: z.string(),
  streetScore: z.number().nullable(),
  grade: streetGradeSchema.nullable(),
  confidenceBand: streetConfidenceBandSchema.nullable(),
  signalState: streetSignalStateSchema,
  ratingStrength: z.number().nullable(),
  targetDeltaScore: z.number().nullable(),
  coverageScore: z.number().nullable(),
  momentumScore: z.number().nullable(),
  recencyScore: z.number().nullable(),
  consensusRating: z.string().nullable(),
  priceTarget: z.number().nullable(),
  lastVendorUpdate: z.string().nullable(),
  vendorStale: z.boolean(),
  computedAt: z.string(),
});
export type StreetScoreEvent = z.infer<typeof streetScoreEventSchema>;

export const streetUniverseEntrySchema = z.object({
  ticker: z.string().max(10),
  companyName: z.string().min(1),
  sector: z.string().max(100).nullable().optional(),
  theme: z.string().max(100).nullable().optional(),
  indexMembership: z.string().max(100).nullable().optional(),
  marketCapUsd: z.number().nullable().optional(),
  advUsd: z.number().nullable().optional(),
  isActive: z.boolean().default(true),
  uploadedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const streetAnalystConsensusManualSchema = z.object({
  ticker: z.string().max(10),
  consensusRating: z.string().max(50),
  analystCount: z.number().int(),
  priceTarget: z.number(),
  currentPrice: z.number(),
  targetDeltaPct: z.number().nullable().optional(),
  dataSource: z.string().max(20).default("MANUAL"),
  uploadedAt: z.string().datetime().optional(),
});

export const streetAnalystActionManualSchema = z.object({
  id: z.number().int().optional(),
  ticker: z.string().max(10),
  action: z.string().max(20),
  analystFirm: z.string().max(200).nullable().optional(),
  actionDate: z.string(),
  dataSource: z.string().max(20).default("MANUAL"),
  uploadedAt: z.string().datetime().optional(),
});

// ─── Module 8 — Arbitrage Scanner ─────────────────────────────────────────────

export const arbitrageGradeSchema = z.enum(["A", "B", "C", "D", "F"]);
export type ArbitrageGrade = z.infer<typeof arbitrageGradeSchema>;

export const arbitrageConfidenceBandSchema = z.enum(["High", "Medium", "Low"]);
export type ArbitrageConfidenceBand = z.infer<
  typeof arbitrageConfidenceBandSchema
>;

export const arbitrageExecutionComplexitySchema = z.enum([
  "Low",
  "Medium",
  "High",
]);
export type ArbitrageExecutionComplexity = z.infer<
  typeof arbitrageExecutionComplexitySchema
>;

export const arbitrageSignalStateSchema = z.enum([
  "Strong",
  "Moderate",
  "Weak",
  "Invalid",
]);
export type ArbitrageSignalState = z.infer<typeof arbitrageSignalStateSchema>;

export const arbitrageFreshnessSchema = z.enum(["fresh", "warm", "stale"]);
export type ArbitrageFreshness = z.infer<typeof arbitrageFreshnessSchema>;

export const arbitrageOpportunitySchema = z.object({
  id: z.string().optional(),
  pair: z.string().min(1),
  buyExchange: z.string().min(1),
  sellExchange: z.string().min(1),
  grossSpreadPct: z.number(),
  netSpreadPct: z.number(),
  buyPrice: z.number().optional(),
  sellPrice: z.number().optional(),
  liquidityCapacityUsd: z.number().nonnegative(),
  executableTradeSizeUsd: z.number().nonnegative(),
  arbitrageScore: z.number().min(0).max(100),
  grade: arbitrageGradeSchema,
  confidenceBand: arbitrageConfidenceBandSchema,
  executionComplexity: arbitrageExecutionComplexitySchema,
  signalState: arbitrageSignalStateSchema,
  freshness: arbitrageFreshnessSchema.optional(),
  lastUpdated: z.string().min(1),
  trend: z.array(z.number()).optional(),
});

export type ArbitrageOpportunity = z.infer<typeof arbitrageOpportunitySchema>;

export const arbitrageOpportunitiesResponseSchema = z.object({
  items: z.array(arbitrageOpportunitySchema),
  updatedAt: z.string().optional(),
});

export type ArbitrageOpportunitiesResponse = z.infer<
  typeof arbitrageOpportunitiesResponseSchema
>;

export const arbitrageSortByApiSchema = z.enum([
  "net_spread_desc",
  "score_desc",
  "liquidity_desc",
]);
export type ArbitrageSortByApi = z.infer<typeof arbitrageSortByApiSchema>;

export const arbitrageOpportunityApiDtoSchema = z.object({
  id: z.string().optional(),
  pair: z.string(),
  buy_exchange: z.string(),
  sell_exchange: z.string(),
  gross_spread_pct: z.number(),
  net_spread_pct: z.number(),
  buy_price: z.number().optional(),
  sell_price: z.number().optional(),
  liquidity_capacity_usd: z.number(),
  /** Present on newer API snapshots; older payloads omit this — map step fills from liquidity. */
  executable_trade_size_usd: z.number().optional(),
  arbitrage_score: z.number(),
  grade: arbitrageGradeSchema,
  confidence_band: arbitrageConfidenceBandSchema,
  signal_state: arbitrageSignalStateSchema,
  execution_complexity: arbitrageExecutionComplexitySchema,
  freshness: arbitrageFreshnessSchema.optional(),
  last_updated: z.string(),
  trend: z.array(z.number()).optional(),
});

export type ArbitrageOpportunityApiDto = z.infer<
  typeof arbitrageOpportunityApiDtoSchema
>;

export const arbitrageOpportunitiesApiMetaSchema = z
  .object({
    total: z.number().int().nonnegative(),
    actionable_count: z.number().int().nonnegative().optional(),
    best_net_spread_pct: z.number().optional(),
    availablePairs: z.array(z.string()).optional(),
    contract_version: z.string().optional(),
    /** If `mismatch`, client should prompt refresh (TRD). */
    contract_status: z.enum(["ok", "mismatch"]).optional(),
    refresh_interval_ms: z.number().int().positive().optional(),
  })
  .passthrough();

export const arbitrageOpportunitiesApiPaginationSchema = z.object({
  nextCursor: z.string().nullable().optional(),
  hasMore: z.boolean(),
  pageSize: z.number().int().positive(),
});

export const arbitrageOpportunitiesApiResponseSchema = z.object({
  opportunities: z.array(arbitrageOpportunityApiDtoSchema),
  meta: arbitrageOpportunitiesApiMetaSchema,
  pagination: arbitrageOpportunitiesApiPaginationSchema,
});

export type ArbitrageOpportunitiesApiResponse = z.infer<
  typeof arbitrageOpportunitiesApiResponseSchema
>;

export function mapArbitrageOpportunityFromApiDto(
  dto: ArbitrageOpportunityApiDto,
): ArbitrageOpportunity {
  return {
    id: dto.id ?? undefined,
    pair: dto.pair,
    buyExchange: dto.buy_exchange,
    sellExchange: dto.sell_exchange,
    grossSpreadPct: dto.gross_spread_pct,
    netSpreadPct: dto.net_spread_pct,
    buyPrice: dto.buy_price,
    sellPrice: dto.sell_price,
    liquidityCapacityUsd: dto.liquidity_capacity_usd,
    executableTradeSizeUsd:
      dto.executable_trade_size_usd ?? dto.liquidity_capacity_usd,
    arbitrageScore: dto.arbitrage_score,
    grade: dto.grade,
    confidenceBand: dto.confidence_band,
    executionComplexity: dto.execution_complexity,
    signalState: dto.signal_state,
    freshness: dto.freshness,
    lastUpdated: dto.last_updated,
    trend: dto.trend,
  };
}

// ─── Module 9 — Copy Trade Finder ────────────────────────────────────────────

export const copyTradeGradeSchema = z.enum(["A", "B", "C", "D", "F"]);
export type CopyTradeGrade = z.infer<typeof copyTradeGradeSchema>;

export const copyTradeConfidenceBandSchema = z.enum(["High", "Medium", "Low"]);
export type CopyTradeConfidenceBand = z.infer<
  typeof copyTradeConfidenceBandSchema
>;

export const copyTradeSignalStateSchema = z.enum([
  "Strong",
  "Moderate",
  "Weak",
  "Invalid",
]);
export type CopyTradeSignalState = z.infer<typeof copyTradeSignalStateSchema>;

export const copyTradeLifecycleStateSchema = z.enum([
  "active",
  "inactive",
  "reintroduced",
]);
export type CopyTradeLifecycleState = z.infer<
  typeof copyTradeLifecycleStateSchema
>;

export const copyTradeSortByApiSchema = z.enum([
  "rank_desc",
  "rank_asc",
  "score_desc",
  "score_asc",
  "momentum_desc",
  "momentum_asc",
  "last_seen_desc",
  "last_seen_asc",
]);
export type CopyTradeSortByApi = z.infer<typeof copyTradeSortByApiSchema>;

/** Single row from GET `/api/copytrade/history/:id`. */
export const copyTradeHistoryRecordSchema = z
  .object({
    snapshot_date: z.string().min(1),
    raw_score: z.coerce.number(),
    ema_score: z.coerce.number(),
    grade: z.string().optional(),
    confidence_band: z.string().optional(),
    signal_state: z.string().optional(),
    rank_at_time: z.coerce.number().int().nullable().optional(),
    roi_total_pct: z.coerce.number().optional(),
    max_drawdown_pct: z.coerce.number().optional(),
  })
  .passthrough();
export type CopyTradeHistoryRecord = z.infer<
  typeof copyTradeHistoryRecordSchema
>;

export const copyTradeHistoryApiResponseSchema = z
  .object({
    trader_id: z.string(),
    days_requested: z.coerce.number().optional(),
    record_count: z.coerce.number().optional(),
    history: z.array(copyTradeHistoryRecordSchema).catch([]),
    disclaimer: z.string().optional(),
  })
  .passthrough();
export type CopyTradeHistoryApiResponse = z.infer<
  typeof copyTradeHistoryApiResponseSchema
>;

export const copyTradeCapacityFlagSchema = z.enum(["Low", "Medium", "High"]);
export type CopyTradeCapacityFlag = z.infer<typeof copyTradeCapacityFlagSchema>;

export const copyTradeTraderApiDtoSchema = z
  .object({
    trader_id: z.string().min(1).catch("UNKNOWN"),
    handle: z.string().min(1).catch("Unknown Trader"),
    computed_rank: z.coerce.number().int().positive().catch(9_999),
    rank_change_7d: z.union([z.coerce.number().int(), z.null()]).optional(),
    grade: copyTradeGradeSchema.catch("C"),
    signal_state: copyTradeSignalStateSchema.catch("Weak"),
    confidence_band: copyTradeConfidenceBandSchema.catch("Medium"),
    risk_level: z.enum(["Low", "Medium", "High"]).optional(),
    ema_score: z.coerce.number().min(0).max(100).catch(0),
    raw_score: z.coerce.number().min(0).max(100).optional(),
    score_momentum: z.coerce.number().catch(0),
    lifecycle_state: copyTradeLifecycleStateSchema.catch("inactive"),
    last_seen_at: z.string().optional(),
    generatedAt: z.string().optional(),
    fetched_at: z.string().optional(),
    profile_tag: z.string().optional(),
    capacity_flag: copyTradeCapacityFlagSchema.optional(),
    roi_total_pct: z.coerce.number().optional(),
    max_drawdown_pct: z.coerce.number().optional(),
    months_active: z.coerce.number().optional(),
    total_trades: z.coerce.number().optional(),
    raw_metrics: z.record(z.unknown()).optional(),
    sub_scores: z.record(z.unknown()).optional(),
    score_explanation_summary: z.record(z.unknown()).optional(),
    behavioral_tags: z.array(z.string()).optional(),
  })
  .passthrough();
export type CopyTradeTraderApiDto = z.infer<typeof copyTradeTraderApiDtoSchema>;

export const copyTradeLeaderboardApiResponseSchema = z
  .object({
    traders: z.array(copyTradeTraderApiDtoSchema).catch([]),
    trader_count: z.coerce.number().int().nonnegative().nullish(),
    snapshot_id: z.string().nullish(),
    generatedAt: z.string().nullish(),
    snapshot_stale: z.boolean().nullish(),
    disclaimer: z.string().nullish(),
    meta: z
      .object({
        total: z.coerce.number().optional(),
        snapshot_id: z.string().optional(),
        generatedAt: z.string().optional(),
        is_stale: z.boolean().optional(),
        age_seconds: z.coerce.number().optional(),
        tier_restricted: z.boolean().optional(),
      })
      .passthrough()
      .optional(),
    pagination: z
      .object({
        nextCursor: z.string().nullable().optional(),
        pageSize: z.coerce.number().nullable().optional(),
        hasMore: z.boolean().nullable().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform((payload) => {
    const meta = payload.meta as Record<string, unknown> | undefined;
    const totalFromMeta =
      meta && typeof meta.total === "number" ? meta.total : undefined;
    return {
      ...payload,
      trader_count:
        payload.trader_count ?? totalFromMeta ?? payload.traders.length,
      snapshot_id:
        payload.snapshot_id ??
        (meta && typeof meta.snapshot_id === "string"
          ? meta.snapshot_id
          : undefined),
      generatedAt:
        payload.generatedAt ??
        (meta && typeof meta.generatedAt === "string"
          ? meta.generatedAt
          : undefined),
      snapshot_stale: payload.snapshot_stale ?? undefined,
      disclaimer: payload.disclaimer ?? undefined,
    };
  });
export type CopyTradeLeaderboardApiResponse = z.infer<
  typeof copyTradeLeaderboardApiResponseSchema
>;

export const copyTradeTraderSchema = z.object({
  traderId: z.string().min(1),
  handle: z.string().min(1),
  computedRank: z.number().int().positive(),
  rankChange7d: z.number().int().nullable(),
  grade: copyTradeGradeSchema,
  signalState: copyTradeSignalStateSchema,
  confidenceBand: copyTradeConfidenceBandSchema,
  score: z.number().min(0).max(100),
  momentum: z.number(),
  profileTag: z.string().nullable(),
  capacityFlag: copyTradeCapacityFlagSchema.nullable(),
  lifecycleState: copyTradeLifecycleStateSchema,
  lastSeenAt: z.string(),
});
export type CopyTradeTrader = z.infer<typeof copyTradeTraderSchema>;

function pickIsoTimestamp(
  ...candidates: (string | undefined | null)[]
): string {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 0) return c.trim();
  }
  return new Date(0).toISOString();
}

export function mapCopyTradeTraderFromApiDto(
  dto: CopyTradeTraderApiDto,
): CopyTradeTrader {
  return {
    traderId: dto.trader_id,
    handle: dto.handle,
    computedRank: dto.computed_rank,
    rankChange7d: dto.rank_change_7d ?? null,
    grade: dto.grade,
    signalState: dto.signal_state,
    confidenceBand: dto.confidence_band,
    score: dto.ema_score,
    momentum: dto.score_momentum,
    profileTag: dto.profile_tag ?? null,
    capacityFlag: dto.capacity_flag ?? null,
    lifecycleState: dto.lifecycle_state,
    lastSeenAt: pickIsoTimestamp(
      dto.last_seen_at,
      dto.generatedAt,
      dto.fetched_at,
    ),
  };
}
