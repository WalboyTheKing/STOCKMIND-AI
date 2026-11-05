import React, { useState, useEffect } from 'react';
import {
  Zap,
  Plus,
  Bell,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Lock,
  ExternalLink,
  Shield,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { AutomationRule, TokenizedStock } from '../../types';
import { fetchNetworkStatus } from '../../services/api';

interface AutomationsViewProps {
  stocks: TokenizedStock[];
  onTriggerToast?: (title: string, message: string) => void;
}

const DEFAULT_RULES: AutomationRule[] = [
  {
    id: 'rule-bcspx-price',
    title: 'bCSPX Index Breakout Alert',
    type: 'price_threshold',
    targetAsset: 'bCSPX',
    condition: 'Price exceeds $600.00 USD',
    thresholdValue: '600.00',
    action: 'notify_only',
    isActive: true,
    requiresSignature: false,
    lastTriggered: '10 mins ago',
    createdAt: '2026-11-01',
  },
  {
    id: 'rule-bcoin-mint',
    title: 'Backed bCOIN Custody Issuance Monitor',
    type: 'whale_movement',
    targetAsset: 'bCOIN',
    condition: 'Issuer mints > 500 new tokenized shares',
    thresholdValue: '500',
    action: 'generate_memo',
    isActive: true,
    requiresSignature: false,
    lastTriggered: '2 hours ago',
    createdAt: '2026-11-02',
  },
  {
    id: 'rule-gas-guardian',
    title: 'Base L2 Gas Guardian',
    type: 'contract_pause',
    targetAsset: 'Base Network',
    condition: 'OP Stack Gas price < 0.01 Gwei (Optimal for batching)',
    thresholdValue: '0.01 Gwei',
    action: 'notify_only',
    isActive: true,
    requiresSignature: false,
    lastTriggered: 'Just now',
    createdAt: '2026-11-03',
  },
  {
    id: 'rule-weekly-rebalance',
    title: 'Institutional Treasury Rebalance Memo',
    type: 'weekly_digest',
    targetAsset: 'All Verified Tokens',
    condition: 'Every Monday 09:00 EST',
    thresholdValue: 'Weekly',
    action: 'generate_memo',
    isActive: true,
    requiresSignature: true,
    lastTriggered: 'Nov 03, 2026',
    createdAt: '2026-11-01',
  },
];

const STORAGE_KEY = 'stockmind_automations_v1';

export const AutomationsView: React.FC<AutomationsViewProps> = ({
  stocks,
  onTriggerToast,
}) => {
  const [rules, setRules] = useState<AutomationRule[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load rules from localStorage:', e);
    }
    return DEFAULT_RULES;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<AutomationRule['type']>('price_threshold');
  const [newTarget, setNewTarget] = useState('bCSPX');
  const [newCondition, setNewCondition] = useState('');
  const [newAction, setNewAction] = useState<AutomationRule['action']>('notify_only');

  const [isHeartbeatActive, setIsHeartbeatActive] = useState(true);
  const [lastHeartbeatTime, setLastHeartbeatTime] = useState<string>(new Date().toLocaleTimeString());

  // Save rules to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
    } catch (e) {
      console.warn('Failed to persist rules to localStorage:', e);
    }
  }, [rules]);

  // Client-side 15-second heartbeat evaluating live Base network conditions
  useEffect(() => {
    if (!isHeartbeatActive) return;

    const interval = setInterval(async () => {
      try {
        const net = await fetchNetworkStatus('mainnet');
        setLastHeartbeatTime(new Date().toLocaleTimeString());

        // Check if gas guardian rule triggers
        const gasPrice = parseFloat(net.gasPriceGwei);
        if (gasPrice < 0.05) {
          setRules((prev) =>
            prev.map((r) =>
              r.id === 'rule-gas-guardian' && r.isActive
                ? { ...r, lastTriggered: `Base #${net.blockNumber} (${net.gasPriceGwei} Gwei)` }
                : r
            )
          );
        }
      } catch (e) {
        // quiet error
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isHeartbeatActive]);

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleTriggerManually = (rule: AutomationRule) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === rule.id
          ? { ...r, lastTriggered: `Manual test at ${new Date().toLocaleTimeString()}` }
          : r
      )
    );
    if (onTriggerToast) {
      onTriggerToast(
        `Automation Triggered: ${rule.title}`,
        `Condition evaluated successfully for ${rule.targetAsset}.`
      );
    }
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const rule: AutomationRule = {
      id: `rule-${Date.now()}`,
      title: newTitle,
      type: newType,
      targetAsset: newTarget,
      condition: newCondition || 'Standard monitoring condition',
      thresholdValue: 'Active',
      action: newAction,
      isActive: true,
      requiresSignature: newAction === 'propose_transaction',
      lastTriggered: null,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setRules((prev) => [rule, ...prev]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewCondition('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
            <Zap className="w-4 h-4" />
            <span>TRANSPARENT AUTOMATION ENGINE</span>
            <span>·</span>
            <span className="text-slate-400">Heartbeat: {lastHeartbeatTime}</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            User-Authorized Automations & Onchain Monitors
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Configure automated monitors for prices, contract states, and reserve mints. Any transaction triggered by an automation strictly requires explicit wallet authorization.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Automation Rule</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-4 rounded-xl border transition-all ${
              rule.isActive
                ? 'bg-[#0b101d] border-[#1a2335]'
                : 'bg-[#080c16] border-[#141b2b] opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      rule.isActive ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  ></span>
                  <h3 className="text-sm font-semibold text-white">{rule.title}</h3>
                </div>
                <div className="text-xs font-mono text-emerald-400">
                  Target: {rule.targetAsset}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleTriggerManually(rule)}
                  title="Test condition now"
                  className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-[#141d30] rounded transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                    rule.isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {rule.isActive ? 'Active' : 'Paused'}
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-[#141d30] rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#162030] grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Trigger Condition</span>
                <span className="text-slate-300 font-mono text-[11px]">{rule.condition}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Execution Mode</span>
                <span className="text-slate-300 font-medium">
                  {rule.action === 'notify_only'
                    ? 'In-App Notification'
                    : rule.action === 'propose_transaction'
                    ? 'Propose Transaction (Requires Sig)'
                    : 'Generate Research Memo'}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-[#141b2b]">
              <span>Created {rule.createdAt}</span>
              <span className="font-mono text-slate-400">
                {rule.lastTriggered ? `Last: ${rule.lastTriggered}` : 'Never triggered'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0b101d] border border-[#1a2335] rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#162030] pb-3">
              <h3 className="text-sm font-semibold text-white">Create Automation Rule</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. bCOIN Price Spike Alert"
                  className="w-full px-3 py-2 bg-[#0e1424] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Rule Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0e1424] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                  >
                    <option value="price_threshold">Price Threshold</option>
                    <option value="whale_movement">Reserve Mint / Burn</option>
                    <option value="contract_pause">Contract State Monitor</option>
                    <option value="weekly_digest">Weekly Memo Digest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Target Asset</label>
                  <select
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0e1424] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                  >
                    {stocks.map((s) => (
                      <option key={s.symbol} value={s.symbol}>
                        {s.symbol} ({s.issuer})
                      </option>
                    ))}
                    <option value="Base Network">Base Network (Gas)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Trigger Condition Description</label>
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g. Price exceeds $250.00 USD"
                  className="w-full px-3 py-2 bg-[#0e1424] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Action to Take</label>
                <select
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#0e1424] border border-[#1e293b] rounded-lg text-white focus:outline-none"
                >
                  <option value="notify_only">In-App Notification Only</option>
                  <option value="generate_memo">Generate Institutional AI Research Memo</option>
                  <option value="propose_transaction">Propose Transaction (Requires User Signature)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#162030] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black font-semibold rounded-lg"
                >
                  Save Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
