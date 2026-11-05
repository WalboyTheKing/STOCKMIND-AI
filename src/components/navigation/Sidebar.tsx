import React from 'react';
import {
  LayoutDashboard,
  PieChart,
  ShieldCheck,
  Bot,
  Settings,
  Flame,
  Activity,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isTestnet: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'agents', label: 'STOCKMIND AGENT', icon: Bot },
    { id: 'contracts', label: '9 Contrats Tokenisés & Audit', icon: ShieldCheck },
    { id: 'portfolio', label: 'Portfolio & Positions', icon: PieChart },
    { id: 'onchain', label: 'Onchain Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-18 md:w-20 bg-[#0c1017] border-r border-[#1a2333] flex flex-col items-center py-6 shrink-0 select-none z-20">
      {/* Top Brand Squircle Emblem */}
      <button
        onClick={() => onSelectTab('overview')}
        className="w-11 h-11 rounded-2xl bg-[#5ea37e] hover:bg-[#6cb38c] flex items-center justify-center text-[#0c1017] shadow-lg shadow-[#5ea37e]/20 transition-all focus:outline-none group mb-8"
        title="STOCKMIND AI"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 fill-current transition-transform group-hover:scale-105"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 10.9 12 11.5 12 13h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 .88-.36 1.68-.93 2.25z" fill="none"/>
          <path d="M7 14c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S4 4.34 4 6v5c0 1.66 1.34 3 3 3zm6 4c2.21 0 4-1.79 4-4v-1h-2v1c0 1.1-.9 2-2 2s-2-.9-2-2v-1H9v1c0 2.21 1.79 4 4 4zm4-9h-2V6c0-1.1-.9-2-2-2s-2 .9-2 2H9c0-2.21 1.79-4 4-4s4 1.79 4 4v3z" />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M8 12c1.5-2 3.5-3 5.5-1.5s2.5 3.5 4 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Navigation Icons Rail with Ambient Capsule Glow on Active */}
      <nav className="flex-1 flex flex-col items-center space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div key={item.id} className="relative group flex items-center justify-center">
              {/* Glowing vertical pill aura behind active icon */}
              {isActive && (
                <div className="absolute inset-0 -m-1 rounded-2xl bg-gradient-to-b from-[#5ea37e]/30 via-[#5ea37e]/15 to-transparent blur-md"></div>
              )}

              <button
                onClick={() => onSelectTab(item.id)}
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#18231e] text-[#d8efa3] border border-[#5ea37e]/40 shadow-inner'
                    : 'text-[#8e9aa8] hover:text-white hover:bg-[#151c27]'
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#d8efa3]' : 'text-[#8e9aa8]'}`} />
              </button>

              {/* Tooltip on Hover */}
              <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#18202c] border border-[#2a3444] text-xs text-white font-medium whitespace-nowrap shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom Status Dot */}
      <div className="flex flex-col items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-[#5ea37e] animate-pulse"></span>
        <span className="text-[9px] font-mono text-[#8e9aa8]">8453</span>
      </div>
    </aside>
  );
};
