import React, { useState } from 'react';
import {
  Brain,
  Send,
  Sparkles,
  Bot,
  ShieldAlert,
  FileText,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { TokenizedStock } from '../../types';
import { generateAiAnalysis } from '../../services/api';

interface AiIntelligenceViewProps {
  stocks: TokenizedStock[];
  initialAsset?: TokenizedStock | null;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export const AiIntelligenceView: React.FC<AiIntelligenceViewProps> = ({
  stocks,
  initialAsset,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: `Welcome to **STOCKMIND AI Intelligence**. I am your institutional research assistant grounded in tokenized securities on the Base blockchain (Chain ID: 8453).

**My Core Capabilities:**
- **Regulatory & Custody Analysis**: Evaluating SEC Form TA-1 Transfer Agent structures (Dinari dShares), Swiss DLT collateralization (Backed Finance), and synthetic perp protocols.
- **Onchain Equity Comparisons**: Spreads between Base L2 prices and traditional NYSE/NASDAQ feeds, liquidity depth, and redemption paths.
- **Risk Stress-Testing**: Smart contract audit status, bankruptcy-remote SPV safeguards, and de-pegging scenario models.
- **Contract Explanations**: Decoded calldata, spending allowances, and gas efficiency analysis on Base.

Select a prompt below or ask any question regarding tokenized stocks on Base.`,
      timestamp: '11:42 AM',
    },
  ]);

  const [inputQuery, setInputQuery] = useState(
    initialAsset ? `Analyze the regulatory backing, onchain liquidity, and counterparty risks for ${initialAsset.symbol} on Base.` : ''
  );
  const [selectedAsset, setSelectedAsset] = useState<string>(initialAsset?.symbol || 'All Assets');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const samplePrompts = [
    'Explain the legal difference between Dinari dShares (SEC Form TA-1) vs Backed Finance (Swiss DLT Act) on Base.',
    'What happens if an issuer goes bankrupt? Explain bankruptcy-remote SPV custody safeguards.',
    'How do corporate actions and dividends work for tokenized stocks like bCSPX, bCOIN, and SBUX.d on Base?',
    'Assess the liquidity depth and slippage risks of trading tokenized stocks on Base L2 via Aerodrome.',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await generateAiAnalysis(
        text,
        `Tokenized Stocks on Base Mainnet. Target: ${selectedAsset}. All verified assets: ${stocks.map((s) => s.symbol).join(', ')}.`,
        selectedAsset !== 'All Assets' ? selectedAsset : undefined
      );

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: result.text || 'Analysis completed with no output.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('AI chat failed:', err);
      setErrorMessage(
        err.message || 'Gemini processing encountered an error. Please verify the API key in the Secrets panel.'
      );
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: `⚠️ **Intelligence Engine Notice**: Unable to complete AI inference.\n\n*Details*: ${err.message || 'API request failed'}.\n\nPlease ensure \`GEMINI_API_KEY\` is configured in the environment. In the meantime, all onchain reads and market data continue to operate normally.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-[#0b101d] border border-[#1a2335] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
            <Brain className="w-4 h-4" />
            <span>GEMINI 3.8 FLASH ENGINE · SERVER-SIDE GROUNDED</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            AI Financial Intelligence Terminal
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Distinguishes verified facts, SEC disclosures, market estimates, and hypothetical scenarios. Never fabricates prices or ownership.
          </p>
        </div>

        {/* Target Asset Selector */}
        <div className="flex items-center gap-2 bg-[#0e1424] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs">
          <span className="text-slate-400">Context:</span>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="All Assets" className="bg-[#0b101d] text-white">All Base Equities</option>
            {stocks.map((s) => (
              <option key={s.id} value={s.symbol} className="bg-[#0b101d] text-white">
                {s.symbol} — {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggested Inquiries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="p-3 rounded-lg bg-[#0b101d] hover:bg-[#121a2c] border border-[#1a2335] text-left text-xs text-slate-300 hover:text-white transition-all flex items-start gap-2 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <span className="line-clamp-2 leading-relaxed">{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-[#0b101d] border border-[#1a2335] rounded-xl p-5 min-h-[440px] max-h-[620px] flex flex-col justify-between space-y-4">
        <div className="overflow-y-auto space-y-4 pr-1">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-3xl rounded-xl p-4 text-xs leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-[#162035] border border-[#243350] text-slate-100'
                      : 'bg-[#0e1424] border border-[#19243a] text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pb-1 border-b border-[#1f2c42]">
                    <span className="font-semibold text-slate-300">
                      {isUser ? 'Institutional Allocator' : 'STOCKMIND Intelligence'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-emerald-400 transition-colors"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap font-sans text-slate-200">
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-400 font-mono">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>STOCKMIND AI synthesizing onchain facts & SEC disclosures...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-[#172030] flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask anything about tokenized stock backing, Base smart contracts, or risks..."
            className="flex-1 px-4 py-2.5 bg-[#0e1424] border border-[#1e293b] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 text-black font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
