import { fromBase64, randomBytes, toBase64, utf8 } from './encoding';
import { DEFAULT_ITERATIONS, deriveKey, MIN_ITERATIONS } from './kdf';

export const ENVELOPE_VERSION = 1;

/** Serializable encrypted payload. Safe to persist (contains no plaintext). */
export interface EncryptedEnvelope {
  v: typeof ENVELOPE_VERSION;
  kdf: { name: 'PBKDF2'; hash: 'SHA-256'; iterations: number; salt: string };
  cipher: { name: 'AES-GCM'; iv: string };
  ct: string;
}

export class DecryptionError extends Error {
  constructor() {
    super('Invalid password or corrupted data');
    this.name = 'DecryptionError';
  }
}

export async function encrypt(
  plaintext: Uint8Array,
  password: string,
  iterations = DEFAULT_ITERATIONS,
): Promise<EncryptedEnvelope> {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = await deriveKey(password, { name: 'PBKDF2', hash: 'SHA-256', iterations, salt });
  const aad = utf8.encode(`tw:v${ENVELOPE_VERSION}`);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: aad }, key, plaintext));
  return {
    v: ENVELOPE_VERSION,
    kdf: { name: 'PBKDF2', hash: 'SHA-256', iterations, salt: toBase64(salt) },
    cipher: { name: 'AES-GCM', iv: toBase64(iv) },
    ct: toBase64(ct),
  };
}

export async function decrypt(envelope: EncryptedEnvelope, password: string): Promise<Uint8Array> {
  assertEnvelope(envelope);
  const key = await deriveKey(password, {
    name: 'PBKDF2',
    hash: 'SHA-256',
    iterations: envelope.kdf.iterations,
    salt: fromBase64(envelope.kdf.salt),
  });
  try {
    const aad = utf8.encode(`tw:v${envelope.v}`);
    const pt = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(envelope.cipher.iv), additionalData: aad },
      key,
      fromBase64(envelope.ct),
    );
    return new Uint8Array(pt);
  } catch {
    throw new DecryptionError();
  }
}

export function assertEnvelope(e: unknown): asserts e is EncryptedEnvelope {
  const x = e as EncryptedEnvelope;
  const ok =
    !!x &&
    x.v === ENVELOPE_VERSION &&
    x.kdf?.name === 'PBKDF2' &&
    x.kdf.hash === 'SHA-256' &&
    Number.isInteger(x.kdf.iterations) &&
    x.kdf.iterations >= MIN_ITERATIONS &&
    typeof x.kdf.salt === 'string' &&
    x.cipher?.name === 'AES-GCM' &&
    typeof x.cipher.iv === 'string' &&
    typeof x.ct === 'string';
  if (!ok) throw new Error('Malformed encrypted envelope');
}
