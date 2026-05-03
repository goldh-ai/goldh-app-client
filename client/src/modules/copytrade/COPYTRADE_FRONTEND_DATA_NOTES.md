# Copy Trade — frontend data behaviour (reference)

**Rule:** **`shared/contracts.ts`** and **`shared/types.ts`** are canonical. When the backend DTOs and API docs are final, the UI should **show those fields** and **stop using** any client-only substitute for the same thing. While the backend is still incomplete, we either use the explicit **temporary behaviours below (Half A)** or **empty / —** — we **do not** invent business classifications (grade, risk tier, fake profile labels, etc.).

Paths are relative to `client/src/modules/copytrade/` unless noted.

---

## Half A — Temporary substitutes (remove or replace when the contract catches up)

These exist **only because** an endpoint, field, or dataset is missing, mock-only, or not yet stable. Prefer **deleting** the substitute and **rendering from the API** once Santosh’s contract matches.

### A.1 Recommended action (client-derived until API owns it)

| Item            | Location                            | Behaviour                                                                                                                                                                                                                       |
| --------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Action + reason | `lib/copyTradeRecommendedAction.ts` | **`getCopyTradeRecommendedAction`** derives **FOLLOW / SELECTIVE / MONITOR / AVOID** from **`grade` × `confidenceBand`** only. **`reason`** is static copy per action. There is **no** `recommended_action` from the API today. |

**When the API returns an official recommendation:** make this a **pass-through** and remove the rule table (see comment in that file).

### A.2 Top score drivers — fallback when `top_3_drivers` is empty

| Item           | Location                                                                                    | Behaviour                                                                                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pseudo-drivers | `components/copyTradeDetailSections/ScoreDriversBlock.tsx` → `fallbackDriversFromSubscores` | If **`detail.topDrivers.length === 0`**, the UI builds up to **3** rows from **`detail.subscores`** (excludes labels containing “penalty” / “override”), with **`delta: null`** and **`raw`** like `"Label (value)"`. |

**When `top_3_drivers` is always populated:** remove or flag-gate this fallback.

### A.3 Mock mode (fixtures, not production API)

| Item                                 | Location                                                                                                            | Behaviour                                                                                                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Leaderboard + detail                 | `hooks/useCopyTradeTraders.ts`, `hooks/useCopyTradeTraderDetail.ts`, `@/lib/copyTradeMock`, `@/mock/copytrade.mock` | When mock is enabled, list and detail come from **fixtures**, not live fetches (or history queries are skipped).                                                               |
| Synthetic score trends (mock detail) | `hooks/useCopyTradeTraderDetail.ts` → `mergeMockChartDetail`, `numericHistoryToTrend`                               | **`scoreTrend30` / `scoreTrend90` / `scoreTrend365`** are **generated** from legacy **`history30d` / `history90d`** with **synthetic dates** (walking backwards from “today”). |

**Production:** run with mock off when real APIs exist; keep fixtures for Storybook / e2e if useful.

### A.4 Detail payload missing identity (corrupt / edge payload)

| Item                 | Location                                                     | Behaviour                                                                                                                                                                      |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Placeholder identity | `lib/copyTradeDetail.ts` → `buildCopyTradeDetailFromPayload` | If both API and optional **`baseTrader`** fail to supply **`traderId` / `handle`**, the builder uses **`"UNKNOWN"`** and **`"Unknown Trader"`** so the object still validates. |

Last-resort only — not a product feature.

---

## Outstanding wire gaps (backend completes these — no extra “Half B” doc)

Until these are reliably returned and typed in the shared contract, the UI may show **—**, merge from the **leaderboard row** where agreed, or rely on **A.1 / A.2** above — not invented values.

| Area                                                                           | Notes                                                                            |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **`risk_level`** on trader detail                                              | Needed for the risk strip tiers; until then **—**.                               |
| **`grade` / `confidence_band` / `signal_state` / `lifecycle_state`** on detail | Optional on detail; merge from list row when useful; never client literals.      |
| **`top_3_drivers`**                                                            | See **A.2**.                                                                     |
| **Official `recommended_action`**                                              | See **A.1**.                                                                     |
| **History / chart series**                                                     | Live history endpoint + agreed shape; merge/clamps in code stay mechanical only. |

Implementation details (normalisers, chart clamps, merge helpers) live in **`lib/copyTradeDetail.ts`**, **`lib/copyTradeApi.ts`**, **`lib/copyTradeHistoryTransforms.ts`** — **no need to duplicate here**; update code comments if behaviour changes.

---

_Last reviewed: contract-first stance; Half A only for temporary substitutes. Update when fallbacks are removed or contracts change._
