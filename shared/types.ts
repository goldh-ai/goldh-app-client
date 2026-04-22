/** Browser-safe type re-exports — UI entry point for shared Zod schemas and types. */

// ─── Core ───────────────────────────────────────────────────────────────────

export { planTierSchema } from "./schema";
export type { PlanTier } from "./schema";

export type { RegistryAsset, RegistryData } from "./schema";
export type { NewsArticle, LearningTopic } from "./schema";

export { signUpSchema } from "./schema";
export type { SignUpData } from "./schema";

// ─── UMF (Universal Market Financials) ──────────────────────────────────────

export {
  umfSnapshotSchema,
  umfSnapshotLiveSchema,
  umfMoverSchema,
  umfMoversLiveSchema,
  umfBriefSchema,
  umfAlertSchema,
} from "./schema";

export type {
  UmfAsset,
  UmfMover,
  UmfSnapshot,
  UmfBrief,
  UmfAlert,
  UmfAssetLive,
  UmfSnapshotLive,
  UmfMoversLive,
  UmfAssetClass,
} from "./schema";

// ─── Economic Calendar ────────────────────────────────────────────────────────

export { econEventSchema } from "./schema";
export type { EconEvent } from "./schema";

// ─── Asset / Portfolio ────────────────────────────────────────────────────────

export type { AssetOverview } from "./schema";
export type {
  PortfolioIntelligenceItem,
  PortfolioHistory,
  PortfolioIntelligence,
  PortfolioIntelligenceHistory,
} from "./schema";

// ─── Content / Guru ───────────────────────────────────────────────────────────

export type { ContentItem } from "./schema";
export type { Guru, GuruInsight } from "./schema";

// ─── Pulse ────────────────────────────────────────────────────────────────────

export { pulseAssetClassEnum, pulseProviderNameEnum } from "./schema";
export type { PulseAssetClass, PulseProviderName } from "./schema";
export type { PulseRegistryEntry } from "./schema";

export {
  createPulseAlertSchema,
  updatePulseAlertSchema,
  alertEvaluationResultSchema,
  pulseAlertSchema,
} from "./schema";
export type {
  PulseAlert,
  CreatePulseAlertInput,
  UpdatePulseAlertInput,
  AlertEvaluationResult,
} from "./schema";

export type { MorningBrief, MorningBriefTopMover } from "./schema";

// ─── Catalyst ─────────────────────────────────────────────────────────────────

export type {
  MacroEvent,
  MacroEventName,
  EarningsEvent,
  CatalystEvent,
  EarningsHeatmapRow,
} from "./schema";

export { earningsHeatmapRowSchema } from "./schema";

// ─── Arbitrage Scanner (Module 8) ───────────────────────────────────────────

export {
  arbitrageOpportunitySchema,
  arbitrageOpportunitiesResponseSchema,
  arbitrageOpportunitiesApiResponseSchema,
  arbitrageOpportunityApiDtoSchema,
  arbitrageOpportunitiesApiMetaSchema,
  arbitrageOpportunitiesApiPaginationSchema,
  arbitrageSortByApiSchema,
  arbitrageFreshnessSchema,
  arbitrageGradeSchema,
  arbitrageConfidenceBandSchema,
  arbitrageExecutionComplexitySchema,
  arbitrageSignalStateSchema,
  mapArbitrageOpportunityFromApiDto,
} from "./schema";

export type {
  ArbitrageOpportunity,
  ArbitrageOpportunitiesResponse,
  ArbitrageOpportunitiesApiResponse,
  ArbitrageOpportunityApiDto,
  ArbitrageSortByApi,
  ArbitrageFreshness,
  ArbitrageGrade,
  ArbitrageConfidenceBand,
  ArbitrageExecutionComplexity,
  ArbitrageSignalState,
} from "./schema";

// ─── Copy Trade Finder (Module 9) ───────────────────────────────────────────

export {
  copyTradeTraderSchema,
  copyTradeTraderApiDtoSchema,
  copyTradeLeaderboardApiResponseSchema,
  copyTradeSortByApiSchema,
  copyTradeGradeSchema,
  copyTradeConfidenceBandSchema,
  copyTradeSignalStateSchema,
  copyTradeLifecycleStateSchema,
  mapCopyTradeTraderFromApiDto,
} from "./schema";

export type {
  CopyTradeTrader,
  CopyTradeTraderApiDto,
  CopyTradeLeaderboardApiResponse,
  CopyTradeSortByApi,
  CopyTradeGrade,
  CopyTradeConfidenceBand,
  CopyTradeSignalState,
  CopyTradeLifecycleState,
} from "./schema";

// ─── Whale Watch ──────────────────────────────────────────────────────────────
