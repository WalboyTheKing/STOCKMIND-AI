import React, { useState } from 'react';
import {
  Bookmark,
  Trash2,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { TokenizedStock } from '../../types';

interface WatchlistViewProps {
  watchlistStockIds: string[];
  stocks: TokenizedStock[];
  onRemoveFromWatchlist: (stockId: string) => void;
  onSelectStockForAi: (stock: TokenizedStock) => void;
  onNavigateToMarkets: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  watchlistStockIds,
  stocks,
  onRemoveFromWatchlist,
  onSelectStockForAi,
  onNavigateToMarkets,
}) => {
  const [targetNotes, setTargetNotes] = useState<Record<string, string>>({
    'backed-bcspx': 'Core S&P 500 benchmark allocation. Target entry under $590.00 USD on Base Mainnet.',
    'backed-bcoin': 'High-beta proxy for Base ecosystem growth. Monitor Backed Swiss custody attestation.',
    'dinari-sbux-d': 'Consumer defensive dividend dShare with SEC TA-1 registered transfer agent custody.',
  });

  const watchedStocks = stocks.filter((s) => watchlistStockIds.includes(s.id));

  const handleUpdateNote = (id: string, note: string) => {
    setTargetNotes((prev) => ({ ...prev, [id]: note }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
            <Bookmark className="w-4 h-4" />
            <span>INSTITUTIONAL WATCHLIST</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Tracked Tokenized Equities & Execution Targets
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Curate target assets, set thesis notes, and trigger deep AI intelligence memos on tokenized stocks on Base.
          </p>
        </div>

        <button
          onClick={onNavigateToMarkets}
          className="px-3.5 py-2 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-black rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Assets from Markets</span>
        </button>
      </div>

      {watchedStocks.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#0b101d] border border-[#1a2335] space-y-4">
          <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white">Your Watchlist is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse the Tokenized Stock Explorer to track SEC-registered dShares and collateralized RWA securities on Base.
          </p>
          <button
            onClick={onNavigateToMarkets}
            className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs rounded-lg transition-colors"
          >
            Explore Markets
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {watchedStocks.map((stock) => {
            const isPositive = stock.change24h >= 0;
            const note = targetNotes[stock.id] || '';

            return (
              <div
                key={stock.id}
                className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white">{stock.symbol}</span>
                        <span className="text-xs font-mono text-slate-400">({stock.underlyingTicker})</span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {stock.backingType.includes('SEC') ? 'SEC Form TA-1' : stock.backingType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{stock.name}</div>
                    </div>

                    <button
                      onClick={() => onRemoveFromWatchlist(stock.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 my-3 rounded-lg bg-[#0e1424] border border-[#172030] text-xs font-mono tabular-nums">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Price</span>
                      <span className="text-slate-200 font-semibold">${stock.priceUsd.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">24h Delta</span>
                      <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                        {isPositive ? '+' : ''}{stock.change24h.toFixed(2)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">24h Vol</span>
                      <span className="text-slate-400">${(stock.volume24h / 1e6).toFixed(1)}M</span>
                    </div>
                  </div>

                  {/* Thesis / Execution Note */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-mono">
                      Investment Thesis & Target Execution Note:
                    </label>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(e) => handleUpdateNote(stock.id, e.target.value)}
                      placeholder="Enter target entry/exit notes or thesis..."
                      className="w-full px-3 py-2 bg-[#090d16] border border-[#1e293b] rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#172030] flex items-center justify-between">
                  <a
                    href={stock.baseScanUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1 font-mono"
                  >
                    <span>BaseScan Contract</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => onSelectStockForAi(stock)}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:text-black hover:bg-emerald-400 border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Analysis</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
