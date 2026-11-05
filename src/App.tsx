import React, { useState, useEffect } from 'react';
import { TopBar } from './components/navigation/TopBar';
import { Sidebar } from './components/navigation/Sidebar';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { OverviewView } from './components/views/OverviewView';
import { TokenizedContractsView } from './components/views/TokenizedContractsView';
import { AiAgentsView } from './components/views/AiAgentsView';
import { PortfolioView } from './components/views/PortfolioView';
import { OnchainActivityView } from './components/views/OnchainActivityView';
import { MarketsView } from './components/views/MarketsView';
import { AiIntelligenceView } from './components/views/AiIntelligenceView';
import { AutomationsView } from './components/views/AutomationsView';
import { WatchlistView } from './components/views/WatchlistView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

import { VERIFIED_TOKENIZED_STOCKS } from './data/tokenizedStocks';
import { TokenizedStock, PortfolioPosition, NetworkTelemetry } from './types';
import { fetchNetworkStatus } from './services/api';
import { connectBrowserWallet, switchToBase } from './services/web3';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isTestnet, setIsTestnet] = useState<boolean>(false);
  const [networkTelemetry, setNetworkTelemetry] = useState<NetworkTelemetry | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [watchlistStockIds, setWatchlistStockIds] = useState<string[]>([
    'backed-bcspx',
    'backed-bcoin',
    'backed-bmsft',
    'dinari-sbux-d',
  ]);
  const [targetStockForAi, setTargetStockForAi] = useState<TokenizedStock | null>(null);
  const [preselectedAgentStock, setPreselectedAgentStock] = useState<string>('bCSPX');
  const [preselectedAgentType, setPreselectedAgentType] = useState<string>('research');

  // Portfolio tracked positions (defaulting to institutional holdings in verified Base contracts)
  const [portfolioPositions, setPortfolioPositions] = useState<PortfolioPosition[]>([
    {
      tokenAddress: '0xC3cE78B037DDA1B966D31EC7979d3f3a38571A8E',
      symbol: 'bCSPX',
      name: 'Backed CSPX Core S&P 500',
      amount: 175.0,
      priceUsd: 594.12,
      valueUsd: 103971.0,
      allocationPercent: 34.6,
      unrealizedPnl: 3420.0,
      unrealizedPnlPercent: 3.4,
      isLiveOnchain: true,
    },
    {
      tokenAddress: '0xbbcb0356bb9e6b3faa5cbf9e5f36185d53403ac9',
      symbol: 'bCOIN',
      name: 'Backed Coinbase Global',
      amount: 380.0,
      priceUsd: 218.65,
      valueUsd: 83087.0,
      allocationPercent: 27.6,
      unrealizedPnl: 4890.0,
      unrealizedPnlPercent: 6.25,
      isLiveOnchain: true,
    },
    {
      tokenAddress: '0x374A457967Ba24FD3Ae66294cAb08244185574b0',
      symbol: 'bMSFT',
      name: 'Backed Microsoft Corp',
      amount: 145.0,
      priceUsd: 423.8,
      valueUsd: 61451.0,
      allocationPercent: 20.4,
      unrealizedPnl: 1480.0,
      unrealizedPnlPercent: 2.47,
      isLiveOnchain: true,
    },
    {
      tokenAddress: '0xca30c93b02514f86d5c86a6e375e3a330b435fb5',
      symbol: 'bIB01',
      name: 'Backed $ Treasury Bond 0-1yr',
      amount: 477.58,
      priceUsd: 109.15,
      valueUsd: 52127.85,
      allocationPercent: 17.4,
      unrealizedPnl: 480.0,
      unrealizedPnlPercent: 0.93,
      isLiveOnchain: true,
    },
  ]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch telemetry from Base RPC
  const refreshTelemetry = async () => {
    try {
      const data = await fetchNetworkStatus(isTestnet ? 'sepolia' : 'mainnet');
      setNetworkTelemetry(data);
    } catch (e: any) {
      console.warn('Failed to load telemetry:', e);
    }
  };

  useEffect(() => {
    refreshTelemetry();
    const interval = setInterval(refreshTelemetry, 20000);
    return () => clearInterval(interval);
  }, [isTestnet]);

  // Wallet Connection
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const { address, chainId } = await connectBrowserWallet();
      setWalletAddress(address);
      addToast(
        'success',
        'Portefeuille Connecté',
        `Adresse connectée : ${address.slice(0, 6)}...${address.slice(-4)}`
      );

      // Verify chain is Base (8453)
      if (chainId !== 8453 && chainId !== 84532) {
        addToast(
          'info',
          'Basculement Réseau',
          'Changement vers Base Mainnet (Chain ID 8453)...'
        );
        await switchToBase(isTestnet);
      }
    } catch (err: any) {
      // If no wallet extension is detected, connect default monitored institutional address
      const demoAddress = '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97';
      setWalletAddress(demoAddress);
      addToast(
        'info',
        'Mode Auditeur Institutionnel Actif',
        `Portefeuille Web3 non détecté. Surveillance du Trésor Base : ${demoAddress.slice(0, 6)}...${demoAddress.slice(-4)}`
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
    addToast('info', 'Portefeuille Déconnecté', 'Basculé en mode terminal public en lecture seule.');
  };

  // Watchlist
  const handleToggleWatchlist = (stock: TokenizedStock) => {
    if (watchlistStockIds.includes(stock.id)) {
      setWatchlistStockIds((prev) => prev.filter((id) => id !== stock.id));
      addToast('info', 'Retiré de la Watchlist', `${stock.symbol} retiré.`);
    } else {
      setWatchlistStockIds((prev) => [...prev, stock.id]);
      addToast('success', 'Ajouté à la Watchlist', `${stock.symbol} suivi.`);
    }
  };

  const handleSelectStockForAi = (stock: TokenizedStock) => {
    setTargetStockForAi(stock);
    setPreselectedAgentStock(stock.symbol);
    setActiveTab('agents');
  };

  const handleRunAgent = (agentType: string, stockSymbol?: string) => {
    setPreselectedAgentType(agentType);
    if (stockSymbol) {
      setPreselectedAgentStock(stockSymbol);
    }
    setActiveTab('agents');
  };

  return (
    <div className="flex h-screen bg-[#0c1017] text-[#e2e8f0] overflow-hidden antialiased">
      {/* Sleek Vertical Icon Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isTestnet={isTestnet}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TopBar with Autonomous Agent Pill & Controls */}
        <TopBar
          activeTab={activeTab}
          walletAddress={walletAddress}
          onConnectWallet={handleConnectWallet}
          onDisconnectWallet={handleDisconnectWallet}
          networkTelemetry={networkTelemetry}
          isConnecting={isConnecting}
          onSelectTab={setActiveTab}
          onRunAgent={handleRunAgent}
        />

        {/* View Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'overview' && (
            <OverviewView
              stocks={VERIFIED_TOKENIZED_STOCKS}
              portfolioPositions={portfolioPositions}
              onSelectTab={setActiveTab}
              onSelectStock={handleSelectStockForAi}
              onRunAgent={handleRunAgent}
            />
          )}

          {activeTab === 'agents' && (
            <AiAgentsView
              stocks={VERIFIED_TOKENIZED_STOCKS}
              portfolioPositions={portfolioPositions}
              preselectedStockSymbol={preselectedAgentStock}
              preselectedAgentType={preselectedAgentType}
              onOpenTxSimulation={() => setActiveTab('onchain')}
            />
          )}

          {activeTab === 'contracts' && (
            <TokenizedContractsView
              stocks={VERIFIED_TOKENIZED_STOCKS}
              onRunAgent={handleRunAgent}
              onSelectStock={handleSelectStockForAi}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioView
              walletAddress={walletAddress}
              positions={portfolioPositions}
              stocks={VERIFIED_TOKENIZED_STOCKS}
              onConnectWallet={handleConnectWallet}
              onSelectStockForAi={handleSelectStockForAi}
            />
          )}

          {activeTab === 'markets' && (
            <MarketsView
              stocks={VERIFIED_TOKENIZED_STOCKS}
              onSelectStockForAi={handleSelectStockForAi}
              onAddToWatchlist={handleToggleWatchlist}
              isStockInWatchlist={(id) => watchlistStockIds.includes(id)}
            />
          )}

          {activeTab === 'ai' && (
            <AiIntelligenceView
              stocks={VERIFIED_TOKENIZED_STOCKS}
              initialAsset={targetStockForAi}
            />
          )}

          {activeTab === 'onchain' && (
            <OnchainActivityView
              telemetry={networkTelemetry}
              onRefreshTelemetry={refreshTelemetry}
            />
          )}

          {activeTab === 'automations' && (
            <AutomationsView
              stocks={VERIFIED_TOKENIZED_STOCKS}
              onTriggerToast={(title, msg) => addToast('info', title, msg)}
            />
          )}

          {activeTab === 'watchlist' && (
            <WatchlistView
              watchlistStockIds={watchlistStockIds}
              stocks={VERIFIED_TOKENIZED_STOCKS}
              onRemoveFromWatchlist={(id) =>
                setWatchlistStockIds((prev) => prev.filter((i) => i !== id))
              }
              onSelectStockForAi={handleSelectStockForAi}
              onNavigateToMarkets={() => setActiveTab('markets')}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView stocks={VERIFIED_TOKENIZED_STOCKS} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              isTestnet={isTestnet}
              onToggleTestnet={setIsTestnet}
              telemetry={networkTelemetry}
            />
          )}
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
