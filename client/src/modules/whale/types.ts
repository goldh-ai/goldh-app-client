/**
 * Whale Watch — Client-Side Types
 *
 * Mirrors API response shapes from GET /api/whale/events and GET /api/whale/netflow.
 */

export type WhaleDirection = 'inflow' | 'outflow' | 'transfer';
export type WalletClassification = 'exchange' | 'fund' | 'custodian' | 'unknown';
export type ConfidenceBand = 'low' | 'medium' | 'high';
export type FlowDirection = 'bullish' | 'bearish' | 'neutral';
export type CrossModuleSignal = 'none' | 'spike_detected';

export interface WhaleEvent {
    txId: string;
    chain: string;
    assetSymbol: string;
    amountNative: number;
    amountUsd: number;
    fromWallet: string;
    toWallet: string;
    direction: WhaleDirection;
    walletClassification: WalletClassification;
    timestamp: string;
    ingestTimestamp: string;
    confidenceScore: number;
    confidenceBand: ConfidenceBand;
}

export interface WhaleEventsResponse {
    events: WhaleEvent[];
    page: number;
    pageSize: number;
    totalCount: number;
    chain: string | null;
}

export interface NetFlowResponse {
    chain: string;
    netFlowUsd: number;
    baseline7d: number;
    flowSpike: boolean;
    flowDirection: FlowDirection;
    confidenceBand: ConfidenceBand;
    crossModuleSignal: CrossModuleSignal;
    windowStart: string;
    windowEnd: string;
}

export interface WhaleEventsFilter {
    chain?: string;
    direction?: WhaleDirection;
    walletType?: WalletClassification;
    page?: number;
    pageSize?: number;
}
