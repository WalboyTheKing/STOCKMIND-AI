import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Calendar,
  UserCheck,
  ExternalLink,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { ResearchMemo, TokenizedStock } from '../../types';
import { generateInstitutionalReport } from '../../services/api';

interface ReportsViewProps {
  stocks: TokenizedStock[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ stocks }) => {
  const [reports, setReports] = useState<ResearchMemo[]>([
    {
      id: 'memo-1',
      title: 'Backed CSPX Core S&P 500 (bCSPX): Base L2 Custody & Redemption Audit',
      assetSymbol: 'bCSPX',
      issuer: 'Backed Finance',
      rating: 'Overweight',
      summary:
        'Exhaustive analysis of Backed Assets Swiss DLT framework, Maerki Baumann private banking custody segregation, and onchain Base liquidity performance.',
      fullContent: `# Institutional Intelligence Memo: Backed CSPX Core S&P 500 (bCSPX) on Base

## Executive Summary
Backed CSPX Core S&P 500 (bCSPX) deployed on Base Mainnet (Contract: \`0xC3cE78B037DDA1B966D31EC7979d3f3a38571A8E\`) represents a legally sound, 1:1 asset-backed tokenized index certificate. Issued by Backed Assets GmbH under the Swiss Federal Act on Distributed Electronic Registries (DLT Act), token holders hold direct claim rights backed by physical iShares Core S&P 500 UCITS ETF shares in segregated institutional custody.

## Regulatory & Legal Architecture
- **Swiss DLT Act Framework**: Compliant with the Swiss DLT Act. Full regulatory prospectus approved by the Financial Market Authority (FMA) of Liechtenstein.
- **Custody Mechanism**: Real underlying index shares are held in bankruptcy-remote accounts with Maerki Baumann & Co. Private Bank in Zurich.
- **Corporate Actions**: Dividend distributions pass through via onchain compounding or automated token balance adjustments.

## Base L2 Performance & Liquidity
- **Settlement Speed**: 2-second block finality on Base.
- **Transaction Costs**: Typical gas fees range between $0.002 and $0.005 USD, making rebalancing highly economical compared to Ethereum L1 mainnet.
- **Onchain Verification**: 4,278 deployed code bytes, 10,000 total supply units verifiable via Base Mainnet RPC.

## Risk Audit
- **Counterparty Risk**: Low (segregated Swiss private bank custody).
- **Oracle / Tracking Gap**: Minimal (<0.05% spread during regular trading hours).
- **Smart Contract Security**: Audited ERC-20 contract with non-upgradeable accounting logic.

## Institutional Verdict
**Rating: Overweight**. Recommended as core collateral for onchain treasury management and institutional tokenized equity portfolios on Base.`,
      generatedAt: '2026-11-04T16:30:00Z',
      analyst: 'STOCKMIND AI Research Engine (Gemini 3.8 Flash)',
      tags: ['Base Mainnet', 'Swiss DLT', '1:1 Backed', 'S&P 500'],
    },
    {
      id: 'memo-2',
      title: 'Tokenized US Treasuries on Base: Backed bIB01 vs Off-Chain Bills',
      assetSymbol: 'bIB01',
      issuer: 'Backed Finance',
      rating: 'Neutral',
      summary:
        'Comparative yield, regulatory compliance under the Swiss DLT Act, and onchain secondary market velocity on Base Mainnet.',
      fullContent: `# Institutional Intelligence Memo: Backed $ Treasury Bond 0-1yr (bIB01)

## Executive Summary
Backed Assets GmbH issues bIB01 as a tokenized tracker certificate representing the iShares $ Treasury Bond 0-1yr UCITS ETF on Base Mainnet (Contract: \`0xca30c93b02514f86d5c86a6e375e3a330b435fb5\`).

## Legal Structure
- Issued under the Swiss DLT Act and EEA-compliant prospectus.
- Collateral held with Maerki Baumann & Co. Private Bank in Zurich.
- Token holders possess a contractual claim to the collateral value.

## Yield & Secondary Market Profile
- Current Underlying Yield: ~4.52% annualized.
- Instant 24/7 transferability across Base L2 DeFi money markets without banking cut-off times.
- 10,000 total supply units deployed on Base Mainnet.

## Considerations
- Non-US persons only (Reg S restrictions).
- Zero counterparty credit exposure to unregulated stablecoin reserves.`,
      generatedAt: '2026-11-03T11:15:00Z',
      analyst: 'STOCKMIND AI Research Engine',
      tags: ['Fixed Income', 'Swiss DLT', 'Yield', 'Treasuries'],
    },
  ]);

  const [selectedMemo, setSelectedMemo] = useState<ResearchMemo | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetStock, setTargetStock] = useState('bCSPX');
  const [timeHorizon, setTimeHorizon] = useState('Medium-Term (6-12 Months)');
  const [copied, setCopied] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    const stockObj = stocks.find((s) => s.symbol === targetStock);
    try {
      const memo = await generateInstitutionalReport({
        title: `${stockObj?.name || targetStock} Institutional Intelligence Memo`,
        symbol: targetStock,
        issuer: stockObj?.issuer || 'Dinari dShares',
        timeHorizon,
      });

      setReports((prev) => [memo, ...prev]);
      setSelectedMemo(memo);
    } catch (err: any) {
      alert('Failed to generate report: ' + (err.message || 'Gemini API key error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = (memo: ResearchMemo) => {
    const blob = new Blob([memo.fullContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${memo.assetSymbol}-STOCKMIND-Research-Memo.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
            <FileText className="w-4 h-4" />
            <span>INSTITUTIONAL RESEARCH DESK</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Tokenized Equity Intelligence Memos
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Publication-grade institutional research generated by Gemini 3.8 Flash, evaluating custody safeguards, Base liquidity, and regulatory frameworks.
          </p>
        </div>

        {/* Generate Button Trigger */}
        <div className="flex items-center gap-2 bg-[#0e1424] border border-[#1e293b] p-1.5 rounded-lg">
          <select
            value={targetStock}
            onChange={(e) => setTargetStock(e.target.value)}
            className="px-2.5 py-1.5 bg-transparent text-xs font-semibold text-emerald-400 focus:outline-none cursor-pointer"
          >
            {stocks.map((s) => (
              <option key={s.id} value={s.symbol} className="bg-[#0b101d] text-white">
                {s.symbol}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black font-semibold text-xs rounded transition-colors flex items-center gap-1.5"
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isGenerating ? 'Synthesizing...' : 'Generate New Memo'}</span>
          </button>
        </div>
      </div>

      {/* Reports Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((memo) => (
          <div
            key={memo.id}
            onClick={() => setSelectedMemo(memo)}
            className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] hover:border-emerald-500/40 transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {memo.assetSymbol}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400">{memo.issuer}</span>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    memo.rating === 'Overweight'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {memo.rating}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors mt-2 leading-snug">
                {memo.title}
              </h3>

              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {memo.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[#172030] flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>{new Date(memo.generatedAt).toLocaleDateString()}</span>
              <span className="text-emerald-400 group-hover:underline">Read Full Memo →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Memo Reader Modal */}
      {selectedMemo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-[#1a2335] rounded-xl max-w-3xl w-full p-6 space-y-5 max-h-[88vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-[#172030]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <span>{selectedMemo.assetSymbol}</span>
                  <span>·</span>
                  <span>{selectedMemo.issuer}</span>
                  <span>·</span>
                  <span>Rating: {selectedMemo.rating}</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{selectedMemo.title}</h2>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Analyst: {selectedMemo.analyst} · Published: {new Date(selectedMemo.generatedAt).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => setSelectedMemo(null)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-invert max-w-none text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-3">
              {selectedMemo.fullContent}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#172030] flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                STOCKMIND AI Institutional Research Desk
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyContent(selectedMemo.fullContent)}
                  className="px-3 py-1.5 bg-[#141b2a] hover:bg-[#1f2b42] text-slate-300 border border-[#202c40] text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() => handleDownloadMarkdown(selectedMemo)}
                  className="px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
