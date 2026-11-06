import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Wallet,
  ShieldCheck,
  ChevronDown,
  Terminal,
  ExternalLink,
} from 'lucide-react';
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
  onRunAgent: (agentType: string, stockSymbol?: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  walletAddress,
  onConnectWallet,
  onDisconnectWallet,
  networkTelemetry,
  isConnecting,
  onSelectTab,
  onRunAgent,
}) => {
  const [commandQuery, setCommandQuery] = useState('');
  const [showCommandMenu, setShowCommandMenu] = useState(false);

  const quickCommands = [
    { label: '🔥 Explore Stocks Maxxing Season (10 Features)', action: () => onSelectTab('maxxing') },
    { label: 'Audit bCSPX Reserves & Custody (Maerki Baumann)', action: () => onRunAgent('research', 'bCSPX') },
    { label: 'Audit SBUX.d SEC Form TA-1 & Dividend Flow', action: () => onRunAgent('research', 'SBUX.d') },
    { label: 'Run Full Portfolio Beta & Risk Audit', action: () => onRunAgent('portfolio') },
    { label: 'Inspect 9 Complete Tokenized Contract Addresses', action: () => onSelectTab('contracts') },
    { label: 'Simulate Weekend De-Pegging Stress-Test', action: () => onRunAgent('risk') },
    { label: 'Launch In-App Tokenized Stocks SDK Simulator', action: () => onSelectTab('maxxing') },
  ];

  const handleCommandSelect = (cmdAction: () => void) => {
    cmdAction();
    setShowCommandMenu(false);
    setCommandQuery('');
  };

  return (
    <header className="h-20 px-8 border-b border-[#1a2333] bg-[#0c1017]/95 backdrop-blur flex items-center justify-between gap-6 shrink-0 z-30 sticky top-0 text-[#e2e8f0]">
      {/* Brand Title & Autonomous Agent Pill */}
      <div className="flex items-center gap-6 shrink-0">
        <button
          onClick={() => onSelectTab('overview')}
          className="text-xl font-bold tracking-tight text-white hover:text-[#d8efa3] transition-colors flex items-center gap-2"
        >
          <span>STOCKMIND</span>
        </button>

        {/* The Exact Status Pill Badge from Screenshot: AGENT MODE: AUTONOMOUS | 98.4% EFFICIENCY */}
        <div className="hidden sm:flex items-center rounded-full bg-[#131821] border border-[#232d3d] px-4 py-1.5 text-[11px] font-mono tracking-wider">
          <div className="flex items-center gap-2 text-white">
            <span className="w-2 h-2 rounded-full bg-[#5ea37e] animate-pulse"></span>
            <span>AGENT MODE: AUTONOMOUS</span>
          </div>
          <span className="mx-3 text-[#2a374a]">|</span>
          <span className="text-[#5ea37e] font-semibold">98.4% EFFICIENCY</span>
        </div>
      </div>

      {/* Center: Command Search Input with Interactive Dropdown */}
      <div className="relative flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8e9aa8]" />
          <input
            type="text"
            placeholder="Execute agent command ..."
            value={commandQuery}
            onChange={(e) => {
              setCommandQuery(e.target.value);
              setShowCommandMenu(true);
            }}
            onFocus={() => setShowCommandMenu(true)}
            className="w-full pl-11 pr-4 py-2 bg-[#131821] border border-[#232d3d] rounded-full text-xs text-white placeholder-[#8e9aa8] focus:outline-none focus:border-[#5ea37e] transition-colors"
          />
        </div>

        {/* Dropdown for Agent Commands */}
        {showCommandMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowCommandMenu(false)}
            ></div>
            <div className="absolute left-0 right-0 mt-2 p-2 rounded-2xl bg-[#131821] border border-[#232d3d] shadow-2xl z-50 text-xs space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-[#8e9aa8]">
                Autonomous Agent Directives
              </div>
              {quickCommands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => handleCommandSelect(cmd.action)}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-[#1a2230] transition-colors flex items-center gap-2"
                >
                  <Terminal className="w-3.5 h-3.5 text-[#5ea37e]" />
                  <span>{cmd.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right Controls: Bell, + INITIALIZE AGENT, Wallet Button */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification Bell */}
        <button
          onClick={() => onSelectTab('contracts')}
          className="w-10 h-10 rounded-full bg-[#131821] border border-[#232d3d] flex items-center justify-center text-[#8e9aa8] hover:text-white hover:bg-[#18202c] transition-colors relative"
          title="Alertes de surveillance des contrats"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#5ea37e] absolute top-2 right-2 ring-2 ring-[#0c1017]"></span>
        </button>

        {/* The Exact Action Button from Screenshot: + INITIALIZE AGENT */}
        <button
          onClick={() => onRunAgent('portfolio')}
          className="px-4 py-2 rounded-full bg-[#18231e] hover:bg-[#203129] border border-[#5ea37e]/40 text-[#d8efa3] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#5ea37e]" />
          <span className="hidden sm:inline">INITIALIZE AGENT</span>
        </button>

        {/* Wallet Connection */}
        {walletAddress ? (
          <div className="flex items-center gap-2 bg-[#131821] border border-[#232d3d] rounded-full px-4 py-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#5ea37e]"></span>
            <span className="font-mono text-white tabular-nums">
              {formatAddress(walletAddress)}
            </span>
            <button
              onClick={onDisconnectWallet}
              className="text-[11px] text-[#8e9aa8] hover:text-rose-400 ml-1 transition-colors"
              title="Déconnecter"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            onClick={onConnectWallet}
            disabled={isConnecting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-black bg-[#d8efa3] hover:bg-[#cbe690] rounded-full transition-colors whitespace-nowrap disabled:opacity-50"
          >
            <Wallet className="w-4 h-4" />
            <span>{isConnecting ? 'Connexion...' : 'Connect Wallet'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
