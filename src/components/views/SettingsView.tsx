import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Globe,
  Lock,
  ExternalLink,
  Award,
  CheckCircle2,
  Server,
  Zap,
  RefreshCw,
  KeyRound,
  Radio,
  AlertTriangle,
} from 'lucide-react';
import { NetworkTelemetry } from '../../types';
import { fetchProvidersStatus, ExternalProviderInfo } from '../../services/api';

interface SettingsViewProps {
  isTestnet: boolean;
  onToggleTestnet: (val: boolean) => void;
  telemetry: NetworkTelemetry | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isTestnet,
  onToggleTestnet,
  telemetry,
}) => {
  const [currency, setCurrency] = useState('USD');
  const [riskTolerance, setRiskTolerance] = useState('Moderate Institutional');
  const [providers, setProviders] = useState<ExternalProviderInfo[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string | null>(null);

  const loadProviders = async () => {
    setIsLoadingProviders(true);
    try {
      const data = await fetchProvidersStatus();
      setProviders(data.providers || []);
      setLastCheckTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load providers status:', err);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const competitionMilestones = [
    {
      date: 'Nov 01, 2026',
      title: 'Phase 1: Research & Legal Architecture Validation',
      status: 'completed',
      detail:
        'Audited Dinari Securities SEC Form TA-1 registration (#0001995874), Alpaca broker-dealer custody model, and Backed Finance Swiss DLT framework. Mapped verified contract addresses on Base Mainnet (8453).',
    },
    {
      date: 'Nov 02, 2026',
      title: 'Phase 2: Institutional Terminal Design & Typography',
      status: 'completed',
      detail:
        'Built institutional interface following zero-pill discipline, tabular numeral typography (JetBrains Mono & Plus Jakarta Sans), and responsive layout math.',
    },
    {
      date: 'Nov 03, 2026',
      title: 'Phase 3: Base Onchain Read Integration (Viem RPC)',
      status: 'completed',
      detail:
        'Engineered live Base Mainnet RPC client with viem. Implemented ERC-20 symbol, decimals, totalSupply reads, and block telemetry without mock dependencies.',
    },
    {
      date: 'Nov 04, 2026',
      title: 'Phase 4: Server-Side Gemini 3.8 Flash AI Engine',
      status: 'completed',
      detail:
        'Configured secure server-side proxy using @google/genai with User-Agent telemetry. Built research prompts distinguishing SEC facts from speculative estimates.',
    },
    {
      date: 'Nov 05, 2026',
      title: 'Phase 5: STOCKMIND AGENT Cluster & Safety Gateway',
      status: 'completed',
      detail:
        'Deployed 5 specialized financial agents (Portfolio, Market Research, Onchain Monitor, Risk Intelligence, Tx Explanation) with strict human-in-the-loop authorization gates.',
    },
    {
      date: 'Nov 05, 2026',
      title: 'Phase 6: User-Authorized Automations & Transaction Simulator',
      status: 'active',
      detail:
        'Built automation engine for price dips, contract pause monitors, and whale transfers with zero blind execution.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
            <Settings className="w-4 h-4" />
            <span>SYSTEM CONFIGURATION & COMPETITION DISCLOSURES</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Settings & Base Stocks Maxxing Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Network RPC endpoints, security guarantees, and official build-in-public competition milestones for the Base Stocks Maxxing competition (Nov–Dec 2026).
          </p>
        </div>

        <a
          href="https://www.base.org/stocksmaxxing"
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-2 bg-[#141b2a] hover:bg-[#1f2b42] text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Award className="w-4 h-4" />
          <span>Official Competition Site</span>
          <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </div>

      {/* Network Configuration */}
      <div className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Base Network Environment</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => onToggleTestnet(false)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              !isTestnet
                ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                : 'bg-[#0e1424] border-[#1e293b] text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-white">Base Mainnet</span>
              <span className="text-xs font-mono text-emerald-400">Chain ID: 8453</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Production deployment. Production 1:1 SEC-backed dShares and live Base liquidity.
            </p>
            <div className="text-[11px] font-mono text-slate-500 mt-2 truncate">
              RPC: https://mainnet.base.org · Explorer: basescan.org
            </div>
          </div>

          <div
            onClick={() => onToggleTestnet(true)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              isTestnet
                ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                : 'bg-[#0e1424] border-[#1e293b] text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-white">Base Sepolia Testnet</span>
              <span className="text-xs font-mono text-emerald-400">Chain ID: 84532</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Developer sandbox. Zero-cost testing of smart contract interactions.
            </p>
            <div className="text-[11px] font-mono text-slate-500 mt-2 truncate">
              RPC: https://sepolia.base.org · Explorer: sepolia.basescan.org
            </div>
          </div>
        </div>
      </div>

      {/* External Providers & API Keys Diagnostic Panel */}
      <div className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <KeyRound className="w-4 h-4" />
              <span>INTÉGRATIONS OFFICIELLES & CONNECTIVITÉ MULTI-RAIL</span>
            </div>
            <h3 className="text-sm font-semibold text-white mt-0.5">
              État des 6 Fournisseurs Externes (Mode Résilient Sans Clé Actif)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Architecture Zero-Key : l'application fonctionne à 100% sans aucune clé obligatoire grâce aux RPC publics Base, aux flux Pyth Hermes libres et au routage DEX natif.
            </p>
          </div>

          <button
            onClick={loadProviders}
            disabled={isLoadingProviders}
            className="self-start sm:self-auto px-3 py-1.5 bg-[#141b2a] hover:bg-[#1a2337] text-slate-200 border border-[#202b40] rounded-lg text-xs font-mono flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProviders ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
            <span>Tester les Connexions</span>
            {lastCheckTime && <span className="text-[10px] text-slate-500">({lastCheckTime})</span>}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {providers.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-[#0e1424] border border-[#1a2335] flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-white block">{p.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {p.variable}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full shrink-0 ${
                      p.online
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        p.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    {p.online ? 'Connecté' : 'Mode Fallback'}
                  </span>
                </div>

                <div className="mt-2.5 space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-slate-500">Mode :</span>
                    <span className="text-slate-300 text-right truncate max-w-[160px]">{p.mode}</span>
                  </div>

                  {p.latencyMs !== undefined && (
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-slate-500">Latence :</span>
                      <span className="text-emerald-400">{p.latencyMs} ms</span>
                    </div>
                  )}

                  {p.blockHeight !== undefined && p.blockHeight > 0 && (
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-slate-500">Bloc actuel :</span>
                      <span className="text-white">#{p.blockHeight.toLocaleString()}</span>
                    </div>
                  )}

                  {p.endpoint && (
                    <div className="text-[10px] font-mono text-slate-500 truncate pt-1">
                      Endpoint: {p.endpoint}
                    </div>
                  )}

                  {p.paymentMethods && (
                    <div className="text-[10px] text-slate-400 pt-1">
                      <span className="text-slate-500 block">Canaux supportés :</span>
                      {p.paymentMethods.join(' · ')}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-[#162032] flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono text-[10px]">
                  {p.isMandatory ? 'Clé Requise' : 'Optionnel (Sans clé)'}
                </span>

                <a
                  href={p.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono transition-colors"
                >
                  <span>Doc Officielle</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Non-Custodial Manifesto */}
      <div className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>SECURITY & COMPLIANCE CONSTITUTION</span>
        </div>
        <h3 className="text-sm font-semibold text-white">Non-Custodial Architecture & Financial Safety</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-lg bg-[#0e1424] border border-[#172030] space-y-1">
            <span className="font-semibold text-slate-200">1. Zero Private Key Access</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              STOCKMIND AI never requests or stores private keys or seed phrases. All interactions use standard EIP-1193 browser signatures.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0e1424] border border-[#172030] space-y-1">
            <span className="font-semibold text-slate-200">2. No Autonomous Execution</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              AI agents analyze, monitor, and synthesize — but can NEVER move funds or approve allowances without your explicit wallet approval.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0e1424] border border-[#172030] space-y-1">
            <span className="font-semibold text-slate-200">3. Data Integrity & Provenance</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Every metric specifies whether it originates from live Base RPC reads, SEC Form TA-1 disclosures, or simulated demonstration models.
            </p>
          </div>
        </div>
      </div>

      {/* Base Stocks Maxxing Build-in-Public Progress Log */}
      <div className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Award className="w-4 h-4" />
              <span>BASE STOCKS MAXXING · AGENTIC STOCK FINANCE</span>
            </div>
            <h3 className="text-sm font-semibold text-white mt-0.5">
              Build in Public: Dated Development Progress Log
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Competition Rubric: 50% Traction · 25% Product & Architecture · 25% Build in Public
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {competitionMilestones.map((m, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-[#0e1424] border border-[#172030] flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-white">{m.title}</span>
                  <span className="text-slate-500 text-[11px]">{m.date}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{m.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
