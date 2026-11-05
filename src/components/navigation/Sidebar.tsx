import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Brain,
  PieChart,
  Blocks,
  Bot,
  Zap,
  Bookmark,
  FileText,
  Settings,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isTestnet: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, isTestnet }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'ai', label: 'AI Intelligence', icon: Brain },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'onchain', label: 'Onchain Activity', icon: Blocks },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'automations', label: 'Automations', icon: Zap },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#070a12] border-r border-[#1a2333] flex flex-col shrink-0 select-none">
      {/* Platform Sub-Header */}
      <div className="px-5 py-3 border-b border-[#141b29] flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-slate-300 tracking-wider text-[11px] uppercase">
          Financial Terminal
        </span>
        <span className="font-mono text-[10px] text-emerald-400">
          {isTestnet ? 'Base Sepolia' : 'Base 8453'}
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f1728]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Base Stocks Maxxing Competition Notice */}
      <div className="p-3 mx-3 mb-4 rounded-lg bg-[#0d1424] border border-[#1e2a3f] text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">Base Stocks Maxxing</span>
          <span className="text-[10px] text-emerald-400 font-mono">2026</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Track: Agentic Stock Finance on Base L2. Verified onchain utility.
        </p>
        <a
          href="https://www.base.org/stocksmaxxing"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:underline pt-1"
        >
          <span>Competition Guidelines</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
};
