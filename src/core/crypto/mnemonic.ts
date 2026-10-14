import { generateMnemonic as gen, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { HDKey } from '@scure/bip32';
import { bytesToHex, isHex, type Hex } from 'viem';
import { privateKeyToAddress } from 'viem/accounts';

export type MnemonicLength = 12 | 24;
export const DEFAULT_PATH_PREFIX = "m/44'/60'/0'/0";

export function generateMnemonic(length: MnemonicLength = 12): string {
  return gen(wordlist, length === 12 ? 128 : 256);
}

export function normalizeMnemonic(input: string): string {
  return input.trim().toLowerCase().normalize('NFKD').split(/\s+/).join(' ');
}

export function isValidMnemonic(input: string): boolean {
  const m = normalizeMnemonic(input);
  const words = m.split(' ').length;
  return (words === 12 || words === 24) && validateMnemonic(m, wordlist);
}

/** Derives the private key for account index `i` along BIP-44 Ethereum path. */
export function derivePrivateKey(mnemonic: string, index = 0): Hex {
  if (!Number.isInteger(index) || index < 0) throw new Error('Invalid account index');
  const seed = mnemonicToSeedSync(normalizeMnemonic(mnemonic));
  try {
    const child = HDKey.fromMasterSeed(seed).derive(`${DEFAULT_PATH_PREFIX}/${index}`);
    if (!child.privateKey) throw new Error('Derivation failed');
    const hex = bytesToHex(child.privateKey);
    child.wipePrivateData();
    return hex;
  } finally {
    seed.fill(0);
  }
}

export function deriveAddress(mnemonic: string, index = 0) {
  return privateKeyToAddress(derivePrivateKey(mnemonic, index));
}

const SECP256K1_N = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');

export function normalizePrivateKey(input: string): Hex | null {
  const v = input.trim();
  const hex = (v.startsWith('0x') ? v : `0x${v}`) as Hex;
  if (!isHex(hex) || hex.length !== 66) return null;
  const n = BigInt(hex);
  return n > 0n && n < SECP256K1_N ? (hex.toLowerCase() as Hex) : null;
}

/** Picks `count` distinct random word positions for the backup confirmation quiz. */
export function pickQuizIndices(wordCount: number, count = 3): number[] {
  const set = new Set<number>();
  const buf = new Uint32Array(1);
  while (set.size < Math.min(count, wordCount)) {
    crypto.getRandomValues(buf);
    set.add(buf[0]! % wordCount);
  }
  return [...set].sort((a, b) => a - b);
}
