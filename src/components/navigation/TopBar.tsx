import React from 'react';
import { Wallet, ShieldCheck, ChevronRight } from 'lucide-react';
import { formatAddress } from '../../services/web3';
import { NetworkTelemetry } from '../../types';

interface TopBarProps {
  activeTab: string;
  walletAddress: string | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  networkTelemetry: NetworkTelemetry | null;
  isConnecting: boolean;
  onSelectTab: (tab: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  walletAddress,
  onConnectWallet,
  onDisconnectWallet,
  networkTelemetry,
  isConnecting,
  onSelectTab,
}) => {
  const getTabLabel = (id: string) => {
    const map: Record<string, string> = {
      overview: 'Terminal Overview',
      markets: 'Tokenized Stock Explorer',
      ai: 'AI Financial Intelligence',
      portfolio: 'Portfolio Management',
      onchain: 'Onchain Intelligence',
      agents: 'Autonomous Agents',
      automations: 'Automations Center',
      watchlist: 'Equity Watchlist',
      reports: 'Research Memos',
      settings: 'Settings & Competition',
    };
    return map[id] || id;
  };

  return (
    <header className="h-16 px-6 border-b border-[#1a2333] bg-[#090d16]/95 backdrop-blur flex items-center justify-between gap-8 shrink-0 z-30 sticky top-0">
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onSelectTab('overview')}
          className="text-left group flex items-center gap-2 focus:outline-none"
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-black font-bold text-base tracking-tighter">
            SM
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap">
              STOCKMIND AI
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Navigation Breadcrumbs & Contextual Metrics */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-400 whitespace-nowrap overflow-hidden">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <span>Base 8453</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-emerald-400">{getTabLabel(activeTab)}</span>
        </div>

        <span className="text-slate-700">|</span>

        <div className="flex items-center gap-3 font-mono tabular-nums text-slate-400">
          <span>Block #{networkTelemetry?.blockNumber || '22849102'}</span>
          <span>·</span>
          <span>Gas {networkTelemetry?.gasPriceGwei || '0.003'} Gwei</span>
          <span>·</span>
          <span>Base L2 Verified</span>
        </div>
      </div>

      {/* Zone 3: 1 Primary Action (Wallet Connection) */}
      <div className="flex items-center gap-3 shrink-0">
        {walletAddress ? (
          <div className="flex items-center gap-2 bg-[#0e1424] border border-[#1e293b] rounded-lg px-3 py-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono text-xs text-slate-200 tabular-nums">
              {formatAddress(walletAddress)}
            </span>
            <button
              onClick={onDisconnectWallet}
              className="text-xs text-slate-500 hover:text-rose-400 transition-colors ml-1 focus:outline-none"
              title="Disconnect Wallet"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={onConnectWallet}
            disabled={isConnecting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-black bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <Wallet className="w-4 h-4" />
            <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
