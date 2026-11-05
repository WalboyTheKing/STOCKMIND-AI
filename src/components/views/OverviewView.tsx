import React, { useState } from 'react';
import {
  Wallet,
  Coins,
  Flame,
  Activity,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Layers,
  TrendingUp,
  Cpu,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { TokenizedStock, PortfolioPosition } from '../../types';

interface OverviewViewProps {
  stocks: TokenizedStock[];
  portfolioPositions: PortfolioPosition[];
  onSelectTab: (tab: string) => void;
  onSelectStock: (stock: TokenizedStock) => void;
  onRunAgent: (agentType: string, stockSymbol?: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stocks,
  portfolioPositions,
  onSelectTab,
  onSelectStock,
  onRunAgent,
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Month');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(6); // Default highlight July (index 6)

  // 12 months data matching the Aether UI bar chart
  const monthlyVelocityData = [
    { month: 'JAN', highYield: 4000, staked: 5500, liquid: 5200, total: 14700, entries: 240, accounts: 142 },
    { month: 'FEB', highYield: 5200, staked: 6800, liquid: 6900, total: 18900, entries: 280, accounts: 165 },
    { month: 'MAR', highYield: 3200, staked: 4100, liquid: 4500, total: 11800, entries: 195, accounts: 112 },
    { month: 'APR', highYield: 4900, staked: 6400, liquid: 6500, total: 17800, entries: 290, accounts: 174 },
    { month: 'MAY', highYield: 3800, staked: 5000, liquid: 5300, total: 14100, entries: 215, accounts: 130 },
    { month: 'JUN', highYield: 4600, staked: 6200, liquid: 6400, total: 17200, entries: 275, accounts: 168 },
    { month: 'JUL', monthFull: 'July 2026', highYield: 5800, staked: 7600, liquid: 7800, total: 21200, entries: 312, accounts: 186, valueStr: '$12,420.00' },
    { month: 'AUG', highYield: 2900, staked: 3800, liquid: 4100, total: 10800, entries: 178, accounts: 98 },
    { month: 'SEP', highYield: 5100, staked: 6900, liquid: 7000, total: 19000, entries: 295, accounts: 180 },
    { month: 'OCT', highYield: 6000, staked: 7900, liquid: 8100, total: 22000, entries: 328, accounts: 195 },
    { month: 'NOV', highYield: 4100, staked: 5400, liquid: 5500, total: 15000, entries: 232, accounts: 144 },
    { month: 'DEC', highYield: 5900, staked: 7800, liquid: 8300, total: 22000, entries: 335, accounts: 202 },
  ];

  // Heatmap matrix data for AGENT EXECUTION LOG (5 rows x 11 columns)
  // Values: 0 (dark), 1 (deep green), 2 (mid sage), 3 (pale lime)
  const heatmapGrid = [
    [0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 2, 2, 3, 3, 3, 0, 0, 0, 0],
    [1, 2, 3, 3, 3, 3, 2, 2, 0, 0, 0],
    [1, 1, 2, 3, 3, 2, 1, 1, 0, 0, 0],
    [0, 0, 0, 3, 3, 1, 0, 0, 0, 0, 0],
  ];

  const getHeatmapColor = (val: number) => {
    switch (val) {
      case 3:
        return 'bg-[#d8efa3]'; // pale lime
      case 2:
        return 'bg-[#6bb088]'; // medium sage
      case 1:
        return 'bg-[#2e5746]'; // deep forest
      default:
        return 'bg-[#18202c]'; // dark idle
    }
  };

  const selectedMonthData = hoveredMonth !== null ? monthlyVelocityData[hoveredMonth] : monthlyVelocityData[6];

  return (
    <div className="space-y-6 text-[#e2e8f0]">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Hello, Anthony</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs text-[#8e9aa8] mt-1 font-normal tracking-wide">
            Intelligence is the new liquidity.
          </p>
        </div>

        {/* Quick jump to 9 Verified Contracts */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('contracts')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#d8efa3] bg-[#1d2a23] hover:bg-[#25372d] border border-[#d8efa3]/30 transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>9 Contrats Tokenisés & Audit</span>
          </button>
          <button
            onClick={() => onRunAgent('portfolio', 'bCSPX')}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-black bg-[#d8efa3] hover:bg-[#cbe690] transition-all flex items-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>STOCKMIND AGENT</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL AUM */}
        <div className="p-4 rounded-2xl bg-[#131821] border border-[#1e2533] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-[#1c2331] flex items-center justify-center text-[#8e9aa8]">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#18392b] bg-[#d8efa3]">
              +6.4%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-medium text-[#8e9aa8] uppercase tracking-wider">
              TOTAL AUM
            </div>
            <div className="text-2xl font-bold text-white tracking-tight mt-0.5 font-mono tabular-nums">
              8,420M
            </div>
          </div>
        </div>

        {/* Card 2: DAILY YIELD */}
        <div className="p-4 rounded-2xl bg-[#131821] border border-[#1e2533] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-[#1c2331] flex items-center justify-center text-[#8e9aa8]">
              <Coins className="w-4 h-4" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#4a152d] bg-[#fbcfe8]">
              -4.1%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-medium text-[#8e9aa8] uppercase tracking-wider">
              DAILY YIELD
            </div>
            <div className="text-2xl font-bold text-white tracking-tight mt-0.5 font-mono tabular-nums">
              $5,980
            </div>
          </div>
        </div>

        {/* Card 3: BURN ANALYSIS */}
        <div className="p-4 rounded-2xl bg-[#131821] border border-[#1e2533] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-[#1c2331] flex items-center justify-center text-[#8e9aa8]">
              <Flame className="w-4 h-4" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#18392b] bg-[#d8efa3]">
              +2.3%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-medium text-[#8e9aa8] uppercase tracking-wider">
              BURN ANALYSIS
            </div>
            <div className="text-2xl font-bold text-white tracking-tight mt-0.5 font-mono tabular-nums">
              $1,240
            </div>
          </div>
        </div>

        {/* Card 4: ACTIVE PIPELINE */}
        <div className="p-4 rounded-2xl bg-[#131821] border border-[#1e2533] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-[#1c2331] flex items-center justify-center text-[#8e9aa8]">
              <Activity className="w-4 h-4" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#4a152d] bg-[#fbcfe8]">
              -8.9%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-medium text-[#8e9aa8] uppercase tracking-wider">
              ACTIVE PIPELINE
            </div>
            <div className="text-2xl font-bold text-white tracking-tight mt-0.5 font-mono tabular-nums">
              312
            </div>
          </div>
        </div>
      </div>

      {/* Main Row: Capital Velocity Chart (Left 2/3) + Intelligence & Log (Right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Capital Velocity Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#131821] border border-[#1e2533] flex flex-col justify-between">
          <div>
            {/* Header with bullet and Time Tabs */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5ea37e]"></span>
                <span className="text-xs font-semibold tracking-wider text-white uppercase font-mono">
                  CAPITAL VELOCITY
                </span>
              </div>

              {/* Segmented Time Controls */}
              <div className="flex items-center p-1 rounded-full bg-[#18202c] border border-[#232d3d] text-xs">
                {(['Day', 'Week', 'Month', 'Year'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTimeframe(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      activeTimeframe === t
                        ? 'bg-[#232f40] text-white shadow-sm'
                        : 'text-[#8e9aa8] hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Figures Row: Total Value & Conversion Rate */}
            <div className="mt-6 flex flex-wrap items-baseline gap-12">
              <div>
                <span className="text-xs text-[#8e9aa8] block">Total Value</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-white font-mono tabular-nums">
                    $18,920
                  </span>
                  <span className="text-xs font-semibold text-[#5ea37e] flex items-center gap-0.5">
                    ▲ 12,8% <span className="text-[#8e9aa8] font-normal">from last month</span>
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-[#8e9aa8] block">Conversion Rate</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-white font-mono tabular-nums">
                    27%
                  </span>
                  <span className="text-xs text-[#8e9aa8]">Increasing week over week</span>
                </div>
              </div>
            </div>

            {/* Stacked Bar Chart with Interactive Popover */}
            <div className="relative mt-10 pt-4">
              {/* Popover Tooltip (matches the screenshot for July) */}
              {hoveredMonth !== null && (
                <div
                  className="absolute z-20 pointer-events-none transition-all duration-200"
                  style={{
                    left: `${(hoveredMonth / 11) * 82 + 4}%`,
                    top: '-18px',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="p-3 rounded-xl bg-[#1a2332] border border-[#2e3b4e] shadow-xl text-[11px] space-y-1.5 min-w-[160px]">
                    <div className="font-semibold text-white">
                      {selectedMonthData.monthFull || `${selectedMonthData.month} 2026`} Performance
                    </div>
                    <div className="flex items-center justify-between text-[#cbd5e1]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5ea37e]"></span>
                        <span>Pipeline Entries</span>
                      </span>
                      <span className="font-mono text-white font-semibold">
                        {selectedMonthData.entries} Units
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#cbd5e1]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d8efa3]"></span>
                        <span>Qualified Accounts</span>
                      </span>
                      <span className="font-mono text-white font-semibold">
                        {selectedMonthData.accounts} Units
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#cbd5e1] pt-1 border-t border-[#273549]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2e5746]"></span>
                        <span>Account Value</span>
                      </span>
                      <span className="font-mono text-[#d8efa3] font-semibold">
                        {selectedMonthData.valueStr || `$${(selectedMonthData.total * 0.58).toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                  {/* Subtle anchor ring */}
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-white bg-[#1a2332] mx-auto mt-1 shadow"></div>
                </div>
              )}

              {/* Chart Grid Lines */}
              <div className="h-44 flex flex-col justify-between text-[11px] font-mono text-[#4b5563] pointer-events-none border-b border-[#1e2533]">
                <div className="flex items-center">
                  <span className="w-8">24K</span>
                  <div className="flex-1 border-b border-dashed border-[#1e2533]"></div>
                </div>
                <div className="flex items-center">
                  <span className="w-8">16K</span>
                  <div className="flex-1 border-b border-dashed border-[#1e2533]"></div>
                </div>
                <div className="flex items-center">
                  <span className="w-8">8K</span>
                  <div className="flex-1 border-b border-dashed border-[#1e2533]"></div>
                </div>
                <div className="flex items-center">
                  <span className="w-8">4K</span>
                  <div className="flex-1 border-b border-dashed border-[#1e2533]"></div>
                </div>
                <div className="flex items-center">
                  <span className="w-8">0K</span>
                  <div className="flex-1 border-b border-[#1e2533]"></div>
                </div>
              </div>

              {/* The 12 Stacked Bars */}
              <div className="absolute inset-x-8 bottom-6 h-40 flex items-end justify-between px-2">
                {monthlyVelocityData.map((d, index) => {
                  const maxVal = 26000;
                  const totalHeightPct = (d.total / maxVal) * 100;
                  const isHovered = hoveredMonth === index;

                  return (
                    <div
                      key={d.month}
                      onMouseEnter={() => setHoveredMonth(index)}
                      className="group flex flex-col items-center cursor-pointer h-full justify-end relative"
                      style={{ width: '6.5%' }}
                    >
                      {/* Stacked Pill Bar */}
                      <div
                        className={`w-full rounded-full overflow-hidden flex flex-col-reverse transition-all duration-200 ${
                          isHovered ? 'ring-2 ring-white/30 scale-105' : 'opacity-90 hover:opacity-100'
                        }`}
                        style={{ height: `${totalHeightPct}%` }}
                      >
                        {/* Layer 1: High-Yield Vaults (Deep green) */}
                        <div
                          className="w-full bg-[#2e5746]"
                          style={{ height: `${(d.highYield / d.total) * 100}%` }}
                        ></div>
                        {/* Layer 2: Staked Reserves (Sage green) */}
                        <div
                          className="w-full bg-[#6bb088]"
                          style={{ height: `${(d.staked / d.total) * 100}%` }}
                        ></div>
                        {/* Layer 3: Liquid Floating (Pale Lime) */}
                        <div
                          className="w-full bg-[#d8efa3]"
                          style={{ height: `${(d.liquid / d.total) * 100}%` }}
                        ></div>
                      </div>

                      {/* Month Label */}
                      <span
                        className={`text-[10px] font-mono mt-3 transition-colors ${
                          isHovered ? 'text-white font-bold' : 'text-[#8e9aa8]'
                        }`}
                      >
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend row */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#8e9aa8] flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2e5746]"></span>
              <span>High-Yield Vaults</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6bb088]"></span>
              <span>Staked Reserves</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d8efa3]"></span>
              <span>Liquid Floating</span>
            </div>
          </div>
        </div>

        {/* Right Column: STOCKMIND INTELLIGENCE + AGENT EXECUTION LOG */}
        <div className="space-y-5 flex flex-col justify-between">
          {/* Top Card: STOCKMIND INTELLIGENCE */}
          <div className="p-5 rounded-2xl bg-[#131821] border border-[#1e2533] relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5ea37e] uppercase tracking-wider font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>STOCKMIND INTELLIGENCE</span>
              </div>

              <blockquote className="text-xl font-bold text-white mt-4 tracking-tight leading-snug">
                &ldquo;Detected +$42,000.00 in latent APY growth.&rdquo;
              </blockquote>

              <p className="text-xs text-[#8e9aa8] mt-2 leading-relaxed">
                Agent Ready To Re-Route Liquidity To Hub Alpha (Aerodrome bIB01/bCSPX) For Maximum Yield & 1:1 Backed Security.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => onRunAgent('portfolio', 'bCSPX')}
                className="w-full py-3 rounded-xl bg-[#232b38] hover:bg-[#2d3748] text-white text-xs font-semibold uppercase tracking-wider transition-all border border-[#2e394b] flex items-center justify-center gap-2"
              >
                <span>EXECUTE OPTIMIZATION</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Card: AGENT EXECUTION LOG */}
          <div className="p-5 rounded-2xl bg-[#131821] border border-[#1e2533]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                AGENT EXECUTION LOG
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#5ea37e] bg-[#1a2d24] px-2.5 py-0.5 rounded-full border border-[#5ea37e]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5ea37e] animate-pulse"></span>
                <span>LIVE</span>
              </div>
            </div>

            {/* Matrix Heatmap */}
            <div className="flex items-center gap-3">
              {/* Y-Axis Labels */}
              <div className="flex flex-col justify-between h-28 text-[10px] font-mono text-[#4b5563]">
                <span>250</span>
                <span>150</span>
                <span>100</span>
                <span>50</span>
                <span>0</span>
              </div>

              {/* Heatmap Grid (5 rows x 11 columns) */}
              <div className="flex-1 grid grid-rows-5 gap-1.5">
                {heatmapGrid.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-11 gap-1.5">
                    {row.map((cellVal, cIdx) => (
                      <div
                        key={cIdx}
                        className={`h-4 rounded-[4px] transition-colors ${getHeatmapColor(cellVal)}`}
                        title={`Block Cycle ${(rIdx + 1) * 50} · Node #${cIdx + 1}`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Intensity Scale Legend */}
            <div className="mt-4 pt-3 border-t border-[#1e2533] flex items-center justify-between text-[11px] text-[#8e9aa8] font-mono">
              <span className="text-[10px] uppercase text-[#4b5563]">INTENSITY LEVELS</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5ea37e]"></span>
                  <span>SYNCING</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#d8efa3]"></span>
                  <span>ONLINE</span>
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#8e9aa8] mt-2 leading-relaxed">
              AI Agent Is Currently Monitoring 9 Tokenized Stock Contracts on Base for Reserves & Arbitrage Opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom 3 Cards Matching Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: REGIONAL HUB FLOW */}
        <div
          onClick={() => onSelectTab('onchain')}
          className="p-5 rounded-2xl bg-[#131821] border border-[#1e2533] hover:border-[#2b3547] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white tracking-wider uppercase font-mono">
              REGIONAL HUB FLOW
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#5ea37e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5ea37e]"></span>
              <span>LIVE TRACKING</span>
            </div>
          </div>
          <p className="text-xs text-[#8e9aa8] mt-2">
            Base Mainnet L2 bridge flows, Aerodrome volatile & stableswap pools depth for bCSPX and bIB01.
          </p>
          <div className="mt-4 pt-3 border-t border-[#1e2533] flex items-center justify-between text-xs">
            <span className="text-slate-400">Total 24h Flow:</span>
            <span className="font-mono text-white font-semibold">$34,820,000 USD</span>
          </div>
        </div>

        {/* Card 2: ASSET CONCENTRATION */}
        <div
          onClick={() => onSelectTab('portfolio')}
          className="p-5 rounded-2xl bg-[#131821] border border-[#1e2533] hover:border-[#2b3547] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white tracking-wider uppercase font-mono">
              ASSET CONCENTRATION
            </span>
            <span className="text-[10px] font-mono text-[#d8efa3] bg-[#1d2a23] px-2 py-0.5 rounded-full">
              STRATEGIC
            </span>
          </div>
          <p className="text-xs text-[#8e9aa8] mt-2">
            Dual legal diversification: Swiss DLT SPV Certificates (52%) vs US SEC Form TA-1 Transfer Agent dShares (48%).
          </p>
          <div className="mt-4 pt-3 border-t border-[#1e2533] flex items-center justify-between text-xs">
            <span className="text-slate-400">Portfolio Weighted Beta:</span>
            <span className="font-mono text-[#5ea37e] font-semibold">1.12 (Market Balanced)</span>
          </div>
        </div>

        {/* Card 3: RESOURCE CONTROL */}
        <div
          onClick={() => onSelectTab('contracts')}
          className="p-5 rounded-2xl bg-[#131821] border border-[#1e2533] hover:border-[#2b3547] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white tracking-wider uppercase font-mono">
              RESOURCE CONTROL
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              SECURE
            </span>
          </div>
          <p className="text-xs text-[#8e9aa8] mt-2">
            Autonomous circuit breakers active. 9 contracts monitored for admin upgradeability, pause status, and Chainalysis oracle.
          </p>
          <div className="mt-4 pt-3 border-t border-[#1e2533] flex items-center justify-between text-xs">
            <span className="text-slate-400">Compliance Oracle:</span>
            <span className="font-mono text-slate-300">0xbA0d...4587 (Active)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
