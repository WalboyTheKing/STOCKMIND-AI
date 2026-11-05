export type BackingType =
  | '1:1 SEC-Registered Custody'
  | '1:1 Swiss DLT Collateralized'
  | 'Overcollateralized Synthetic'
  | 'Testnet Sandbox Derivative';

export type IssuerType = 'Dinari' | 'Backed Finance' | 'Synthetix' | 'xBacked' | 'Community Track';

export interface EconomicRights {
  dividendMechanism: string;
  hasVotingRights: boolean;
  votingDetails: string;
  redemptionTerms: string;
  minimumRedemptionLot: string;
  custodianEntity: string;
  bankruptcyRemote: boolean;
  jurisdiction: string;
  transferRestrictions: string;
  sanctionsOracleAddress?: string;
  legalTermsUrl?: string;
}

export interface FinancialFundamentals {
  underlyingMarketCap: string;
  peRatio?: number;
  forwardPe?: number;
  dividendYield?: number;
  beta5Y: number;
  weekRange52: { low: number; high: number };
  quarterlyRevenueGrowth?: string;
  earningsPerShare?: number;
  navPerToken: number;
  dexPoolTvl: string;
  dexLiquidityBase: string;
  correlationBtc: number;
}

export interface ContractAuditReport {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  totalSupplyFormatted: string;
  bytecodeBytes: number;
  proxyType: 'ERC-1967 TransparentUpgradeableProxy' | 'ERC-1967 BeaconProxy' | 'Direct Non-Proxy';
  implementationAddress: string;
  beaconAddress?: string;
  adminAddress?: string;
  ownerAddress?: string;
  isPaused: boolean;
  isVerifiedOnchain: boolean;
  economicRights: EconomicRights;
  fundamentals?: FinancialFundamentals;
  baseScanContractUrl: string;
  baseScanLogicUrl?: string;
}

export interface TokenizedStock {
  id: string;
  symbol: string;
  underlyingTicker: string;
  name: string;
  sector: string;
  issuer: IssuerType;
  backingType: BackingType;
  addressBase: `0x${string}`;
  decimals: number;
  chain: 'Base Mainnet' | 'Base Sepolia';
  priceUsd: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  dataSource: 'Verified Onchain + Real-Time Oracle' | 'Verified Onchain Read' | 'Demo Market Simulation';
  isSecRegistered: boolean;
  redemptionEligible: boolean;
  proofOfReservesUrl: string;
  baseScanUrl: string;
  cusip: string;
  riskRating: 'Low' | 'Moderate' | 'Elevated';
  description: string;
  historicalPrices: { time: string; price: number }[];
  marketDepth: {
    bid: number;
    ask: number;
    spreadPercent: number;
  };
  fundamentals?: FinancialFundamentals;
  auditDetails?: ContractAuditReport;
}

export interface PortfolioPosition {
  tokenAddress: string;
  symbol: string;
  name: string;
  amount: number;
  priceUsd: number;
  valueUsd: number;
  allocationPercent: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  isLiveOnchain: boolean;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  type: 'portfolio' | 'research' | 'monitoring' | 'risk' | 'transaction';
  description: string;
  status: 'idle' | 'running' | 'completed' | 'requires_approval' | 'error';
  lastRun?: string;
  executionSteps: {
    title: string;
    status: 'pending' | 'running' | 'done' | 'error';
    detail: string;
    timestamp?: string;
  }[];
  outputSummary?: string;
  reasoningTrace?: string[];
  sourceProvenance?: string[];
  suggestedAction?: {
    type: 'rebalance' | 'hedge' | 'review' | 'approve';
    title: string;
    requiresApproval: boolean;
    estimatedGas: string;
  };
}

export interface AutomationRule {
  id: string;
  title: string;
  type: 'price_threshold' | 'contract_pause' | 'whale_movement' | 'rebalance_proposal' | 'weekly_digest';
  targetAsset: string;
  condition: string;
  thresholdValue: string;
  action: 'notify_only' | 'propose_transaction' | 'generate_memo';
  isActive: boolean;
  requiresSignature: boolean;
  lastTriggered: string | null;
  createdAt: string;
}

export interface OnchainTx {
  hash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  assetSymbol: string;
  amount: string;
  type: 'Transfer' | 'Mint' | 'Burn' | 'Swap' | 'Approve';
  status: 'confirmed' | 'pending' | 'failed';
  gasFeeUsd: string;
  baseScanUrl: string;
  decodedIntent?: string;
}

export interface OnchainTransferEvent {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  valueRaw: string;
  tokenAddress: string;
  baseScanUrl: string;
}

export interface ResearchMemo {
  id: string;
  title: string;
  assetSymbol: string;
  issuer: string;
  rating: 'Overweight' | 'Neutral' | 'Underweight';
  summary: string;
  fullContent: string;
  generatedAt: string;
  analyst: string;
  tags: string[];
}

export interface NetworkTelemetry {
  chainId: number;
  chainName: string;
  blockNumber: string;
  gasPriceGwei: string;
  status: 'active' | 'degraded' | 'offline';
  rpcEndpoint: string;
  explorerUrl: string;
  tps: number;
}
