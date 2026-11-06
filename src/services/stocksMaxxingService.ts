import { encodeFunctionData, parseAbi, parseUnits, formatUnits, concat, toHex, pad } from 'viem';

// Verified Protocol Contract Addresses on Base Mainnet (8453) & Base Sepolia (84532)
export const BASE_PROTOCOLS = {
  mainnet: {
    chainId: 8453,
    chainName: 'Base Mainnet',
    explorer: 'https://basescan.org',
    contracts: {
      // Tokenized Equities (1:1 Asset-Backed)
      bCSPX: '0xC3cE78B037DDA1B966D31EC7979d3f3a38571A8E' as `0x${string}`,
      bCOIN: '0xbbcb0356bb9e6b3faa5cbf9e5f36185d53403ac9' as `0x${string}`,
      bMSFT: '0x374A457967Ba24FD3Ae66294cAb08244185574b0' as `0x${string}`,
      bMSTR: '0xaC28C9178ACc8BA4A11A29E013a3A2627086e422' as `0x${string}`,
      bIB01: '0xca30c93b02514f86d5c86a6e375e3a330b435fb5' as `0x${string}`,
      sbuxD: '0x9B42E4afCc2046070fA00ff8213d59EEF6e4264e' as `0x${string}`,
      abtD: '0x1A60ef81d9863Bf5e6eb0666664D516b53C06403' as `0x${string}`,
      ppltD: '0x6278ee2A10d5FF703d8b2082FF55757598821e96' as `0x${string}`,
      defiD: '0xaC21cD6Fe43240d90741d25858d0Ff0940b11cc7' as `0x${string}`,

      // Core Stablecoins & Assets
      usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`,
      weth: '0x4200000000000000000000000000000000000006' as `0x${string}`,

      // DEX & Concentrated AMM Infrastructure
      aerodromeRouter: '0xcF77a3Ba9A5CA399B7c97c74954534425B57A4A7' as `0x${string}`,
      aerodromeSlipstreamFactory: '0x5e7BB104d84c7CB9B682AaC2F3d509f5F406809A' as `0x${string}`,
      uniswapUniversalRouter: '0x198EF79F1F515F02dFE9e3115e9F807830589344' as `0x${string}`,

      // Lending & Money Markets
      morphoBlue: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF66C3799863d' as `0x${string}`,
      aaveV3Pool: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5' as `0x${string}`,

      // Multisig & Governance
      gnosisSafeMultiSendCallOnly: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D' as `0x${string}`,
      gnosisSafeCompatibilityFallback: '0xfd0732Dc9E303e09fCEf365a435876650F3865bb' as `0x${string}`,

      // Oracles
      pythEndpoint: '0x8250f4aF4B972684F7b336503E2D6dFeDeB1487a' as `0x${string}`,
      chainlinkEthUsd: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70' as `0x${string}`,
      chainlinkUsdcUsd: '0x7e860098F58bBFC8648a4311b374B1D669a77655' as `0x${string}`,
      complianceSanctionsOracle: '0xbA0d02c2aFdDB571d1F54b5bea1b57FE01424587' as `0x${string}`,

      // Public Monitored Institutional Treasury
      publicTreasuryWallet: '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97' as `0x${string}`,
    },
  },
  sepolia: {
    chainId: 84532,
    chainName: 'Base Sepolia Testnet',
    explorer: 'https://sepolia.basescan.org',
    contracts: {
      bCSPX: '0xC3cE78B037DDA1B966D31EC7979d3f3a38571A8E' as `0x${string}`, // Testnet Mirror
      bCOIN: '0xbbcb0356bb9e6b3faa5cbf9e5f36185d53403ac9' as `0x${string}`,
      bMSFT: '0x374A457967Ba24FD3Ae66294cAb08244185574b0' as `0x${string}`,
      bMSTR: '0xaC28C9178ACc8BA4A11A29E013a3A2627086e422' as `0x${string}`,
      bIB01: '0xca30c93b02514f86d5c86a6e375e3a330b435fb5' as `0x${string}`,
      sbuxD: '0x9B42E4afCc2046070fA00ff8213d59EEF6e4264e' as `0x${string}`,
      abtD: '0x1A60ef81d9863Bf5e6eb0666664D516b53C06403' as `0x${string}`,
      ppltD: '0x6278ee2A10d5FF703d8b2082FF55757598821e96' as `0x${string}`,
      defiD: '0xaC21cD6Fe43240d90741d25858d0Ff0940b11cc7' as `0x${string}`,
      usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`,
      weth: '0x4200000000000000000000000000000000000006' as `0x${string}`,
      aerodromeRouter: '0xcF77a3Ba9A5CA399B7c97c74954534425B57A4A7' as `0x${string}`,
      morphoBlue: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF66C3799863d' as `0x${string}`,
      gnosisSafeMultiSendCallOnly: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D' as `0x${string}`,
      publicTreasuryWallet: '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97' as `0x${string}`,
    },
  },
};

// Standard ERC20 ABI for simulation
export const standardErc20Abi = parseAbi([
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
]);

// 1. Gnosis Safe MultiSend Encoder
// Encodes individual transactions into the byte-packed MultiSend format:
// [operation: 1 byte (0 for call)][to: 20 bytes][value: 32 bytes][dataLength: 32 bytes][data]
export function encodeSafeMultiSendTransactions(
  transactions: {
    to: `0x${string}`;
    value?: bigint;
    data: `0x${string}`;
    operation?: number; // 0 for Call, 1 for DelegateCall
  }[]
): `0x${string}` {
  let packed = '0x';

  for (const tx of transactions) {
    const operation = (tx.operation ?? 0).toString(16).padStart(2, '0');
    const to = tx.to.toLowerCase().replace('0x', '').padStart(40, '0');
    const value = (tx.value ?? 0n).toString(16).padStart(64, '0');
    const dataBytes = tx.data.replace('0x', '');
    const dataLength = (dataBytes.length / 2).toString(16).padStart(64, '0');

    packed += operation + to + value + dataLength + dataBytes;
  }

  return packed as `0x${string}`;
}

// 2. Encode Safe Treasury Basket Allocation Calldata
export function buildTreasuryBasketCalldata(
  basketType: 'all_weather' | 'dividend' | 'tech_alpha',
  totalAllocationUsd: number,
  isTestnet = false
): {
  multiSendCalldata: `0x${string}`;
  constituentActions: { token: string; target: string; amountUnits: string; valueUsd: number }[];
  safeUiInstructions: string;
} {
  const contracts = isTestnet ? BASE_PROTOCOLS.sepolia.contracts : BASE_PROTOCOLS.mainnet.contracts;

  let constituents: { symbol: string; address: `0x${string}`; weight: number; price: number }[] = [];

  if (basketType === 'all_weather') {
    constituents = [
      { symbol: 'bIB01', address: contracts.bIB01, weight: 0.40, price: 109.15 },
      { symbol: 'bCSPX', address: contracts.bCSPX, weight: 0.30, price: 594.12 },
      { symbol: 'USDC', address: contracts.usdc, weight: 0.20, price: 1.0 },
      { symbol: 'bMSFT', address: contracts.bMSFT || contracts.bCSPX, weight: 0.10, price: 423.8 },
    ];
  } else if (basketType === 'dividend') {
    constituents = [
      { symbol: 'bIB01', address: contracts.bIB01, weight: 0.50, price: 109.15 },
      { symbol: 'SBUX.d', address: contracts.sbuxD || contracts.bCSPX, weight: 0.30, price: 98.4 },
      { symbol: 'ABT.d', address: contracts.abtD || contracts.bCSPX, weight: 0.20, price: 114.2 },
    ];
  } else {
    constituents = [
      { symbol: 'bMSFT', address: contracts.bMSFT || contracts.bCSPX, weight: 0.40, price: 423.8 },
      { symbol: 'bCOIN', address: contracts.bCOIN || contracts.bCSPX, weight: 0.35, price: 218.65 },
      { symbol: 'bMSTR', address: contracts.bMSTR || contracts.bCSPX, weight: 0.25, price: 236.4 },
    ];
  }

  const txs = constituents.map((c) => {
    const valUsd = totalAllocationUsd * c.weight;
    const units = valUsd / c.price;
    const amountBigInt = parseUnits(units.toFixed(6), 18);

    // Call approve on token for Base Aerodrome Slipstream Router
    const data = encodeFunctionData({
      abi: standardErc20Abi,
      functionName: 'approve',
      args: [contracts.aerodromeRouter, amountBigInt],
    });

    return {
      to: c.address,
      data,
      value: 0n,
      operation: 0,
    };
  });

  const multiSendCalldata = encodeSafeMultiSendTransactions(txs);

  return {
    multiSendCalldata,
    constituentActions: constituents.map((c) => ({
      token: c.symbol,
      target: c.address,
      amountUnits: (totalAllocationUsd * c.weight / c.price).toFixed(4),
      valueUsd: totalAllocationUsd * c.weight,
    })),
    safeUiInstructions: `Open Gnosis Safe on Base -> New Transaction -> Transaction Builder -> Paste MultiSend address: ${contracts.gnosisSafeMultiSendCallOnly}`,
  };
}

// 3. Quantitative Leverage Math Engine
export function calculateLeverageMetrics(params: {
  stockPrice: number;
  collateralShares: number;
  leverageRatio: number;
  borrowRateApy?: number;
  liquidationThreshold?: number; // e.g. 0.75 for bCSPX, 0.95 for bIB01
}) {
  const {
    stockPrice,
    collateralShares,
    leverageRatio,
    borrowRateApy = 0.052,
    liquidationThreshold = 0.75,
  } = params;

  const initialCollateralUsd = collateralShares * stockPrice;
  const totalExposureUsd = initialCollateralUsd * leverageRatio;
  const borrowedUsdc = totalExposureUsd - initialCollateralUsd;
  const totalSharesHeld = totalExposureUsd / stockPrice;

  // Liquidation occurs when (Collateral Value * LiquidationThreshold) <= Debt
  // liquidationPrice * totalSharesHeld * LT = borrowedUsdc
  const liquidationPrice = totalSharesHeld > 0 && liquidationThreshold > 0
    ? borrowedUsdc / (totalSharesHeld * liquidationThreshold)
    : 0;

  const priceDropToLiquidationPercent = stockPrice > 0
    ? ((stockPrice - liquidationPrice) / stockPrice) * 100
    : 0;

  // Health factor: (Collateral Value * LT) / Debt
  const currentHealthFactor = borrowedUsdc > 0
    ? (initialCollateralUsd * liquidationThreshold) / borrowedUsdc
    : 99.0;

  const annualBorrowInterestUsd = borrowedUsdc * borrowRateApy;

  return {
    initialCollateralUsd: Number(initialCollateralUsd.toFixed(2)),
    totalExposureUsd: Number(totalExposureUsd.toFixed(2)),
    borrowedUsdc: Number(borrowedUsdc.toFixed(2)),
    totalSharesHeld: Number(totalSharesHeld.toFixed(4)),
    liquidationPrice: Number(liquidationPrice.toFixed(2)),
    priceDropToLiquidationPercent: Number(priceDropToLiquidationPercent.toFixed(1)),
    currentHealthFactor: Number(currentHealthFactor.toFixed(2)),
    annualBorrowInterestUsd: Number(annualBorrowInterestUsd.toFixed(2)),
    autoDeleverageTriggerPrice: Number((liquidationPrice * 1.15).toFixed(2)), // 15% safety buffer
  };
}

// 4. Cash-and-Carry Basis Yield Engine
export function calculateCashAndCarryBasis(params: {
  spotPrice: number;
  sharesAmount: number;
  annualDividendYieldPercent: number; // e.g. 1.48% for bCSPX
  annualFundingRatePercent: number; // e.g. +11.4%
  borrowCollateralCostPercent?: number; // e.g. 1.2%
}) {
  const {
    spotPrice,
    sharesAmount,
    annualDividendYieldPercent,
    annualFundingRatePercent,
    borrowCollateralCostPercent = 0.8,
  } = params;

  const spotValueUsd = spotPrice * sharesAmount;
  const grossFundingIncomePerYear = spotValueUsd * (annualFundingRatePercent / 100);
  const dividendIncomePerYear = spotValueUsd * (annualDividendYieldPercent / 100);
  const collateralFinancingCostPerYear = spotValueUsd * (borrowCollateralCostPercent / 100);

  const netAnnualIncomeUsd = grossFundingIncomePerYear + dividendIncomePerYear - collateralFinancingCostPerYear;
  const netAnnualizedApyPercent = (netAnnualIncomeUsd / spotValueUsd) * 100;

  return {
    spotValueUsd: Number(spotValueUsd.toFixed(2)),
    dailyFundingYieldUsd: Number((grossFundingIncomePerYear / 365).toFixed(2)),
    grossFundingIncomePerYear: Number(grossFundingIncomePerYear.toFixed(2)),
    dividendIncomePerYear: Number(dividendIncomePerYear.toFixed(2)),
    netAnnualIncomeUsd: Number(netAnnualIncomeUsd.toFixed(2)),
    netAnnualizedApyPercent: Number(netAnnualizedApyPercent.toFixed(2)),
    deltaExposure: 0.0, // pure delta neutral
  };
}

// 5. AMM Tick Math for Concentrated Liquidity (Aerodrome Slipstream / Uniswap v3)
export function calculateAmmTickRange(currentPrice: number, mode: 'smart_open' | 'weekend_closed') {
  const rangePercent = mode === 'smart_open' ? 0.015 : 0.08; // ±1.5% vs ±8.0%
  const lowerPrice = currentPrice * (1 - rangePercent);
  const upperPrice = currentPrice * (1 + rangePercent);

  // tick = Math.floor(Math.log(price) / Math.log(1.0001))
  const tickLower = Math.floor(Math.log(lowerPrice) / Math.log(1.0001));
  const tickUpper = Math.floor(Math.log(upperPrice) / Math.log(1.0001));

  return {
    currentPrice,
    rangePercent: rangePercent * 100,
    lowerPrice: Number(lowerPrice.toFixed(2)),
    upperPrice: Number(upperPrice.toFixed(2)),
    tickLower,
    tickUpper,
    estimatedFeeVelocity: mode === 'smart_open' ? '4.2x Capital Efficiency' : '1.4x Defensive Buffer',
  };
}
