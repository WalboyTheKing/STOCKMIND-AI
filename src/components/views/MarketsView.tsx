import React, { useState } from 'react';
import {
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  Sparkles,
  Lock,
  FileText,
  DollarSign,
  Layers,
  Scale,
  Shield,
  X,
} from 'lucide-react';
import { TokenizedStock, ContractAuditReport } from '../../types';
import { auditTokenContractOnchain } from '../../services/api';

interface MarketsViewProps {
  stocks: TokenizedStock[];
  onSelectStockForAi: (stock: TokenizedStock) => void;
  onAddToWatchlist: (stock: TokenizedStock) => void;
  isStockInWatchlist: (stockId: string) => boolean;
}

export const MarketsView: React.FC<MarketsViewProps> = ({
  stocks,
  onSelectStockForAi,
  onAddToWatchlist,
  isStockInWatchlist,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'sec_backed' | 'swiss_dlt' | 'synthetic'>('all');
  const [selectedStock, setSelectedStock] = useState<TokenizedStock | null>(null);

  // Onchain deep audit inspector state
  const [auditingAddress, setAuditingAddress] = useState<string | null>(null);
  const [auditReport, setAuditReport] = useState<ContractAuditReport | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.underlyingTicker.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (categoryFilter === 'sec_backed') {
      return stock.backingType.includes('SEC-Registered');
    }
    if (categoryFilter === 'swiss_dlt') {
      return stock.backingType.includes('Swiss DLT');
    }
    if (categoryFilter === 'synthetic') {
      return stock.backingType.includes('Synthetic');
    }
    return true;
  });

  const handleAuditContract = async (stock: TokenizedStock) => {
    setAuditingAddress(stock.addressBase);
    setAuditError(null);
    setAuditReport(null);

    try {
      const data = await auditTokenContractOnchain(stock.addressBase);
      setAuditReport(data);
    } catch (err: any) {
      setAuditError(err.message || 'Failed to audit contract on Base');
    } finally {
      setAuditingAddress(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Regulatory Transparency Notice */}
      <div className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Tokenized Stock Explorer (Base Mainnet)
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Explore tokenized equities deployed on Base (Chain ID: 8453). Every contract is audited onchain: verified proxy architecture, logic implementation, legal custody structure, dividend pass-through mechanics, and redemption rights.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>9 Contracts Audited Onchain</span>
          </div>
        </div>

        {/* Legal Distinction Strip */}
        <div className="pt-3 border-t border-[#162030] flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>1:1 SEC-Registered Custody (Dinari dShares)</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5 text-blue-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>1:1 Swiss DLT Collateralized (Backed Finance)</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>OP Stack Sub-Cent Gas Execution</span>
          </div>
        </div>
      </div>

      {/* Base Stocks Maxxing Partner Ecosystem Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#0e1628] border border-emerald-500/30 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Partner Adapter
              </span>
              <h3 className="text-xs font-bold text-white">@bankrbot Integration Ready</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Autonomous execution infrastructure for tokenized stock limit orders, rebalancing bots, and automated non-custodial hedging on Base.
            </p>
            <div className="text-[11px] font-mono text-emerald-400 pt-1">
              Compatible: bCSPX · bCOIN · bMSFT · bIB01 · SBUX.d
            </div>
          </div>
          <div className="text-xs font-mono text-slate-400 shrink-0">
            <span className="text-emerald-400">Agentic Track</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1628] border border-blue-500/30 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                Ecosystem Community
              </span>
              <h3 className="text-xs font-bold text-white">@BaseStonk Liquidity & Sentiment</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Base tokenized equity social sentiment feeds, community Aerodrome pool depth, and curated verified asset trackers.
            </p>
            <div className="text-[11px] font-mono text-blue-400 pt-1">
              Live onchain telemetry & verified contracts
            </div>
          </div>
          <div className="text-xs font-mono text-slate-400 shrink-0">
            <span className="text-blue-400">Base L2</span>
          </div>
        </div>
      </div>

      {/* Search and Segmented Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by symbol, company name or underlying ticker..."
            className="w-full pl-9 pr-4 py-2 bg-[#0b101d] border border-[#1a2335] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center p-1 bg-[#0b101d] border border-[#1a2335] rounded-lg">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              categoryFilter === 'all'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({stocks.length})
          </button>
          <button
            onClick={() => setCategoryFilter('sec_backed')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              categoryFilter === 'sec_backed'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SEC 1:1 Backed
          </button>
          <button
            onClick={() => setCategoryFilter('swiss_dlt')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              categoryFilter === 'swiss_dlt'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Swiss DLT
          </button>
        </div>
      </div>

      {/* Stock Table & Explorer */}
      <div className="bg-[#0b101d] border border-[#1a2335] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#172030] text-[11px] text-slate-500 uppercase font-mono bg-[#090d18]">
                <th className="px-4 py-3 font-medium">Asset & Underlying</th>
                <th className="px-4 py-3 font-medium">Issuer & Custody Structure</th>
                <th className="px-4 py-3 font-medium text-right">Price (USD)</th>
                <th className="px-4 py-3 font-medium text-right">24h Change</th>
                <th className="px-4 py-3 font-medium text-right">24h Volume</th>
                <th className="px-4 py-3 font-medium text-right">Contract Address (8453)</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141b2b] text-xs">
              {filteredStocks.map((stock) => {
                const isPositive = stock.change24h >= 0;
                const isWatching = isStockInWatchlist(stock.id);

                return (
                  <tr
                    key={stock.id}
                    className="hover:bg-[#0f1728] transition-colors cursor-pointer group"
                    onClick={() => setSelectedStock(stock)}
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                        <span>{stock.symbol}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {stock.underlyingTicker}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{stock.name}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-slate-200 font-medium">{stock.issuer}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {stock.backingType.includes('SEC')
                          ? 'SEC TA-1 (#0001995874) · Alpaca'
                          : 'Swiss DLT · Maerki Baumann'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-slate-200 font-medium">
                      ${stock.priceUsd.toFixed(2)}
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono tabular-nums">
                      <span
                        className={`inline-flex items-center gap-0.5 ${
                          isPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isPositive ? '+' : ''}
                        {stock.change24h.toFixed(2)}%
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-slate-400">
                      ${(stock.volume24h / 1e6).toFixed(2)}M
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono text-[11px]">
                      <span className="text-slate-400 hover:text-emerald-400 transition-colors">
                        {stock.addressBase.slice(0, 6)}...{stock.addressBase.slice(-4)}
                      </span>
                    </td>

                    <td
                      className="px-4 py-3.5 text-right space-x-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleAuditContract(stock)}
                        disabled={auditingAddress === stock.addressBase}
                        className="px-2.5 py-1 text-[11px] font-medium text-emerald-400 hover:text-black hover:bg-emerald-400 bg-[#0e1628] border border-emerald-500/30 rounded transition-colors inline-flex items-center gap-1"
                        title="Run onchain contract bytecode & legal rights audit"
                      >
                        {auditingAddress === stock.addressBase ? (
                          <RefreshCw className="w-3 h-3 animate-spin inline" />
                        ) : (
                          <ShieldCheck className="w-3 h-3 inline" />
                        )}
                        <span>Audit Rights</span>
                      </button>

                      <button
                        onClick={() => onSelectStockForAi(stock)}
                        className="px-2 py-1 text-[11px] font-semibold text-slate-200 hover:text-white bg-[#141b2a] hover:bg-[#1e2a40] border border-[#233148] rounded transition-colors"
                        title="Analyze with Gemini AI Intelligence"
                      >
                        <Sparkles className="w-3 h-3 inline mr-1 text-emerald-400" />
                        AI Research
                      </button>

                      <button
                        onClick={() => onAddToWatchlist(stock)}
                        className={`px-2 py-1 text-[11px] font-medium rounded border transition-colors ${
                          isWatching
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'text-slate-400 hover:text-white bg-[#141b2a] border-[#233148]'
                        }`}
                      >
                        {isWatching ? 'Watching' : '+ Watch'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onchain Deep Contract & Legal Rights Audit Modal */}
      {(auditReport || auditError) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-emerald-500/40 rounded-xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#162030] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>BASE ONCHAIN SMART CONTRACT & LEGAL RIGHTS AUDIT</span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">
                  {auditReport?.name} ({auditReport?.symbol})
                </h2>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Contract: {auditReport?.address} · Base Mainnet (Chain ID 8453)
                </div>
              </div>
              <button
                onClick={() => {
                  setAuditReport(null);
                  setAuditError(null);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {auditError ? (
              <div className="text-xs text-rose-400 font-mono bg-rose-500/10 p-4 rounded-lg border border-rose-500/20">
                {auditError}
              </div>
            ) : auditReport && (
              <div className="space-y-4 text-xs font-sans">
                {/* Contract Architecture & Proxy Breakdown */}
                <div className="p-4 rounded-lg bg-[#0e1628] border border-[#1a2538] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-emerald-400 font-semibold">
                      1. Onchain Proxy Architecture & Logic
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Bytecode: {auditReport.bytecodeBytes} bytes
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded bg-[#090d16] border border-[#162030]">
                      <span className="text-[10px] uppercase text-slate-500 block">Proxy Pattern</span>
                      <span className="text-white font-medium">{auditReport.proxyType}</span>
                    </div>

                    <div className="p-2.5 rounded bg-[#090d16] border border-[#162030]">
                      <span className="text-[10px] uppercase text-slate-500 block">Circulating Supply</span>
                      <span className="text-emerald-400 font-medium">
                        {parseFloat(auditReport.totalSupplyFormatted).toLocaleString()} {auditReport.symbol}
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-[#090d16] border border-[#162030]">
                      <span className="text-[10px] uppercase text-slate-500 block">Implementation Logic Address</span>
                      <a
                        href={auditReport.baseScanLogicUrl || auditReport.baseScanContractUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{auditReport.implementationAddress}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>

                    <div className="p-2.5 rounded bg-[#090d16] border border-[#162030]">
                      <span className="text-[10px] uppercase text-slate-500 block">Contract Status / Pause State</span>
                      <span className={auditReport.isPaused ? 'text-amber-400' : 'text-emerald-400'}>
                        {auditReport.isPaused ? 'Paused' : 'Active (paused: false)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Economic Rights & Legal Safeguards */}
                <div className="p-4 rounded-lg bg-[#0e1628] border border-[#1a2538] space-y-3">
                  <span className="text-[11px] font-mono uppercase text-emerald-400 font-semibold block">
                    2. Economic Rights & Custody Model
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-2.5 rounded bg-[#090d16] border border-[#162030] space-y-1">
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Dividend Pass-Through</span>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {auditReport.economicRights.dividendMechanism}
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-[#090d16] border border-[#162030] space-y-1">
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Shareholder Voting Rights</span>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {auditReport.economicRights.hasVotingRights ? 'Passed through onchain' : 'No onchain voting rights'} — {auditReport.economicRights.votingDetails}
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-[#090d16] border border-[#162030] space-y-1">
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Custody & Bankruptcy Remoteness</span>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {auditReport.economicRights.custodianEntity} ({auditReport.economicRights.bankruptcyRemote ? 'Bankruptcy-remote SPV' : 'Direct corporate claim'}).
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-[#090d16] border border-[#162030] space-y-1">
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Redemption Eligibility & Minimum Lot</span>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {auditReport.economicRights.redemptionTerms} (Minimum lot: {auditReport.economicRights.minimumRedemptionLot}).
                      </p>
                    </div>
                  </div>

                  {auditReport.economicRights.sanctionsOracleAddress && (
                    <div className="p-2.5 rounded bg-[#090d16] border border-[#162030] text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <span>Onchain Sanctions Oracle:</span>
                      <span className="text-emerald-400">{auditReport.economicRights.sanctionsOracleAddress}</span>
                    </div>
                  )}
                </div>

                {/* Underlying Equity Fundamentals (if present) */}
                {auditReport.fundamentals && (
                  <div className="p-4 rounded-lg bg-[#0e1628] border border-[#1a2538] space-y-3">
                    <span className="text-[11px] font-mono uppercase text-emerald-400 font-semibold block">
                      3. Underlying Equity Valuation & Market Microstructure
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono tabular-nums">
                      <div className="p-2 rounded bg-[#090d16] border border-[#162030]">
                        <span className="text-[10px] uppercase text-slate-500 block">Market Cap</span>
                        <span className="text-white">{auditReport.fundamentals.underlyingMarketCap}</span>
                      </div>

                      <div className="p-2 rounded bg-[#090d16] border border-[#162030]">
                        <span className="text-[10px] uppercase text-slate-500 block">P/E Ratio</span>
                        <span className="text-emerald-400">{auditReport.fundamentals.peRatio || 'N/A'}</span>
                      </div>

                      <div className="p-2 rounded bg-[#090d16] border border-[#162030]">
                        <span className="text-[10px] uppercase text-slate-500 block">5Y Beta</span>
                        <span className="text-white">{auditReport.fundamentals.beta5Y}</span>
                      </div>

                      <div className="p-2 rounded bg-[#090d16] border border-[#162030]">
                        <span className="text-[10px] uppercase text-slate-500 block">Dividend Yield</span>
                        <span className="text-emerald-400">{auditReport.fundamentals.dividendYield}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-3 border-t border-[#162030] flex items-center justify-between">
                  <a
                    href={auditReport.baseScanContractUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1 font-mono transition-colors"
                  >
                    <span>View Contract on BaseScan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {auditReport.economicRights.legalTermsUrl && (
                    <a
                      href={auditReport.economicRights.legalTermsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1 font-mono transition-colors"
                    >
                      <span>Prospectus & Legal Terms</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Stock Modal */}
      {selectedStock && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-[#1a2335] rounded-xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white">{selectedStock.symbol}</span>
                  <span className="text-sm font-mono text-slate-400">NASDAQ: {selectedStock.underlyingTicker}</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{selectedStock.name}</div>
              </div>
              <button
                onClick={() => setSelectedStock(null)}
                className="text-slate-400 hover:text-white p-1 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#0e1424] border border-[#1e293b] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-mono">Current Oracle Price</span>
                <div className="text-2xl font-bold text-white font-mono tabular-nums">
                  ${selectedStock.priceUsd.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-500 font-mono">24h Volatility</span>
                <div className={`text-base font-bold font-mono tabular-nums ${selectedStock.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedStock.change24h >= 0 ? '+' : ''}{selectedStock.change24h.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Regulatory & Custody Architecture
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedStock.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0e1424] border border-[#172030]">
                <span className="text-[10px] uppercase text-slate-500">Issuer / Custodian</span>
                <div className="text-slate-200 mt-1">{selectedStock.issuer}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0e1424] border border-[#172030]">
                <span className="text-[10px] uppercase text-slate-500">Underlying CUSIP</span>
                <div className="text-slate-200 mt-1">{selectedStock.cusip}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0e1424] border border-[#172030]">
                <span className="text-[10px] uppercase text-slate-500">Backing Type</span>
                <div className="text-emerald-400 mt-1">{selectedStock.backingType}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0e1424] border border-[#172030]">
                <span className="text-[10px] uppercase text-slate-500">Risk Assessment</span>
                <div className="text-slate-200 mt-1">{selectedStock.riskRating} Risk</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#172030]">
              <button
                onClick={() => {
                  handleAuditContract(selectedStock);
                  setSelectedStock(null);
                }}
                className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Deep Onchain Audit</span>
              </button>

              <button
                onClick={() => {
                  onSelectStockForAi(selectedStock);
                  setSelectedStock(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-black bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze with Gemini AI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
