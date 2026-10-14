import { utf8 } from './encoding';

export const MIN_ITERATIONS = 310_000; // OWASP 2023 for PBKDF2-HMAC-SHA256
export const DEFAULT_ITERATIONS = 600_000;

export interface KdfParams {
  name: 'PBKDF2';
  hash: 'SHA-256';
  iterations: number;
  salt: Uint8Array;
}

/** Derives a non-extractable AES-256-GCM key from a password. */
export async function deriveKey(password: string, params: KdfParams): Promise<CryptoKey> {
  if (params.iterations < MIN_ITERATIONS) throw new Error('KDF iterations below safe minimum');
  const baseKey = await crypto.subtle.importKey('raw', utf8.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: params.hash, iterations: params.iterations, salt: params.salt },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}
