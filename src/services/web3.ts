declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isBase: boolean;
  networkName: string;
  balanceEth: string;
  isConnecting: boolean;
  error: string | null;
}

export const BASE_MAINNET_PARAMS = {
  chainId: '0x2105', // 8453
  chainName: 'Base Mainnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org'],
};

export const BASE_SEPOLIA_PARAMS = {
  chainId: '0x14a34', // 84532
  chainName: 'Base Sepolia Testnet',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org'],
};

export async function connectBrowserWallet(): Promise<{ address: string; chainId: number }> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No Web3 wallet extension detected (Coinbase Wallet, MetaMask, Rabby). You can enter any Base address to monitor.');
  }

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts selected by user.');
  }

  const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
  const chainId = parseInt(chainIdHex, 16);

  return {
    address: accounts[0],
    chainId,
  };
}

export async function switchToBase(isTestnet = false): Promise<boolean> {
  if (!window.ethereum) return false;
  const targetParams = isTestnet ? BASE_SEPOLIA_PARAMS : BASE_MAINNET_PARAMS;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetParams.chainId }],
    });
    return true;
  } catch (switchError: any) {
    // 4902 indicates that the chain has not been added to the wallet
    if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [targetParams],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Base network:', addError);
        return false;
      }
    }
    console.error('Failed to switch network:', switchError);
    return false;
  }
}

export function formatAddress(address: string | null): string {
  if (!address) return '';
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
