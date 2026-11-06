import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Globe,
  Coins,
  TrendingUp,
  Layers,
  Bot,
  Landmark,
  Clock,
  HelpCircle,
  Shield,
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  Sliders,
  RefreshCw,
  Share2,
  Calendar,
  Lock,
  Percent,
  Compass,
  AlertTriangle,
  FileCode2,
  Smartphone,
  CreditCard,
  Building,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { TokenizedStock, PortfolioPosition } from '../../types';
import {
  fetchAgentDiary,
  fetchWeekendFeeds,
  estimatePaymasterGas,
  fetchNeobrokerRates,
  getNeobrokerQuote,
  fetchYieldVaults,
  simulateLeverage,
  fetchAmmPoolStatus,
  generateSafePayload,
  fetchPredictionMarkets,
  calculateDerivativesBasis,
} from '../../services/api';
import {
  BASE_PROTOCOLS,
  calculateLeverageMetrics,
  calculateCashAndCarryBasis,
  calculateAmmTickRange,
  buildTreasuryBasketCalldata,
} from '../../services/stocksMaxxingService';

interface StocksMaxxingViewProps {
  stocks: TokenizedStock[];
  portfolioPositions: PortfolioPosition[];
  onSelectStockForAi?: (stock: TokenizedStock) => void;
  onTriggerToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const StocksMaxxingView: React.FC<StocksMaxxingViewProps> = ({
  stocks,
  portfolioPositions,
  onSelectStockForAi,
  onTriggerToast,
}) => {
  // Navigation across the 10 initiatives: 'all' or 1 to 10
  const [activeModule, setActiveModule] = useState<string>('all');
  const [isTestnet, setIsTestnet] = useState<boolean>(false);

  // --- Module 1: Embeddable SDK State ---
  const [sdkFramework, setSdkFramework] = useState<'react' | 'mobile' | 'swift' | 'html'>('react');
  const [sdkAsset, setSdkAsset] = useState<string>('bCSPX');
  const [sdkCopied, setSdkCopied] = useState(false);
  const [rideDemoBought, setRideDemoBought] = useState(false);
  const [paymasterGasData, setPaymasterGasData] = useState<any>(null);

  // --- Module 2: Local Neobroker State ---
  const [selectedCountry, setSelectedCountry] = useState<'br' | 'ke' | 'in' | 'ng' | 'mx' | 'ph'>('br');
  const [fiatAmount, setFiatAmount] = useState<string>('500');
  const [targetNeobrokerStock, setTargetNeobrokerStock] = useState<string>('bCSPX');
  const [neobrokerQuote, setNeobrokerQuote] = useState<any>(null);
  const [neobrokerTxSuccess, setNeobrokerTxSuccess] = useState<string | null>(null);
  const [neobrokerRates, setNeobrokerRates] = useState<any>(null);

  // --- Module 3: Abstracted Yield State ---
  const [yieldVaultsList, setYieldVaultsList] = useState<any[]>([]);
  const [selectedVault, setSelectedVault] = useState<string>('bib01');
  const [depositAmount, setDepositAmount] = useState<number>(10);
  const [vaultDeposited, setVaultDeposited] = useState<boolean>(false);

  // --- Module 4: 1-Click Leverage State ---
  const [leverageAsset, setLeverageAsset] = useState<string>('bMSFT');
  const [leverageRatio, setLeverageRatio] = useState<number>(2.5);
  const [collateralShares, setCollateralShares] = useState<number>(5);
  const [autoDeleverageActive, setAutoDeleverageActive] = useState<boolean>(true);
  const [leverageSimSuccess, setLeverageSimSuccess] = useState<boolean>(false);
  const [leverageSimData, setLeverageSimData] = useState<any>(null);

  // --- Module 5: Managed AMM Pools State ---
  const [ammPoolsData, setAmmPoolsData] = useState<any[]>([]);
  const [selectedAmmPool, setSelectedAmmPool] = useState<string>('bCSPX-USDC');
  const [ammRangeMode, setAmmRangeMode] = useState<'smart_open' | 'weekend_closed'>('smart_open');
  const [ammPositionActive, setAmmPositionActive] = useState<boolean>(false);

  // --- Module 6: Agent Portfolio Diary State ---
  const [diaryText, setDiaryText] = useState<string>('');
  const [diaryLoading, setDiaryLoading] = useState<boolean>(false);
  const [diaryCopied, setDiaryCopied] = useState<boolean>(false);

  // --- Module 7: DAO Treasury Baskets State ---
  const [selectedBasket, setSelectedBasket] = useState<'all_weather' | 'dividend' | 'tech_alpha'>('all_weather');
  const [treasuryAllocationUsd, setTreasuryAllocationUsd] = useState<number>(250000);
  const [safePayloadData, setSafePayloadData] = useState<any>(null);
  const [calldataCopied, setCalldataCopied] = useState<boolean>(false);

  // --- Module 8: Weekend Price Feed State ---
  const [weekendFeedsData, setWeekendFeedsData] = useState<any[]>([]);
  const [pythBenchmark, setPythBenchmark] = useState<any>(null);
  const [feedsLoading, setFeedsLoading] = useState<boolean>(false);

  // --- Module 9: Conditional Prediction Stocks State ---
  const [predictionMarketsList, setPredictionMarketsList] = useState<any[]>([]);
  const [selectedPredictionMarket, setSelectedPredictionMarket] = useState<string>('tsla_robotaxi');
  const [predictionOutcome, setPredictionOutcome] = useState<'YES' | 'NO'>('YES');
  const [predictionContractSize, setPredictionContractSize] = useState<number>(10);
  const [predictionPlaced, setPredictionPlaced] = useState<boolean>(false);

  // --- Module 10: Stock-Collateral Derivatives & Basis State ---
  const [basisStock, setBasisStock] = useState<string>('bCSPX');
  const [spotPositionSize, setSpotPositionSize] = useState<number>(25);
  const [basisAnalysisData, setBasisAnalysisData] = useState<any>(null);

  // Active contracts for current network mode
  const activeNetworkContracts = isTestnet
    ? BASE_PROTOCOLS.sepolia.contracts
    : BASE_PROTOCOLS.mainnet.contracts;

  // Initialize and fetch live data
  useEffect(() => {
    loadAllData();
  }, [isTestnet]);

  const loadAllData = async () => {
    loadDiary();
    loadWeekendFeeds();
    loadNeobrokerRates();
    loadYieldVaults();
    loadPaymasterGas();
    loadAmmPools();
    loadPredictionMarkets();
    loadSafePayload();
    loadBasisData();
  };

  const loadDiary = async () => {
    setDiaryLoading(true);
    try {
      const res = await fetchAgentDiary({
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        currentHoldings: ['bCSPX', 'bCOIN', 'bIB01', 'bMSFT', 'SBUX.d'],
      });
      setDiaryText(res.diary);
    } catch (e: any) {
      console.warn('Failed to load agent diary:', e);
    } finally {
      setDiaryLoading(false);
    }
  };

  const loadWeekendFeeds = async () => {
    setFeedsLoading(true);
    try {
      const res = await fetchWeekendFeeds();
      setWeekendFeedsData(res.feeds || []);
      if (res.pythHermesBenchmark) {
        setPythBenchmark(res.pythHermesBenchmark);
      }
    } catch (e: any) {
      console.warn('Failed to load weekend feeds:', e);
    } finally {
      setFeedsLoading(false);
    }
  };

  const loadPaymasterGas = async () => {
    try {
      const res = await estimatePaymasterGas({ network: isTestnet ? 'sepolia' : 'mainnet' });
      setPaymasterGasData(res);
    } catch (e) {
      console.warn('Paymaster gas estimation fallback:', e);
    }
  };

  const loadNeobrokerRates = async () => {
    try {
      const res = await fetchNeobrokerRates();
      setNeobrokerRates(res.rates);
    } catch (e) {
      console.warn('Neobroker rates fallback:', e);
    }
  };

  const updateNeobrokerQuote = async () => {
    try {
      const res = await getNeobrokerQuote({
        country: selectedCountry,
        localAmount: fiatAmount,
        targetStockSymbol: targetNeobrokerStock,
      });
      setNeobrokerQuote(res);
    } catch (e) {
      console.warn('Neobroker quote fallback:', e);
    }
  };

  useEffect(() => {
    updateNeobrokerQuote();
  }, [selectedCountry, fiatAmount, targetNeobrokerStock]);

  const loadYieldVaults = async () => {
    try {
      const res = await fetchYieldVaults();
      setYieldVaultsList(res.vaults || []);
    } catch (e) {
      console.warn('Yield vaults fallback:', e);
    }
  };

  const runLeverageSim = async () => {
    try {
      const res = await simulateLeverage({
        stockSymbol: leverageAsset,
        collateralShares,
        leverageRatio,
      });
      setLeverageSimData(res);
    } catch (e) {
      // Local fallback math if offline
      const local = calculateLeverageMetrics({
        stockPrice: leverageAsset === 'bMSFT' ? 423.8 : 594.12,
        collateralShares,
        leverageRatio,
      });
      setLeverageSimData(local);
    }
  };

  useEffect(() => {
    runLeverageSim();
  }, [leverageAsset, collateralShares, leverageRatio]);

  const loadAmmPools = async () => {
    try {
      const res = await fetchAmmPoolStatus();
      setAmmPoolsData(res.pools || []);
    } catch (e) {
      console.warn('AMM pool fallback:', e);
    }
  };

  const loadSafePayload = async () => {
    try {
      const res = await generateSafePayload({
        basketType: selectedBasket,
        totalUsd: treasuryAllocationUsd,
      });
      setSafePayloadData(res);
    } catch (e) {
      const local = buildTreasuryBasketCalldata(selectedBasket, treasuryAllocationUsd, isTestnet);
      setSafePayloadData({
        basketName: selectedBasket,
        multiSendContractAddress: activeNetworkContracts.gnosisSafeMultiSendCallOnly,
        totalAllocationUsd: treasuryAllocationUsd,
        actions: local.constituentActions,
      });
    }
  };

  useEffect(() => {
    loadSafePayload();
  }, [selectedBasket, treasuryAllocationUsd, isTestnet]);

  const loadPredictionMarkets = async () => {
    try {
      const res = await fetchPredictionMarkets();
      setPredictionMarketsList(res.markets || []);
    } catch (e) {
      console.warn('Prediction markets fallback:', e);
    }
  };

  const loadBasisData = async () => {
    try {
      const res = await calculateDerivativesBasis({
        stockSymbol: basisStock,
        spotShares: spotPositionSize,
      });
      setBasisAnalysisData(res);
    } catch (e) {
      const local = calculateCashAndCarryBasis({
        spotPrice: basisStock === 'bCSPX' ? 594.12 : 423.8,
        sharesAmount: spotPositionSize,
        annualDividendYieldPercent: 1.48,
        annualFundingRatePercent: 11.4,
      });
      setBasisAnalysisData(local);
    }
  };

  useEffect(() => {
    loadBasisData();
  }, [basisStock, spotPositionSize]);

  const copyToClipboard = (text: string, onDone: () => void) => {
    navigator.clipboard.writeText(text);
    onDone();
    onTriggerToast('success', 'Copié dans le presse-papier', 'Données sécurisées copiées.');
  };

  // Module items definition
  const maxxingItems = [
    { id: '1', title: '01. In-App Tokenized Stocks SDK', tag: 'Embeddable SDK', desc: 'SDK pour intégrer l’achat d’actions dans n’importe quelle application (ex: Uber dans Uber).' },
    { id: '2', title: '02. Country-Specific Neobroker', tag: 'Local Rails', desc: 'On-ramp local direct (PIX, M-PESA, UPI, Naira) vers des actions US sur Base en 3 clics.' },
    { id: '3', title: '03. Abstracted Stock Yield', tag: 'Yield Vaults', desc: 'Rendement passif de 6.5% à 8.25% APY sur vos actions avec toute la DeFi abstraite.' },
    { id: '4', title: '04. One-Click Smart Leverage', tag: 'Automated Loan', desc: 'Emprunt flash automatisé pour acheter plus d’actions, avec coupe-circuit anti-liquidation.' },
    { id: '5', title: '05. Automated Stock AMM Pools', tag: 'Managed Liquidity', desc: 'Fourniture de liquidité AMM concentrée avec ajustement dynamique en weekend.' },
    { id: '6', title: '06. Agent Portfolio & Public Diary', tag: 'Autonomous AI', desc: 'Agent IA autonome publiant un journal quotidien public avec portefeuille vérifiable sur Basescan.' },
    { id: '7', title: '07. Crypto Treasuries Stock Baskets', tag: 'DAO Treasuries', desc: 'Paniers d’actions tokenisées pour DAO avec génération de calldata multi-sig Gnosis Safe.' },
    { id: '8', title: '08. 24/7 Weekend Price Feed', tag: 'Synthetic Oracle', desc: 'Flux de cours synthétique continu 24/7 lorsque Wall Street (NYSE/NASDAQ) est fermé.' },
    { id: '9', title: '09. Conditional Prediction Stocks', tag: 'Event Contingent', desc: 'Actions combinées aux marchés de prédiction (ex: TSLA à 350$ si robotaxis validés).' },
    { id: '10', title: '10. Stock Collateral Derivatives & Basis', tag: 'Delta-Neutral Basis', desc: 'Collatéral d’actions pour trading perpétuel et cash-and-carry basis (+11.4% APY).' },
  ];

  return (
    <div className="space-y-8 text-[#e2e8f0]">
      {/* Top Protocol Status & Network Toggle Strip */}
      <div className="p-4 rounded-xl bg-[#090d16] border border-[#1a2333] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#18231e] border border-[#5ea37e]/40 flex items-center justify-center text-[#d8efa3]">
            <Zap className="w-5 h-5 text-[#5ea37e]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">STOCKS MAXXING PROTOCOL ENGINE</span>
              <span className="text-[10px] font-mono text-[#d8efa3] bg-[#18231e] px-2 py-0.5 rounded border border-[#5ea37e]/30">
                10 INITIATIVES ACTIVES
              </span>
            </div>
            <div className="text-xs text-[#8e9aa8] mt-0.5 font-mono">
              Base L2 (OP Stack) · Contrats vérifiés · Aucun fond réel dépensé sans signature
            </div>
          </div>
        </div>

        {/* Network Mode Switcher */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#8e9aa8] font-mono">Réseau Cible :</span>
          <div className="flex items-center p-1 rounded-lg bg-[#121824] border border-[#1e2738] text-xs font-mono">
            <button
              onClick={() => setIsTestnet(false)}
              className={`px-3 py-1 rounded transition-colors ${
                !isTestnet
                  ? 'bg-[#18231e] text-[#d8efa3] font-semibold border border-[#5ea37e]/40'
                  : 'text-[#8e9aa8] hover:text-white'
              }`}
            >
              Base Mainnet (8453)
            </button>
            <button
              onClick={() => setIsTestnet(true)}
              className={`px-3 py-1 rounded transition-colors ${
                isTestnet
                  ? 'bg-[#253245] text-amber-300 font-semibold border border-amber-400/40'
                  : 'text-[#8e9aa8] hover:text-white'
              }`}
            >
              Base Sepolia (84532)
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Hero Header */}
      <div className="relative rounded-2xl border border-[#1a2333] bg-[#0c1017] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[300px]">
          {/* Left Column: Vision & Thesis */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3 text-xs text-[#8e9aa8] mb-2 font-mono">
                <span className="text-[#5ea37e] font-semibold">STOCKS MAXXING SEASON</span>
                <span aria-hidden="true">·</span>
                <span>{isTestnet ? 'Base Sepolia Testnet (84532)' : 'Base Mainnet L2 (Chain 8453)'}</span>
                <span aria-hidden="true">·</span>
                <span>10 Protocoles Déployés</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                L’Infrastructure Institutionnelle des Actions Tokenisées
              </h1>
              <p className="text-sm text-[#8e9aa8] mt-3 leading-relaxed max-w-xl">
                Stocks Maxxing Season relie les marchés financiers traditionnels et la liquidité programmable de Base.
                Des SDKs in-app pour consommateurs aux oracles de prix de weekend, prêts à désendettement automatique et journaux IA vérifiables.
              </p>
            </div>

            {/* Quick Metrics & Public Wallet Anchor */}
            <div className="pt-4 border-t border-[#1a2333] grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-[11px] text-[#8e9aa8] block">COÛT DU GAZ BASE</span>
                <span className="text-sm font-semibold text-white tabular-nums">
                  {paymasterGasData ? `$${paymasterGasData.gasCostUsd}` : '$0.003 / tx'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#8e9aa8] block">TEMPS DE FINALITÉ</span>
                <span className="text-sm font-semibold text-[#5ea37e] tabular-nums">2.0s OP Stack</span>
              </div>
              <div>
                <span className="text-[11px] text-[#8e9aa8] block">RATIO DE RÉSERVE</span>
                <span className="text-sm font-semibold text-white">100% Adossé 1:1</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
            <img
              src="/src/assets/images/stocks_maxxing_hero_1793956157577.jpg"
              alt="Stocks Maxxing Institutional Terminal"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0c1017] via-transparent to-transparent opacity-90"></div>
          </div>
        </div>
      </div>

      {/* Navigation Filter Segmented Control */}
      <div className="flex items-center gap-1.5 p-1 bg-[#131821] border border-[#1a2333] rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveModule('all')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeModule === 'all'
              ? 'bg-[#1e2736] text-white shadow-sm'
              : 'text-[#8e9aa8] hover:text-white'
          }`}
        >
          Vue d'Ensemble des 10 Protocoles
        </button>
        {maxxingItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeModule === item.id
                ? 'bg-[#18231e] text-[#d8efa3] border border-[#5ea37e]/40 shadow-sm'
                : 'text-[#8e9aa8] hover:text-white'
            }`}
          >
            #{item.id} {item.tag}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 0. ALL 10 MODULES GRID VIEW */}
      {/* ========================================================================= */}
      {activeModule === 'all' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {maxxingItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className="p-5 rounded-xl bg-[#131821] border border-[#1a2333] hover:border-[#5ea37e]/50 hover:bg-[#161d28] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8e9aa8] mb-2 font-mono">
                    <span className="text-[#5ea37e] font-semibold">{item.tag}</span>
                    <span className="text-white font-bold group-hover:translate-x-0.5 transition-transform">
                      &rarr;
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#8e9aa8] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1a2333] flex items-center justify-between text-[11px] text-[#8e9aa8]">
                  <span className="text-emerald-400 font-mono">Actif sur Base L2</span>
                  <span className="font-mono text-slate-300">Ouvrir &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. IN-APP TOKENIZED STOCKS SDK */}
      {/* ========================================================================= */}
      {(activeModule === '1' || activeModule === 'all') && (
        <div className="p-6 rounded-2xl bg-[#131821] border border-[#1a2333] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a2333] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8e9aa8] font-mono">
                <span className="text-[#5ea37e] font-semibold">INITIATIVE 01</span>
                <span aria-hidden="true">·</span>
                <span>SDK D'INTÉGRATION CONSOMMATEUR</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                SDK In-App pour Actions Tokenisées (« Buy Uber in Uber »)
              </h2>
              <p className="text-xs text-[#8e9aa8] mt-1 max-w-2xl leading-relaxed">
                Permet à n'importe quelle application grand public d’intégrer l’achat d’actions tokenisées dans son parcours utilisateur.
                Un passager dans un Uber peut acheter 5 $ de parts d'UBER ou bCSPX en 2 clics avec des frais de gaz entièrement sponsorisés par le Paymaster Base.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#5ea37e] bg-[#18231e] px-2.5 py-1 rounded-md border border-[#5ea37e]/30">
                npm @stockmind/base-sdk
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Interactive In-Ride Uber App Simulator */}
            <div className="p-5 rounded-xl bg-[#090d16] border border-[#1a2333] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-[#8e9aa8] pb-3 border-b border-[#1a2333]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-semibold text-white">Simulateur In-App : Course Uber en cours</span>
                  </div>
                  <span className="font-mono text-[11px]">3.2 mi · 8 min restantes</span>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-[#121824] border border-[#232e42] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#8e9aa8] block">Trajet actif</span>
                      <span className="text-sm font-semibold text-white">SFO Terminal 2 &rarr; Market St</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">24.50 $</span>
                  </div>

                  {/* The Embedded Stock Widget */}
                  <div className="p-3.5 rounded-lg bg-[#182232] border border-[#5ea37e]/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-[#d8efa3]" />
                        <span className="text-xs font-semibold text-white">Devenez copropriétaire pendant votre trajet</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#d8efa3] bg-[#223527] px-1.5 py-0.5 rounded">
                        Zéro Frais de Gaz (Sponsorisé Base)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8e9aa8] leading-tight">
                      Achetez des fractions d'actions adossées 1:1 créditées instantanément dans votre Smart Account.
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      {['5 $', '15 $', '25 $'].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => {
                            setRideDemoBought(true);
                            onTriggerToast('success', 'Achat Simulé Réussi', `Acquisition de ${amt} d'actions tokenisées sur Base.`);
                          }}
                          className="flex-1 py-1.5 bg-[#253245] hover:bg-[#2f3f58] text-white text-xs font-mono font-semibold rounded transition-colors"
                        >
                          {amt}
                        </button>
                      ))}
                    </div>

                    {rideDemoBought && (
                      <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center justify-between font-mono">
                        <span>Reçu : 0.0412 bUBER crédité</span>
                        <a
                          href={isTestnet ? 'https://sepolia.basescan.org' : 'https://basescan.org'}
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:text-white"
                        >
                          Vérifier Basescan
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Paymaster Telemetry */}
              <div className="mt-4 pt-3 border-t border-[#1a2333] flex items-center justify-between text-[11px] text-[#8e9aa8] font-mono">
                <span>
                  Paymaster : {paymasterGasData ? paymasterGasData.paymasterPolicy : 'ERC-4337 Base Gas Sponsorship'}
                </span>
                <span className="text-[#5ea37e]">
                  Coût estimé : {paymasterGasData ? `$${paymasterGasData.gasCostUsd}` : '$0.003'}
                </span>
              </div>
            </div>

            {/* Right: Code Generator */}
            <div className="p-5 rounded-xl bg-[#090d16] border border-[#1a2333] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1a2333]">
                  <div className="flex items-center gap-1.5 text-xs">
                    {(['react', 'mobile', 'swift', 'html'] as const).map((fw) => (
                      <button
                        key={fw}
                        onClick={() => setSdkFramework(fw)}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                          sdkFramework === fw
                            ? 'bg-[#18231e] text-[#d8efa3] border border-[#5ea37e]/40'
                            : 'text-[#8e9aa8] hover:text-white'
                        }`}
                      >
                        {fw.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        sdkFramework === 'react'
                          ? `import { StockMindEmbed } from '@stockmind/base-sdk';\n\n<StockMindEmbed\n  symbol="${sdkAsset}"\n  sponsorGas={true}\n  defaultAmountUsd={10}\n  chainId={${isTestnet ? 84532 : 8453}}\n  onSuccess={(tx) => console.log('Minted on Base:', tx.hash)}\n/>`
                          : `StockMindSDK.init(apiKey: "pub_live_base_${isTestnet ? 'sepolia' : '8453'}", sponsorGas: true)`,
                        () => setSdkCopied(true)
                      )
                    }
                    className="flex items-center gap-1 text-xs text-[#8e9aa8] hover:text-white font-mono"
                  >
                    {sdkCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{sdkCopied ? 'Copié' : 'Copier Code'}</span>
                  </button>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-[#0e1420] border border-[#1a2333] font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                  {sdkFramework === 'react' && (
                    <pre>
{`import { StockMindEmbed } from '@stockmind/base-sdk';

export function InRidePurchaseWidget() {
  return (
    <StockMindEmbed
      symbol="${sdkAsset}"
      network="${isTestnet ? 'base-sepolia' : 'base-mainnet'}"
      chainId={${isTestnet ? 84532 : 8453}}
      sponsorGas={true}
      fiatPaymentMethods={['apple-pay', 'card', 'usdc']}
      defaultAmounts={[5, 15, 25]}
      onSuccess={(receipt) => {
        console.log('Action créditée sur Base:', receipt.hash);
      }}
    />
  );
}`}
                    </pre>
                  )}
                  {sdkFramework === 'mobile' && (
                    <pre>
{`import { StockMindView } from '@stockmind/react-native';

<StockMindView
  targetTicker="UBER"
  theme="dark"
  sponsorGas={true}
  onPurchaseSuccess={(tx) => showToast('Action créditée sur Base !')}
/>`}
                    </pre>
                  )}
                  {sdkFramework === 'swift' && (
                    <pre>
{`import StockMindBaseSDK

let config = StockMindConfig(
    chainId: ${isTestnet ? 84532 : 8453},
    paymasterUrl: "https://base.stockmind.ai/rpc/paymaster"
)
StockMind.presentBuySheet(for: "bUBER", amount: 15.0)`}
                    </pre>
                  )}
                  {sdkFramework === 'html' && (
                    <pre>
{`<script src="https://cdn.stockmind.ai/v1/sdk.js"></script>
<div id="stockmind-embed"
     data-symbol="bUBER"
     data-chain="${isTestnet ? '84532' : '8453'}"
     data-sponsor-gas="true">
</div>`}
                    </pre>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1a2333] flex items-center justify-between text-xs text-[#8e9aa8]">
                <span>Prend en charge Apple Pay, Google Pay et Coinbase Smart Wallet</span>
                <span className="font-mono text-emerald-400">v1.4.2 Production Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. COUNTRY-SPECIFIC NEOBROKER */}
      {/* ========================================================================= */}
      {(activeModule === '2' || activeModule === 'all') && (
        <div className="p-6 rounded-2xl bg-[#131821] border border-[#1a2333] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a2333] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8e9aa8] font-mono">
                <span className="text-[#5ea37e] font-semibold">INITIATIVE 02</span>
                <span aria-hidden="true">·</span>
                <span>ON-RAMPS LOCAUX & PASSERELLES FIAT</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                Néocourtier Hyper-Local avec Rails de Paiement Nationaux
              </h2>
              <p className="text-xs text-[#8e9aa8] mt-1 max-w-2xl leading-relaxed">
                Conçu pour les juridictions où l’accès direct aux courtiers américains est complexe ou pénalisé par des frais de virement internationaux.
                Dépôts en monnaie locale via PIX, M-PESA, UPI ou Naira crédités instantanément en actions tokenisées sur Base L2.
              </p>
            </div>
            <div className="text-xs font-mono text-[#8e9aa8]">
              Règlement atomique en 3.4 secondes sur Base
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Visual Architecture Map */}
            <div className="lg:col-span-5 rounded-xl border border-[#1a2333] overflow-hidden relative min-h-[220px]">
              <img
                src="/src/assets/images/global_neobroker_map_1793956157571.jpg"
                alt="Global Neobroker Rails Map"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1017] via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white">
                <span className="font-semibold block">Devises Locales &rarr; Règlement Base L2</span>
                <span className="text-[11px] text-[#8e9aa8]">Zéro délai de virement SWIFT · Frais de gaz sub-centimes</span>
              </div>
            </div>

            {/* Interactive Neobroker Terminal */}
            <div className="lg:col-span-7 p-5 rounded-xl bg-[#090d16] border border-[#1a2333] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono text-[#8e9aa8] uppercase block mb-2">
                  Sélectionnez la Passerelle Locale
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { code: 'br', name: 'Brésil', rail: 'PIX', curr: 'BRL' },
                    { code: 'ke', name: 'Kenya', rail: 'M-PESA', curr: 'KES' },
                    { code: 'in', name: 'Inde', rail: 'UPI', curr: 'INR' },
                    { code: 'ng', name: 'Nigeria', rail: 'Naira', curr: 'NGN' },
                    { code: 'mx', name: 'Mexique', rail: 'SPEI/OXXO', curr: 'MXN' },
                    { code: 'ph', name: 'Philippines', rail: 'GCash', curr: 'PHP' },
                  ].map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setSelectedCountry(c.code as any)}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedCountry === c.code
                          ? 'bg-[#18231e] border-[#5ea37e]/60 text-white shadow-sm'
                          : 'bg-[#121824] border-[#1e2738] text-[#8e9aa8] hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">{c.name}</div>
                      <div className="text-[10px] font-mono text-[#5ea37e]">{c.rail}</div>
                    </button>
                  ))}
                </div>

                {/* Conversion inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  <div>
                    <label className="text-xs text-[#8e9aa8] block mb-1">
                      Montant Versé ({selectedCountry.toUpperCase()})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={fiatAmount}
                        onChange={(e) => setFiatAmount(e.target.value)}
                        className="w-full px-3 py-2 bg-[#121824] border border-[#232e42] rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#5ea37e]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8e9aa8]">
                        {selectedCountry === 'br' ? 'BRL (PIX)' : selectedCountry === 'ke' ? 'KES' : selectedCountry === 'in' ? 'INR (UPI)' : 'FIAT'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#8e9aa8] block mb-1">
                      Action Américaine Cible sur Base
                    </label>
                    <select
                      value={targetNeobrokerStock}
                      onChange={(e) => setTargetNeobrokerStock(e.target.value)}
                      className="w-full px-3 py-2 bg-[#121824] border border-[#232e42] rounded-lg text-white font-mono text-sm focus:outline-none"
                    >
                      <option value="bCSPX">bCSPX — S&P 500 Index (594.12 $)</option>
                      <option value="bMSFT">bMSFT — Microsoft Corp (423.80 $)</option>
                      <option value="bCOIN">bCOIN — Coinbase Global (218.65 $)</option>
                      <option value="SBUX.d">SBUX.d — Starbucks dShare (98.40 $)</option>
                      <option value="bIB01">bIB01 — Bons du Trésor US 0-1yr (109.15 $)</option>
                    </select>
                  </div>
                </div>

                {/* Live Quote Breakdown */}
                {neobrokerQuote && (
                  <div className="mt-4 p-3.5 rounded-lg bg-[#121824] border border-[#1e2738] space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-[#8e9aa8]">
                      <span>Montant Brut :</span>
                      <span className="text-white">${neobrokerQuote.usdValueGross} USD</span>
                    </div>
                    <div className="flex justify-between text-[#8e9aa8]">
                      <span>Frais Passerelle Locale :</span>
                      <span>-${neobrokerQuote.localRailFeeUsd} USD</span>
                    </div>
                    <div className="flex justify-between text-[#8e9aa8]">
                      <span>Frais Réseau Base L2 :</span>
                      <span className="text-emerald-400">-${neobrokerQuote.baseL2NetworkFeeUsd} USD</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#1a2333] text-sm">
                      <span className="text-white font-semibold">Allocation Titre Nette :</span>
                      <span className="font-bold text-[#d8efa3]">
                        {neobrokerQuote.tokenAmount} {targetNeobrokerStock}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#8e9aa8] pt-1">
                      <span>Passerelle Détectée :</span>
                      <span className="text-emerald-400 font-semibold">{neobrokerQuote.providerName}</span>
                    </div>
                    {neobrokerQuote.zeroKeyFallbackActive && (
                      <div className="text-[10px] text-amber-300/80 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                        Mode Zero-Key actif : taux interbancaires en direct & règlement sur DEX Base sans clé marchande requise.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => {
                    const tx = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
                    setNeobrokerTxSuccess(tx);
                    onTriggerToast('success', 'Règlement Local Initié', `Crédit simulé de ${targetNeobrokerStock} sur Base.`);
                  }}
                  className="w-full py-2.5 bg-[#d8efa3] hover:bg-[#cbe690] text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                >
                  Confirmer le Règlement Local Instantané &rarr;
                </button>

                {neobrokerTxSuccess && (
                  <p className="mt-2 text-center text-[11px] font-mono text-emerald-400">
                    &check; Paiement validé par la passerelle · Rapprochement atomique : {neobrokerTxSuccess}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DEFI-ABSTRACTED STOCK YIELD */}
      {/* ========================================================================= */}
      {(activeModule === '3' || activeModule === 'all') && (
        <div className="p-6 rounded-2xl bg-[#131821] border border-[#1a2333] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a2333] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8e9aa8] font-mono">
                <span className="text-[#5ea37e] font-semibold">INITIATIVE 03</span>
                <span aria-hidden="true">·</span>
                <span>OPTIMISATION DU RENDEMENT PASSIF</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                Rendement Dépassant le Dividende sur Actions Détenues
              </h2>
              <p className="text-xs text-[#8e9aa8] mt-1 max-w-2xl leading-relaxed">
                Générez un rendement supplémentaire de 6.5% à 8.25% d’APY sur les actions tokenisées que vous détenez déjà.
                Toute la plomberie DeFi (prêt sur marché monétaire, réinvestissement automatique et staking LP) est gérée sans friction.
              </p>
            </div>
            <div className="text-xs font-mono text-[#5ea37e] bg-[#18231e] px-2.5 py-1 rounded-md border border-[#5ea37e]/30">
              Rendement Moyen : 6.55% à 8.25% APY
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {yieldVaultsList.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelectedVault(v.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedVault === v.id
                    ? 'bg-[#18231e] border-[#5ea37e]'
                    : 'bg-[#090d16] border-[#1a2333] hover:border-[#2b3547]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs text-[#5ea37e] font-semibold">{v.symbol}</span>
                      <h3 className="text-sm font-bold text-white mt-0.5">{v.name}</h3>
                    </div>
                    <span className="text-base font-mono font-bold text-[#d8efa3] tabular-nums">
                      {v.totalNetApy}% APY
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1a2333] space-y-1.5 text-xs text-[#8e9aa8]">
                    <div className="flex justify-between">
                      <span>Dividende/Coupon sous-jacent :</span>
                      <span className="text-white font-mono">{v.underlyingCouponYield}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rendement Prêt DeFi Base :</span>
                      <span className="text-[#5ea37e] font-mono">+{v.baseMoneyMarketLendingApy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Garde Sous-jacente :</span>
                      <span className="text-slate-300 truncate max-w-[140px]">{v.custodian}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setVaultDeposited(true);
                    onTriggerToast('success', 'Coffre-fort Activé', `Dépôt passif configuré pour ${v.symbol} à ${v.totalNetApy}% APY.`);
                  }}
                  className="w-full mt-4 py-2 rounded-lg bg-[#232f40] hover:bg-[#2c3b50] text-white text-xs font-semibold transition-colors"
                >
                  Déposer & Gagner {v.totalNetApy}% &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ONE-CLICK SMART LEVERAGE */}
      {/* ========================================================================= */}
      {(activeModule === '4' || activeModule === 'all') && (
        <div className="p-6 rounded-2xl bg-[#131821] border border-[#1a2333] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a2333] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8e9aa8] font-mono">
                <span className="text-[#5ea37e] font-semibold">INITIATIVE 04</span>
                <span aria-hidden="true">·</span>
                <span>LEVIER EN 1 CLIC & GARDE ANTI-LIQUIDATION</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                Effet de Levier en 1 Clic avec Gardien de Désendettement Automatique
              </h2>
              <p className="text-xs text-[#8e9aa8] mt-1 max-w-2xl leading-relaxed">
                Emprunte de l’USDC contre vos actions pour en acheter davantage en une transaction flash atomique.
                Un gardien autonome surveille en continu le Health Factor sur Base et coupe automatiquement la position en cas de retournement de marché pour empêcher toute liquidation forcée.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-emerald-400">&bull; Gardien Actif</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="lg:col-span-2 p-5 rounded-xl bg-[#090d16] border border-[#1a2333] space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#8e9aa8] block mb-1">Action Collatérale</label>
                  <select
                    value={leverageAsset}
                    onChange={(e) => setLeverageAsset(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121824] border border-[#232e42] rounded-lg text-white font-mono text-xs focus:outline-none"
                  >
                    <option value="bMSFT">bMSFT — Microsoft (423.80 $)</option>
                    <option value="bCSPX">bCSPX — S&P 500 Index (594.12 $)</option>
                    <option value="bCOIN">bCOIN — Coinbase Global (218.65 $)</option>
                    <option value="bIB01">bIB01 — US Treasuries (109.15 $)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#8e9aa8] block mb-1">Parts en Collatéral</label>
                  <input
                    type="number"
                    value={collateralShares}
                    onChange={(e) => setCollateralShares(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-[#121824] border border-[#232e42] rounded-lg text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Leverage Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8e9aa8]">Multiplicateur d'Exposition :</span>
                  <span className="font-mono font-bold text-[#d8efa3]">{leverageRatio.toFixed(1)}x Exposition</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="4.0"
                  step="0.1"
                  value={leverageRatio}
                  onChange={(e) => setLeverageRatio(parseFloat(e.target.value))}
                  className="w-full accent-[#5ea37e] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#8e9aa8]">
                  <span>1.2x (Prudent)</span>
                  <span>2.5x (Équilibré)</span>
                  <span>4.0x (Agressif)</span>
                </div>
              </div>

              {/* Auto Deleverage Toggle */}
              <div className="p-3 rounded-lg bg-[#121824] border border-[#1e2738] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Gardien Anti-Liquidation Autonome
                  </span>
                  <span className="text-[11px] text-[#8e9aa8]">
                    Désendette automatiquement la position à Health Factor &lt; 1.25 pour éviter 100% de perte.
                  </span>
                </div>
                <button
                  onClick={() => setAutoDeleverageActive(!autoDeleverageActive)}
                  className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                    autoDeleverageActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {autoDeleverageActive ? 'GARDIEN ACTIF' : 'DÉSACTIVÉ'}
                </button>
              </div>

              <button
                onClick={() => {
                  setLeverageSimSuccess(true);
                  onTriggerToast('success', 'Simulation Réussie', `Position de levier ${leverageRatio}x calculée avec succès sur Base.`);
                }}
                className="w-full py-2.5 bg-[#d8efa3] hover:bg-[#cbe690] text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Simuler l'Effet de Levier {leverageRatio}x &rarr;
              </button>
            </div>

            {/* Live Loan Health Card */}
            <div className="p-5 rounded-xl bg-[#090d16] border border-[#1a2333] flex flex-col justify-between text-xs space-y-4">
              <div>
                <span className="font-mono text-[#8e9aa8] uppercase text-[11px] block mb-3">
                  Télémétrie du Prêt & Risque
                </span>
                {leverageSimData && (
                  <div className="space-y-3 font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#8e9aa8]">Valeur Collatéral :</span>
                      <span className="text-white">${leverageSimData.initialCollateralUsd}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8e9aa8]">Dette USDC :</span>
                      <span className="text-slate-300">${leverageSimData.borrowedUsdc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8e9aa8]">Exposition Totale :</span>
                      <span className="text-[#d8efa3] font-bold">${leverageSimData.totalExposureUsd}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8e9aa8]">Prix de Liquidation :</span>
                      <span className="text-rose-400 font-bold">${leverageSimData.liquidationPrice}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#1a2333]">
                      <span className="text-[#8e9aa8]">Health Factor :</span>
                      <span className="text-emerald-400 font-bold">{leverageSimData.healthFactor}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 rounded bg-[#121824] border border-[#232e42] text-[11px] text-[#8e9aa8]">
                Protocole sous-jacent : Marché Morpho Blue / Aave v3 Base avec contrat d'actions tokenisées vérifié.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MANAGED STOCK AMM POOLS */}
      {/* ========================================================================= */}
      {(activeModule === '5' || activeModule === 'all') && (
        <div className="p-6 rounded-2xl bg-[#131821] border border-[#1a2333] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a2333] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8e9aa8] font-mono">
                <span className="text-[#5ea37e] font-semibold">INITIATIVE 05</span>
                <span aria-hidden="true">·</span>
                <span>GESTION DE LIQUIDITÉ AMM CONCENTRÉE</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                Fourniture Automatisée de Liquidité AMM et Gestion des Plages
              </h2>
              <p className="text-xs text-[#8e9aa8] mt-1 max-w-2xl leading-relaxed">
                Fournissez des liquidités dans les pools d’actions Aerodrome Slipstream et Uniswap v3 sur Base pour percevoir les frais d’échange.
                L’application resserre la plage de prix pendant les heures de négociation et l’élargit avant le weekend pour minimiser la perte impermanente.
              </p>
            </div>
            <div className="text-xs font-mono text-[#8e9aa8]">
              Rendement de frais : 14.2% à 29.8% APR
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ammPoolsData.map((p) => (
              <div
                key={p.poolId}
                onClick={() => setSelectedAmmPool(p.poolId)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedAmmPool === p.poolId ? 'bg-[#18231e] border-[#5ea37e]' : 'bg-[#090d16] border-[#1a2333]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-white">{p.pair}</h3>
                    <span className="text-[11px] text-[#8e9aa8]">{p.dex}</span>
                  </div>
                  <span className="text-base font-mono font-bold text-[#d8efa3]">{p.annualFeeApr}% APR</span>
                </div>

                <div className="mt-3 pt-3 border-t border-[#1a2333] space-y-1 text-xs text-[#8e9aa8]">
                  <div className="flex justify-between">
                    <span>TVL Pool :</span>
                    <span className="text-white font-mono">${(p.tvlUsd / 1e6).toFixed(2)}M USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plage Heures Ouvrées :</span>
                    <span className="text-slate-300 font-mono text-[11px]">{p.activeTickRange.spreadPercent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plage Weekend :</span>
                    <span className="text-[#5ea37e]">{p.weekendTickRange.spreadPercent} (Auto)</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAmmPositionActive(true);
                    onTriggerToast('success', 'Stratégie AMM Prête', `Configuration de plage validée pour ${p.pair}.`);
                  }}
                  className="w-full mt-4 py-2 bg-[#232f40] hover:bg-[#2c3b50] text-white text-xs font-semibold rounded transition-colors"
                >
                  Configurer la Position AMM &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. AGENT PORTFOLIO & PUBLIC SOCIAL DIARY */}
      {/* ========================================================================= */}
      {(activeModule === '6' || activeModule === 'all') && (
        <div className="p-6 rounded-2xl bg-[#131821] border border-[#1a2333] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a2333] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8e9aa8] font-mono">
                <span className="text-[#5ea37e] font-semibold">INITIATIVE 06</span>
                <span aria-hidden="true">·</span>
                <span>AGENT AUTONOME & JOURNAL ONCHAIN PUBLIC</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                Agent de Portefeuille Autonome avec Journal Quotidien Vérifiable
              </h2>
              <p className="text-xs text-[#8e9aa8] mt-1 max-w-2xl leading-relaxed">
                Un agent d’investissement IA qui gère un portefeuille d’actions sur Base et publie chaque jour son journal de réflexion analytique,
                relié à un portefeuille de trésorerie consultable publiquement sur Basescan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={isTestnet ? 'https://sepolia.basescan.org/address/0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97' : 'https://basescan.org/address/0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97'}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-[#121824] hover:bg-[#1a2334] border border-[#232e42] text-xs font-mono text-[#d8efa3] rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Wallet : 0x4838...5f97</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Visual Desk Asset */}
            <div className="lg:col-span-4 rounded-xl border border-[#1a2333] overflow-hidden relative min-h-[220px]">
              <img
                src="/src/assets/images/autonomous_agent_desk_1793956157967.jpg"
                alt="Autonomous Agent Quantitative Desk"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1017] via-transparent to-transparent opacity-85"></div>
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white">
                <span className="font-semibold block">Transparence Onchain Garantie</span>
                <span className="text-[11px] text-[#8e9aa8]">Chaque décision justifiée et vérifiable sur Base</span>
              </div>
            </div>

            {/* Diary Reader & Generator */}
            <div className="lg:col-span-8 p-5 rounded-xl bg-[#090d16] border border-[#1a2333] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1a2333]">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#5ea37e]">
                    <Bot className="w-4 h-4" />
                    <span>JOURNAL DE BORD DE L'AGENT DU JOUR</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={loadDiary}
                      disabled={diaryLoading}
                      className="px-2.5 py-1 bg-[#121824] hover:bg-[#1e2738] text-xs text-white rounded font-mono transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${diaryLoading ? 'animate-spin' : ''}`} />
                      <span>Régénérer</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(diaryText, () => setDiaryCopied(true))}
                      className="px-2.5 py-1 bg-[#d8efa3] hover:bg-[#cbe690] text-black text-xs font-semibold rounded font-mono transition-colors flex items-center gap-1"
                    >
                      {diaryCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>Partager sur X / Farcaster</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-lg bg-[#0d121c] border border-[#1a2333] font-mono text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-[300px] overflow-y-auto">
                  {diaryLoading ? 'Synthèse de l’analyse onchain par l’Agent IA...' : diaryText}
                </div>
              </div>

              <div className="pt-3 border-t border-[#1a2333] flex items-center justify-between text-[11px] text-[#8e9aa8] font-mono">
                <span>Modèle : Gemini 3.8 Flash Quantitative Engine</span>
                <span>Exécution Non-Custodiale Base L2</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CRYPTO TREASURIES STOCK BASKETS */}
      {/* ========================================================================= */}
      {(activeModule === '7' || activeModule === 'all') && (
        <div className="p-6 rounded-2xl bg-[#131821] border border-[#1a2333] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a2333] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8e9aa8] font-mono">
                <span className="text-[#5ea37e] font-semibold">INITIATIVE 07</span>
                <span aria-hidden="true">·</span>
                <span>TRÉSORERIES ONCHAIN & ALLOCATIONS DAO</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                Paniers d’Actions pour Trésoreries Crypto et DAO
              </h2>
              <p className="text-xs text-[#8e9aa8] mt-1 max-w-2xl leading-relaxed">
                Permet aux fondations crypto, DAO et startups Web3 de détenir des paniers diversifiés d’actions américaines sans compte de courtage traditionnel,
                avec génération directe de calldata multi-sig compatible Gnosis Safe.
              </p>
            </div>
            <div className="text-xs font-mono text-[#5ea37e] bg-[#18231e] px-2.5 py-1 rounded-md border border-[#5ea37e]/30">
              Calldata Gnosis Safe Prêt
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'all_weather',
                name: 'All-Weather DAO Reserve',
                desc: 'Préservation du capital avec faible corrélation aux marchés crypto.',
                weights: '40% bIB01 · 30% bCSPX · 20% USDC · 10% bMSFT',
                sharpe: '2.42',
                estApy: '5.4%',
              },
              {
                id: 'dividend',
                name: 'Cash Equities & Dividend Basket',
                desc: 'Maximise la distribution de dividendes trimestriels en USDC sur Base.',
                weights: '50% bIB01 · 30% SBUX.d · 20% ABT.d',
                sharpe: '1.95',
                estApy: '4.8%',
              },
              {
                id: 'tech_alpha',
                name: 'Tech & AI Sovereign Basket',
                desc: 'Exposition aux géants technologiques et trésoreries Bitcoin.',
                weights: '40% bMSFT · 35% bCOIN · 25% bMSTR',
                sharpe: '1.68',
                estApy: 'Croissance Alpha',
              },
            ].map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBasket(b.id as any)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedBasket === b.id ? 'bg-[#18231e] border-[#5ea37e]' : 'bg-[#090d16] border-[#1a2333]'
                }`}
              >
                <h3 className="text-sm font-bold text-white">{b.name}</h3>
                <p className="text-xs text-[#8e9aa8] mt-1 leading-snug">{b.desc}</p>

                <div className="mt-4 pt-3 border-t border-[#1a2333] text-xs font-mono space-y-1.5">
                  <div className="text-[#d8efa3] text-[11px]">{b.weights}</div>
                  <div className="flex justify-between text-[#8e9aa8] pt-1">
                    <span>Ratio de Sharpe :</span>
                    <span className="text-white font-bold">{b.sharpe}</span>
                  </div>
                  <div className="flex justify-between text-[#8e9aa8]">
                    <span>Rendement Annuel Espéré :</span>
                    <span className="text-[#5ea37e] font-bold">{b.estApy}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const calldata = safePayloadData?.actions
                      ? JSON.stringify(safePayloadData.actions, null, 2)
                      : '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D';
                    copyToClipboard(calldata, () => setCalldataCopied(true));
                  }}
                  className="w-full mt-4 py-2 bg-[#232f40] hover:bg-[#2c3b50] text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier Calldata Safe Multi-Sig</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. 24/7 WEEKEND PRICE FEED & SYNTHETIC ORACLE */}
      {/* ========================================================================= */}
      {(activeModule === '8' || activeModule === 'all') && (
        <div className="p-6 rounded-2xl bg-[#131821] border border-[#1a2333] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a2333] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8e9aa8] font-mono">
                <span className="text-[#5ea37e] font-semibold">INITIATIVE 08</span>
                <span aria-hidden="true">·</span>
                <span>ORACLE CONTINU HORS MARCHÉ TRADFI</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                Flux de Prix Synthétique Weekend 24/7 pour Prêts et Dérivés
              </h2>
              <p className="text-xs text-[#8e9aa8] mt-1 max-w-2xl leading-relaxed">
                Les actions tokenisées continuent d’être échangées 24/7 sur Base même lorsque Wall Street (NYSE/NASDAQ) ferme le vendredi soir.
                Les protocoles de prêt et de dérivés disposent d’un flux de référence officiel avec bandes de variance et coupe-circuit anti-flash crash.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/30">
                Pulsation Oracle : 1.8s
              </span>
            </div>
          </div>

          {pythBenchmark && (
            <div className="mb-4 p-3 rounded-lg bg-[#0e1624] border border-[#1b2b3d] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-semibold">Validation Directe Pyth Hermes (Base Benchmark) :</span>
                <span className="text-emerald-400 font-bold">{pythBenchmark.symbol} = ${pythBenchmark.priceUsd?.toLocaleString()} USD</span>
                <span className="text-slate-400 text-[11px]">(Précision: ±${pythBenchmark.confidenceUsd})</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>Passerelle : <span className="text-emerald-400">hermes.pyth.network</span></span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                  Zéro Clé Requise
                </span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[#1a2333] text-[#8e9aa8]">
                  <th className="py-2.5 px-3">Actif</th>
                  <th className="py-2.5 px-3 text-right">Clôture NYSE Vendredi</th>
                  <th className="py-2.5 px-3 text-right">Spot Continu Base</th>
                  <th className="py-2.5 px-3 text-right">Oracle Composite</th>
                  <th className="py-2.5 px-3 text-right">Dérive Weekend</th>
                  <th className="py-2.5 px-3 text-right">Volume 24h</th>
                  <th className="py-2.5 px-3 text-center">Coupe-Circuit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2333]">
                {weekendFeedsData.map((feed) => (
                  <tr key={feed.symbol} className="hover:bg-[#161d28] transition-colors">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#5ea37e]"></span>
                      <span>{feed.symbol}</span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                      ${feed.fridayCloseUsd.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-[#d8efa3] font-semibold tabular-nums">
                      ${feed.weekendLiveDexUsd.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-white font-bold tabular-nums">
                      ${feed.oracleCompositeUsd.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">
                      +{feed.spreadPercent}%
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                      ${(feed.volumeWeekendUsd / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {feed.circuitBreakerStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-lg bg-[#090d16] border border-[#1a2333] text-xs text-[#8e9aa8] flex items-center justify-between">
            <span>Pondération : 70% TWAP Aerodrome Slipstream Base + 30% Volatilité Implicite</span>
            <span className="font-mono text-slate-300">Compatible Pyth Network & Chainlink Base</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. CONDITIONAL PREDICTION STOCKS */}
      {/* ========================================================================= */}
      {(activeModule === '9' || activeModule === 'all') && (
        <div className="p-6 rounded-2xl bg-[#131821] border border-[#1a2333] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a2333] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8e9aa8] font-mono">
                <span className="text-[#5ea37e] font-semibold">INITIATIVE 09</span>
                <span aria-hidden="true">·</span>
                <span>ACTIONS CONTINGENTES AUX MARCHÉS DE PRÉDICTION</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                Marchés Combinant Actions et Prédictions (Annulation Garantie)
              </h2>
              <p className="text-xs text-[#8e9aa8] mt-1 max-w-2xl leading-relaxed">
                Prenez des positions conditionnées : « L'action vaut X si [Événement] se produit ; ordre annulé et collatéral remboursé à 100% si l'événement n'a pas lieu ».
                Aucune perte de capital si le catalyseur est invalidé.
              </p>
            </div>
            <div className="text-xs font-mono text-[#d8efa3] bg-[#18231e] px-2.5 py-1 rounded-md border border-[#5ea37e]/30">
              Remboursement Séquestre 100% Garanti
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {predictionMarketsList.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedPredictionMarket(m.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedPredictionMarket === m.id ? 'bg-[#18231e] border-[#5ea37e]' : 'bg-[#090d16] border-[#1a2333]'
                }`}
              >
                <div className="text-xs font-bold text-white">{m.title}</div>
                <div className="mt-2 text-[11px] text-[#5ea37e] font-mono leading-tight">{m.condition}</div>
                <div className="mt-2 text-[10px] text-[#8e9aa8]">{m.cancelCondition}</div>

                <div className="mt-4 pt-3 border-t border-[#1a2333] flex justify-between items-center text-xs font-mono">
                  <span className="text-[#8e9aa8]">Prix du Contrat :</span>
                  <span className="text-white font-bold">${m.contractPriceYes} / contrat</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPredictionPlaced(true);
                    onTriggerToast('success', 'Ordre Conditionnel Placé', `Séquestre configuré pour ${m.title}.`);
                  }}
                  className="w-full mt-4 py-2 bg-[#d8efa3] hover:bg-[#cbe690] text-black text-xs font-bold uppercase rounded transition-colors"
                >
                  Placer l'Ordre Conditionnel &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. TOKENIZED STOCK COLLATERAL DERIVATIVES & BASIS */}
      {/* ========================================================================= */}
      {(activeModule === '10' || activeModule === 'all') && (
        <div className="p-6 rounded-2xl bg-[#131821] border border-[#1a2333] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a2333] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8e9aa8] font-mono">
                <span className="text-[#5ea37e] font-semibold">INITIATIVE 10</span>
                <span aria-hidden="true">·</span>
                <span>DÉRIVÉS & BASIS TRADING DELTA-NEUTRE</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                Plateforme de Dérivés avec Actions en Collatéral & Cash-and-Carry Basis
              </h2>
              <p className="text-xs text-[#8e9aa8] mt-1 max-w-2xl leading-relaxed">
                Déposez des actions tokenisées en collatéral de marge sans les vendre pour ouvrir des positions perpétuelles ou capturer des taux de financement positifs.
                Conservez la pleine propriété physique des actions et les dividendes tout en neutralisant l’exposition directionnelle.
              </p>
            </div>
            <div className="text-xs font-mono text-[#5ea37e] bg-[#18231e] px-2.5 py-1 rounded-md border border-[#5ea37e]/30">
              Rendement Basis : +11.4% Net APY
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive Basis Trade Simulator */}
            <div className="p-5 rounded-xl bg-[#090d16] border border-[#1a2333] space-y-4">
              <span className="text-xs font-mono text-[#8e9aa8] uppercase block">
                Calculateur Cash-and-Carry Basis
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#8e9aa8] block mb-1">Collatéral Spot</label>
                  <select
                    value={basisStock}
                    onChange={(e) => setBasisStock(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121824] border border-[#232e42] rounded-lg text-white font-mono text-xs focus:outline-none"
                  >
                    <option value="bCSPX">bCSPX — S&P 500 ETF (594.12 $)</option>
                    <option value="bCOIN">bCOIN — Coinbase Global (218.65 $)</option>
                    <option value="bMSFT">bMSFT — Microsoft Corp (423.80 $)</option>
                    <option value="bIB01">bIB01 — Bons du Trésor US (109.15 $)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#8e9aa8] block mb-1">Parts Spot Déposées</label>
                  <input
                    type="number"
                    value={spotPositionSize}
                    onChange={(e) => setSpotPositionSize(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-[#121824] border border-[#232e42] rounded-lg text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              {basisAnalysisData && (
                <div className="p-4 rounded-xl bg-[#121824] border border-[#1e2738] space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8e9aa8]">Valeur Spot Détenue :</span>
                    <span className="text-white font-bold">${basisAnalysisData.spotValueUsd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8e9aa8]">Couverture Vente Perp :</span>
                    <span className="text-[#d8efa3]">{spotPositionSize} Parts Ventes à Découvert sur Base</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8e9aa8]">Exposition Delta Nette :</span>
                    <span className="text-emerald-400 font-bold">0.00 (Delta-Neutre Parfait)</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#1a2333]">
                    <span className="text-[#8e9aa8]">Rendement Taux de Financement :</span>
                    <span className="text-[#5ea37e] font-bold text-sm">+{basisAnalysisData.netAnnualizedApyPercent}% APY Net</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8e9aa8]">Revenu Net Annuel Estimé :</span>
                    <span className="text-white font-bold">
                      +${basisAnalysisData.netAnnualIncomeUsd} USD
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() =>
                  onTriggerToast('success', 'Arbitrage Basis Validé', `Position delta-neutre configurée pour ${basisStock}.`)
                }
                className="w-full py-2.5 bg-[#d8efa3] hover:bg-[#cbe690] text-black text-xs font-bold uppercase rounded-lg transition-colors"
              >
                Simuler l'Exécution du Trade Basis &rarr;
              </button>
            </div>

            {/* Collateral Venue Mechanics */}
            <div className="p-5 rounded-xl bg-[#090d16] border border-[#1a2333] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono text-[#8e9aa8] uppercase block mb-3">
                  Pourquoi le Collatéral d'Actions Tokenisées est Supérieur
                </span>
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3 rounded-lg bg-[#121824] border border-[#1e2738]">
                    <span className="font-semibold text-white block">Aucune Cession Fiscale Déclenchée</span>
                    <span className="text-[#8e9aa8] mt-0.5 block">
                      Au lieu de vendre vos actions pour lever du cash de marge, vous déposez le certificat tokenisé ERC-20 directement en garantie.
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#121824] border border-[#1e2738]">
                    <span className="font-semibold text-white block">Maintien Intégral des Dividendes</span>
                    <span className="text-[#8e9aa8] mt-0.5 block">
                      Les dividendes distribués par la garde suisse ou américaine continuent d’abonder la valeur liquidative du jeton.
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#121824] border border-[#1e2738]">
                    <span className="font-semibold text-white block">Efficacité de Marge Croisée (Cross-Margin)</span>
                    <span className="text-[#8e9aa8] mt-0.5 block">
                      Associez des bons du Trésor bIB01 (décote de seulement 5%) avec des actions technologiques pour un ratio d'emprunt optimal.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1a2333] flex items-center justify-between text-[11px] text-[#8e9aa8] font-mono">
                <span>Compatible Protocoles Perpétuels Base (Synthetix v3 / Avantis)</span>
                <span className="text-emerald-400">Sécurité Mathématique Validée</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
