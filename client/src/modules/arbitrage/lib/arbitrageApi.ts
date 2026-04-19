import {
  arbitrageOpportunitiesApiResponseSchema,
  mapArbitrageOpportunityFromApiDto,
  type ArbitrageOpportunity,
  type ArbitrageOpportunitiesApiResponse,
  type ArbitrageSortByApi,
} from "@shared/types";
import { apiUrl } from "@/lib/queryClient";

const OPPORTUNITIES_PATH = "/api/v1/arbitrage/opportunities";

export class ArbitrageHttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ArbitrageHttpError";
    this.status = status;
  }
}

export type FetchArbitragePageArgs = {
  pair: string;
  grade: string;
  confidence: string;
  signal: string;
  sortBy: ArbitrageSortByApi;
  pageSize: number;
  cursor?: string | null;
};

function buildArbitrageQueryString(args: FetchArbitragePageArgs): string {
  const params = new URLSearchParams();
  const pair = args.pair.trim();
  if (pair) params.set("pair", pair);
  if (args.grade && args.grade !== "all") params.set("grade", args.grade);
  if (args.confidence && args.confidence !== "all")
    params.set("confidenceBand", args.confidence);
  if (args.signal && args.signal !== "all")
    params.set("signalState", args.signal);
  params.set("sortBy", args.sortBy);
  params.set("pageSize", String(args.pageSize));
  if (args.cursor) params.set("cursor", args.cursor);
  const q = params.toString();
  return q ? `?${q}` : "";
}

export type ArbitrageFetchedPage = {
  opportunities: ArbitrageOpportunity[];
  raw: ArbitrageOpportunitiesApiResponse;
};

function getAuthHeaders(): Record<string, string> {
  const sessionId =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("sessionId")
      : null;
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

export async function fetchArbitrageOpportunitiesPage(
  args: FetchArbitragePageArgs,
): Promise<ArbitrageFetchedPage> {
  const qs = buildArbitrageQueryString(args);
  const url = apiUrl(`${OPPORTUNITIES_PATH}${qs}`);

  const res = await fetch(url, {
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (res.status === 503) {
    throw new ArbitrageHttpError(
      503,
      "Arbitrage snapshot is being regenerated. Retry shortly.",
    );
  }
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new ArbitrageHttpError(res.status, text);
  }

  const json: unknown = await res.json();
  const parsed = arbitrageOpportunitiesApiResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(
      `Arbitrage API response did not match contract: ${parsed.error.message}`,
    );
  }

  const body = parsed.data;
  const opportunities = body.opportunities.map(
    mapArbitrageOpportunityFromApiDto,
  );
  return { opportunities, raw: body };
}

export async function fetchAllArbitrageOpportunities(
  args: Omit<FetchArbitragePageArgs, "cursor">,
): Promise<ArbitrageFetchedPage> {
  const merged: ArbitrageOpportunity[] = [];
  let cursor: string | null = null;
  let lastRaw: ArbitrageOpportunitiesApiResponse | undefined;
  const maxPages = 500;

  for (let p = 0; p < maxPages; p++) {
    const page = await fetchArbitrageOpportunitiesPage({ ...args, cursor });
    merged.push(...page.opportunities);
    lastRaw = page.raw;
    if (!page.raw.pagination.hasMore) break;
    const next = page.raw.pagination.nextCursor;
    if (!next || next.length === 0) break;
    cursor = next;
  }

  if (!lastRaw) {
    throw new Error("fetchAllArbitrageOpportunities: empty response");
  }

  return {
    opportunities: merged,
    raw: lastRaw,
  };
}
