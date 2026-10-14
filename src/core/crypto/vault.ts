import type { Hex } from 'viem';
import { decrypt, encrypt, type EncryptedEnvelope } from './aes';
import { utf8, wipe } from './encoding';
import { derivePrivateKey, isValidMnemonic, normalizeMnemonic, normalizePrivateKey } from './mnemonic';

/** Plaintext secret shape. Exists only in memory while unlocked. */
export type VaultSecret =
  | { kind: 'mnemonic'; mnemonic: string; accounts: number }
  | { kind: 'privateKey'; privateKey: Hex };

export async function sealVault(secret: VaultSecret, password: string, iterations?: number) {
  validateSecret(secret);
  const bytes = utf8.encode(JSON.stringify(secret));
  try {
    return await encrypt(bytes, password, iterations);
  } finally {
    wipe(bytes);
  }
}

export async function openVault(envelope: EncryptedEnvelope, password: string): Promise<VaultSecret> {
  const bytes = await decrypt(envelope, password);
  try {
    const secret = JSON.parse(utf8.decode(bytes)) as VaultSecret;
    validateSecret(secret);
    return secret;
  } finally {
    wipe(bytes);
  }
}

function validateSecret(s: VaultSecret): void {
  if (s.kind === 'mnemonic') {
    if (!isValidMnemonic(s.mnemonic)) throw new Error('Invalid mnemonic');
    if (!Number.isInteger(s.accounts) || s.accounts < 1 || s.accounts > 50) throw new Error('Invalid account count');
  } else if (s.kind === 'privateKey') {
    if (!normalizePrivateKey(s.privateKey)) throw new Error('Invalid private key');
  } else {
    throw new Error('Unknown secret kind');
  }
}

/**
 * In-memory session holding the decrypted secret in a closure.
 * Deliberately NOT part of any React/Zustand state so it never ends up in devtools or serialization.
 */
export function createKeyring() {
  let secret: VaultSecret | null = null;

  return {
    isUnlocked: () => secret !== null,
    unlock(s: VaultSecret) {
      secret = s.kind === 'mnemonic' ? { ...s, mnemonic: normalizeMnemonic(s.mnemonic) } : s;
    },
    lock() {
      secret = null;
    },
    /** Returns a private key for signing; callers must not persist or log it. */
    getPrivateKey(index = 0): Hex {
      if (!secret) throw new Error('Wallet is locked');
      if (secret.kind === 'privateKey') return secret.privateKey;
      return derivePrivateKey(secret.mnemonic, index);
    },
    /** Explicit, user-confirmed reveal for backup screens only. */
    revealMnemonic(): string {
      if (secret?.kind !== 'mnemonic') throw new Error('No mnemonic available');
      return secret.mnemonic;
    },
  };
}

export const keyring = createKeyring();
