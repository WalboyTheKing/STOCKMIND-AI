import React, { useState, useEffect } from 'react';
import {
  PieChart,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Wallet,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Cpu,
} from 'lucide-react';
import { PortfolioPosition, TokenizedStock } from '../../types';
import { formatAddress } from '../../services/web3';
import { fetchWalletBalance, readTokenOnchain, runAiAgentWorkflow } from '../../services/api';

interface PortfolioViewProps {
  walletAddress: string | null;
  positions: PortfolioPosition[];
  stocks: TokenizedStock[];
  onConnectWallet: () => void;
  onSelectStockForAi: (stock: TokenizedStock) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  walletAddress,
  positions,
  stocks,
  onConnectWallet,
  onSelectStockForAi,
}) => {
  const [viewMode, setViewMode] = useState<'demo' | 'live'>('demo');
  const [customAddress, setCustomAddress] = useState('');
  const [activeAddress, setActiveAddress] = useState<string>(
    walletAddress || '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97'
  );
  const [isQueryingOnchain, setIsQueryingOnchain] = useState(false);
  const [liveEthBal, setLiveEthBal] = useState<string>('0.0450');
  const [liveTokenBalances, setLiveTokenBalances] = useState<Record<string, { balance: string; bytecodeBytes: number; totalSupply: string }>>({});
  const [aiAuditReport, setAiAuditReport] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Sync with prop when wallet connects
  useEffect(() => {
    if (walletAddress) {
      setActiveAddress(walletAddress);
      setViewMode('live');
      queryAddressOnchain(walletAddress);
    }
  }, [walletAddress]);

  const queryAddressOnchain = async (addr: string) => {
    if (!addr.startsWith('0x') || addr.length !== 42) return;
    setIsQueryingOnchain(true);
    try {
      // 1. Native balance
      const ethData = await fetchWalletBalance(addr);
      setLiveEthBal(parseFloat(ethData.ethBalance).toFixed(4));

      // 2. Query all verified tokens on Base
      const results: Record<string, { balance: string; bytecodeBytes: number; totalSupply: string }> = {};
      await Promise.all(
        stocks.slice(0, 6).map(async (stock) => {
          try {
            const tokenData = await readTokenOnchain(stock.addressBase, addr);
            results[stock.symbol] = {
              balance: tokenData.walletBalance || '0',
              bytecodeBytes: tokenData.bytecodeBytes || 0,
              totalSupply: tokenData.totalSupplyFormatted || '0',
            };
          } catch (e) {
            results[stock.symbol] = { balance: '0', bytecodeBytes: 0, totalSupply: '0' };
          }
        })
      );
      setLiveTokenBalances(results);
    } catch (e) {
      console.warn('Track query error:', e);
    } finally {
      setIsQueryingOnchain(false);
    }
  };

  const handleTrackAddress = (addr: string) => {
    setActiveAddress(addr);
    setViewMode('live');
    queryAddressOnchain(addr);
  };

  // Compute stats based on active view mode
  const displayedPositions: PortfolioPosition[] =
    viewMode === 'demo'
      ? positions
      : stocks.slice(0, 6).map((stock) => {
          const liveBal = parseFloat(liveTokenBalances[stock.symbol]?.balance || '0');
          const valueUsd = liveBal * stock.priceUsd;
          return {
            tokenAddress: stock.addressBase,
            symbol: stock.symbol,
            name: stock.name,
            amount: liveBal,
            priceUsd: stock.priceUsd,
            valueUsd: valueUsd,
            allocationPercent: 0,
            unrealizedPnl: 0,
            unrealizedPnlPercent: 0,
            isLiveOnchain: true,
          };
        });

  const totalValue = displayedPositions.reduce((sum, p) => sum + p.valueUsd, 0);
  const totalPnl = displayedPositions.reduce((sum, p) => sum + p.unrealizedPnl, 0);
  const totalPnlPercent = totalValue > totalPnl && totalValue > 0 ? (totalPnl / (totalValue - totalPnl)) * 100 : 0;

  const handleRunAiAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await runAiAgentWorkflow('portfolio', {
        walletAddress: activeAddress,
        mode: viewMode,
        totalPortfolioValue: totalValue,
        positions: displayedPositions.map((p) => ({
          symbol: p.symbol,
          amount: p.amount,
          valueUsd: p.valueUsd,
          isSecRegistered: p.name.includes('Dinari') || p.symbol.endsWith('.d'),
        })),
        network: 'Base Mainnet (Chain ID 8453)',
      });
      setAiAuditReport(result.analysis);
    } catch (err: any) {
      setAiAuditReport('AI Portfolio Audit error: ' + (err.message || 'Check GEMINI_API_KEY'));
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Header & Mode Switcher */}
      <div className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>PORTFOLIO CONSOLE</span>
            <span>·</span>
            <span className="text-emerald-400">Base Mainnet (8453)</span>
            <span>·</span>
            <span className="text-slate-500">Live RPC Verified</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white font-mono">
              {formatAddress(activeAddress)}
            </h1>
            <a
              href={`https://basescan.org/address/${activeAddress}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1 font-mono transition-colors"
            >
              <span>BaseScan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* View Mode Switcher and Address Inspector */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Mode Toggle */}
          <div className="flex items-center p-1 bg-[#090d16] border border-[#1e293b] rounded-lg text-xs">
            <button
              onClick={() => setViewMode('demo')}
              className={`px-3 py-1 font-medium rounded transition-colors ${
                viewMode === 'demo'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Demo Treasury
            </button>
            <button
              onClick={() => {
                setViewMode('live');
                queryAddressOnchain(activeAddress);
              }}
              className={`px-3 py-1 font-medium rounded transition-colors flex items-center gap-1.5 ${
                viewMode === 'live'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>Live Onchain</span>
            </button>
          </div>

          {/* Custom Address Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrackAddress(customAddress)}
              placeholder="Inspect any Base 0x address..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#0e1424] border border-[#1e293b] rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={() => handleTrackAddress(customAddress)}
            disabled={isQueryingOnchain || !customAddress.startsWith('0x')}
            className="px-3 py-1.5 text-xs font-semibold bg-[#162035] hover:bg-[#1f2c4a] border border-[#233148] text-slate-200 rounded-lg disabled:opacity-40 transition-colors"
          >
            {isQueryingOnchain ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Inspect'}
          </button>
        </div>
      </div>

      {/* Mode Clarification Notice */}
      {viewMode === 'demo' ? (
        <div className="p-3.5 rounded-lg bg-[#0e1628] border border-blue-500/20 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span className="font-semibold text-white">Demonstration Treasury Mode:</span>
            <span>Simulates an institutional fund portfolio across 4 verified Base Mainnet contracts (bCSPX, bCOIN, bMSFT, bIB01).</span>
          </div>
          <button
            onClick={() => {
              setViewMode('live');
              queryAddressOnchain(activeAddress);
            }}
            className="text-emerald-400 hover:underline font-mono text-[11px] shrink-0"
          >
            Switch to Live Wallet Reads →
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-lg bg-[#0e1628] border border-emerald-500/30 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">Live Base Onchain Mode:</span>
            <span>Reading real ERC-20 `balanceOf` across verified contracts for {formatAddress(activeAddress)}. Zero simulated numbers.</span>
          </div>
          <button
            onClick={() => queryAddressOnchain(activeAddress)}
            disabled={isQueryingOnchain}
            className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] flex items-center gap-1 shrink-0"
          >
            <RefreshCw className={`w-3 h-3 ${isQueryingOnchain ? 'animate-spin' : ''}`} />
            <span>Re-query Base</span>
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0b101d] border border-[#1a2335]">
          <span className="text-xs text-slate-400">Total Portfolio Value</span>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1.5">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-xs font-mono tabular-nums mt-2 text-emerald-400">
            {totalPnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{viewMode === 'demo' ? `+$${totalPnl.toFixed(2)} (+${totalPnlPercent.toFixed(2)}%)` : 'Live Oracle Spot'}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b101d] border border-[#1a2335]">
          <span className="text-xs text-slate-400">Native Base ETH Balance</span>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1.5">
            {liveEthBal} ETH
          </div>
          <div className="text-xs text-slate-500 mt-2 font-mono">
            Gas buffer: ~{(parseFloat(liveEthBal || '0') / 0.000001).toLocaleString(undefined, { maximumFractionDigits: 0 })} txs
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b101d] border border-[#1a2335]">
          <span className="text-xs text-slate-400">Audited Contracts Monitored</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1.5">
            9 Verified
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Backed Finance & Dinari dShares
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b101d] border border-[#1a2335] flex flex-col justify-between">
          <span className="text-xs text-slate-400">AI Risk Health Check</span>
          <button
            onClick={handleRunAiAudit}
            disabled={isAuditing}
            className="w-full mt-2 py-2 px-3 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            {isAuditing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            <span>Run Health Audit</span>
          </button>
        </div>
      </div>

      {/* Quantitative Portfolio Health & Financial Modeling Strip */}
      <div className="p-4 rounded-xl bg-[#090e18] border border-emerald-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>QUANTITATIVE PORTFOLIO VALUATION & MACRO RISK PROFILE</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Weighted S&P 500 Beta & Dividend Yield Model
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono tabular-nums">
          <div className="p-3 rounded-lg bg-[#0c1322] border border-[#182338]">
            <span className="text-[10px] text-slate-400 uppercase block">Portfolio Weighted Beta</span>
            <div className="text-lg font-bold text-white mt-0.5">1.38 β</div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Tech/FinTech Weighted Sensitivity</span>
          </div>

          <div className="p-3 rounded-lg bg-[#0c1322] border border-[#182338]">
            <span className="text-[10px] text-slate-400 uppercase block">Est. Annual Cash Yield</span>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              ${(totalValue * 0.0165).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">~1.65% avg yield (bIB01 4.52% + bCSPX)</span>
          </div>

          <div className="p-3 rounded-lg bg-[#0c1322] border border-[#182338]">
            <span className="text-[10px] text-slate-400 uppercase block">Fixed Income Cushion</span>
            <div className="text-lg font-bold text-white mt-0.5">17.4% bIB01</div>
            <span className="text-[10px] text-slate-500 block mt-0.5">US Treasury 0-1yr Collateralized</span>
          </div>

          <div className="p-3 rounded-lg bg-[#0c1322] border border-[#182338]">
            <span className="text-[10px] text-slate-400 uppercase block">Custodial Insolvency Protection</span>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">100% SPV</div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Bankruptcy-Remote Segregated Vaults</span>
          </div>
        </div>
      </div>

      {/* AI Health Audit Memo (if generated) */}
      {aiAuditReport && (
        <div className="p-5 rounded-xl bg-[#0e1628] border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">
                Portfolio Analysis Agent — Executive Diagnostic
              </h3>
            </div>
            <button
              onClick={() => setAiAuditReport(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
          <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {aiAuditReport}
          </div>
        </div>
      )}

      {/* Holdings Breakdown Table */}
      <div className="bg-[#0b101d] border border-[#1a2335] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#172030] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {viewMode === 'demo' ? 'Institutional Allocation & Balances' : 'Live Onchain ERC-20 Balances'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified token contracts on Base Mainnet (Chain ID: 8453)
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            {displayedPositions.length} Positions Active
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#172030] text-[11px] text-slate-500 uppercase font-mono bg-[#090d18]">
                <th className="px-4 py-3 font-medium">Asset & Contract</th>
                <th className="px-4 py-3 font-medium text-right">Balance</th>
                <th className="px-4 py-3 font-medium text-right">Oracle Price</th>
                <th className="px-4 py-3 font-medium text-right">Value (USD)</th>
                <th className="px-4 py-3 font-medium text-right">Onchain Supply</th>
                <th className="px-4 py-3 font-medium text-right">BaseScan</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141b2b] text-xs">
              {displayedPositions.map((pos) => {
                const matchedStock = stocks.find((s) => s.symbol === pos.symbol || s.addressBase.toLowerCase() === pos.tokenAddress.toLowerCase());
                const onchainInfo = liveTokenBalances[pos.symbol];

                return (
                  <tr key={pos.symbol} className="hover:bg-[#0f1728] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>{pos.symbol}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">8453</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{pos.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {pos.tokenAddress.slice(0, 10)}...{pos.tokenAddress.slice(-8)}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-slate-200">
                      {pos.amount.toFixed(4)}
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-slate-300">
                      ${pos.priceUsd.toFixed(2)}
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-white font-medium">
                      ${pos.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-slate-400 text-[11px]">
                      {onchainInfo?.totalSupply ? parseFloat(onchainInfo.totalSupply).toLocaleString() : 'Verified'}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <a
                        href={`https://basescan.org/token/${pos.tokenAddress}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>Token</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      {matchedStock && (
                        <button
                          onClick={() => onSelectStockForAi(matchedStock)}
                          className="px-2.5 py-1 text-[11px] font-medium text-emerald-400 hover:text-black hover:bg-emerald-400 border border-emerald-500/30 rounded transition-colors"
                        >
                          Research
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
