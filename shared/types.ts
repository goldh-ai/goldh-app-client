/**
 * shared/types.ts — Browser-safe type re-exports
 *
 * This file acts as the primary entry point for the UI/Client to consume
 * shared Zod schemas and TypeScript types.
 *
 * NOTE: In the 'goldh-app-client' repo, this file imports from ./schema (which
 * is a shim re-exporting from ./contracts).
 */

// ─── Core ───────────────────────────────────────────────────────────────────

export { planTierSchema } from './schema';
export type { PlanTier } from './schema';

export type { RegistryAsset, RegistryData } from './schema';
export type { NewsArticle, LearningTopic } from './schema';

export { signUpSchema } from './schema';
export type { SignUpData } from './schema';

// ─── UMF (Universal Market Financials) ──────────────────────────────────────

export {
  umfSnapshotSchema,
  umfSnapshotLiveSchema,
  umfMoverSchema,
  umfMoversLiveSchema,
  umfBriefSchema,
  umfAlertSchema,
} from './schema';

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
} from './schema';

// ─── Economic Calendar ────────────────────────────────────────────────────────

export { econEventSchema } from './schema';
export type { EconEvent } from './schema';

// ─── Asset / Portfolio ────────────────────────────────────────────────────────

export type { AssetOverview } from './schema';
export type {
  PortfolioIntelligenceItem,
  PortfolioHistory,
  PortfolioIntelligence,
  PortfolioIntelligenceHistory,
} from './schema';

// ─── Content / Guru ───────────────────────────────────────────────────────────

export type { ContentItem } from './schema';
export type { Guru, GuruInsight } from './schema';

// ─── Pulse ────────────────────────────────────────────────────────────────────

export { pulseAssetClassEnum, pulseProviderNameEnum } from './schema';
export type { PulseAssetClass, PulseProviderName } from './schema';
export type { PulseRegistryEntry } from './schema';

export { createPulseAlertSchema, updatePulseAlertSchema, alertEvaluationResultSchema } from './schema';
export type {
  PulseAlert,
  CreatePulseAlertInput,
  UpdatePulseAlertInput,
  AlertEvaluationResult,
} from './schema';

export type { MorningBrief, MorningBriefTopMover } from './schema';

// ─── Catalyst ─────────────────────────────────────────────────────────────────

export type {
  MacroEvent,
  MacroEventName,
  EarningsEvent,
  CatalystEvent,
  EarningsHeatmapRow,
} from './schema';

export { earningsHeatmapRowSchema } from './schema';

// ─── Whale Watch ──────────────────────────────────────────────────────────────
// Whale types are defined in client/src/modules/whale/types.ts — not imported
// from @shared directly by any client file.
