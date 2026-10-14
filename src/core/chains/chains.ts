import { baseSepolia, polygonAmoy, sepolia, type Chain } from 'viem/chains';

export const SUPPORTED_CHAINS = [sepolia, polygonAmoy, baseSepolia] as const satisfies readonly Chain[];
export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]['id'];

export const DEFAULT_CHAIN_ID: SupportedChainId = sepolia.id;

export function isSupportedChainId(id: number): id is SupportedChainId {
  return SUPPORTED_CHAINS.some((c) => c.id === id);
}

export function getChain(id: SupportedChainId): Chain {
  const chain = SUPPORTED_CHAINS.find((c) => c.id === id);
  if (!chain) throw new Error(`Unsupported chain ${id}`);
  return chain;
}

/** Hard stop: the app must never sign for a mainnet. */
export function assertTestnet(chainId: number): asserts chainId is SupportedChainId {
  if (!isSupportedChainId(chainId)) {
    throw new Error(`Chain ${chainId} is not an allowed testnet`);
  }
}

export function explorerTxUrl(chainId: SupportedChainId, hash: string): string {
  return `${getChain(chainId).blockExplorers?.default.url}/tx/${hash}`;
}
