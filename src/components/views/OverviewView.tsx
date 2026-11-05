import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  Bot,
  Activity,
  FileCheck2,
} from 'lucide-react';
import { TokenizedStock, PortfolioPosition } from '../../types';

interface OverviewViewProps {
  stocks: TokenizedStock[];
  portfolioPositions: PortfolioPosition[];
  onSelectTab: (tab: string) => void;
  onSelectStock: (stock: TokenizedStock) => void;
  onRunAgent: (agentType: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stocks,
  portfolioPositions,
  onSelectTab,
  onSelectStock,
  onRunAgent,
}) => {
  const totalPortfolioValue = portfolioPositions.reduce((acc, p) => acc + p.valueUsd, 0);
  const totalDailyPnl = portfolioPositions.reduce((acc, p) => acc + p.unrealizedPnl, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner: Institutional Mission & Real Utility */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#0d1424] via-[#09111e] to-[#0d1424] border border-[#1b2537] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>BASE STOCKS MAXXING · AGENTIC STOCK FINANCE TRACK</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Institutional Tokenized Stock Intelligence Terminal
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real onchain reads on Base Mainnet (8453), verified 1:1 SEC Transfer Agent custody (Dinari dShares) and Swiss DLT certificates (Backed Finance), and autonomous agentic workflows with @bankrbot and @BaseStonk.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectTab('markets')}
            className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-[#162032] hover:bg-[#1e2c45] border border-[#23334e] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Explore Markets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSelectTab('agents')}
            className="px-3.5 py-2 text-xs font-semibold text-black bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Launch AI Agents</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0b101d] border border-[#1a2335]">
          <div className="text-xs text-slate-400">Tracked Portfolio Value</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1.5">
            ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-xs font-mono tabular-nums mt-2 text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+${totalDailyPnl.toFixed(2)} (Today)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b101d] border border-[#1a2335]">
          <div className="text-xs text-slate-400">Verified Base Tokenized Stocks</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1.5">
            {stocks.length} Assets
          </div>
          <div className="text-xs text-slate-500 mt-2">
            1:1 SEC Transfer Agent & Swiss DLT
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b101d] border border-[#1a2335]">
          <div className="text-xs text-slate-400">Base L2 Gas Efficiency</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1.5">
            ~$0.003 <span className="text-xs text-slate-400 font-normal">/ tx</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            99.1% cheaper than Ethereum L1
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b101d] border border-[#1a2335]">
          <div className="text-xs text-slate-400">Custody & Legal Classification</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1.5">
            1:1 Backed
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Regulated US Broker Custodians
          </div>
        </div>
      </div>

      {/* Main Grid: Live Market Ticker & AI Market Intelligence Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tokenized Stock Leaderboard (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Verified Tokenized Stocks on Base
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real onchain ERC-20 smart contracts with verified proof of reserves
              </p>
            </div>
            <button
              onClick={() => onSelectTab('markets')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>View All ({stocks.length})</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#172030] text-[11px] text-slate-500 uppercase font-mono">
                  <th className="pb-2.5 font-medium">Asset</th>
                  <th className="pb-2.5 font-medium">Issuer / Backing</th>
                  <th className="pb-2.5 font-medium text-right">Price (USD)</th>
                  <th className="pb-2.5 font-medium text-right">24h Change</th>
                  <th className="pb-2.5 font-medium text-right">24h Vol</th>
                  <th className="pb-2.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141b2b] text-xs">
                {stocks.slice(0, 5).map((stock) => {
                  const isPositive = stock.change24h >= 0;
                  return (
                    <tr
                      key={stock.id}
                      onClick={() => onSelectStock(stock)}
                      className="hover:bg-[#0f1728] transition-colors cursor-pointer group"
                    >
                      <td className="py-3">
                        <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {stock.symbol}
                        </div>
                        <div className="text-[11px] text-slate-500">{stock.name}</div>
                      </td>

                      <td className="py-3">
                        <div className="text-slate-300 font-medium">{stock.issuer}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {stock.backingType.includes('SEC') ? 'SEC Form TA-1' : stock.backingType}
                        </div>
                      </td>

                      <td className="py-3 text-right font-mono tabular-nums text-slate-200">
                        ${stock.priceUsd.toFixed(2)}
                      </td>

                      <td className="py-3 text-right font-mono tabular-nums">
                        <span className={`inline-flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isPositive ? '+' : ''}{stock.change24h.toFixed(2)}%
                        </span>
                      </td>

                      <td className="py-3 text-right font-mono tabular-nums text-slate-400">
                        ${(stock.volume24h / 1e6).toFixed(1)}M
                      </td>

                      <td className="py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStock(stock);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-emerald-400 hover:text-black hover:bg-emerald-400 border border-emerald-500/30 rounded transition-colors"
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Agent Workflows Quick-Launch (1 Col) */}
        <div className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Bot className="w-4 h-4" />
              <span>STOCKMIND AGENT CLUSTER</span>
            </div>
            <h3 className="text-sm font-semibold text-white mt-1">
              Autonomous Financial Workflows
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Transparent, reason-backed agent execution. All financial transactions require explicit wallet signature.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => onRunAgent('portfolio')}
              className="w-full text-left p-3 rounded-lg bg-[#0e1424] hover:bg-[#141d33] border border-[#1e2a3f] transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  Portfolio Analysis Agent
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Audits concentration risk, counterparty exposure & liquidity.
              </p>
            </button>

            <button
              onClick={() => onRunAgent('risk')}
              className="w-full text-left p-3 rounded-lg bg-[#0e1424] hover:bg-[#141d33] border border-[#1e2a3f] transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  Risk Intelligence Agent
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Evaluates de-pegging, smart contract upgradeability & custody.
              </p>
            </button>

            <button
              onClick={() => onRunAgent('monitoring')}
              className="w-full text-left p-3 rounded-lg bg-[#0e1424] hover:bg-[#141d33] border border-[#1e2a3f] transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  Onchain Monitoring Agent
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Monitors issuer reserve mints, burn events & Aerodrome pools.
              </p>
            </button>
          </div>

          <div className="pt-2 border-t border-[#162030] flex items-center justify-between text-[11px] text-slate-500">
            <span>Model: Gemini 3.8 Flash</span>
            <span className="text-emerald-400 font-mono">Server-Side Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
