/**
 * Logger that redacts anything resembling a secret before output.
 * Never pass mnemonics/keys here intentionally — redaction is a safety net, not a feature.
 */
const HEX_KEY = /0x[a-fA-F0-9]{64}/g;
const SENSITIVE_KEYS = /(mnemonic|seed|private|secret|password|phrase)/i;

function redact(value: unknown, depth = 0): unknown {
  if (depth > 4) return '[depth]';
  if (typeof value === 'string') return value.replace(HEX_KEY, '0x[REDACTED]');
  if (value instanceof Error) return { name: value.name, message: redact(value.message) };
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, SENSITIVE_KEYS.test(k) ? '[REDACTED]' : redact(v, depth + 1)]),
    );
  }
  return value;
}

export const logger = {
  warn: (msg: string, meta?: unknown) => console.warn(`[wallet] ${msg}`, meta === undefined ? '' : redact(meta)),
  error: (msg: string, meta?: unknown) => console.error(`[wallet] ${msg}`, meta === undefined ? '' : redact(meta)),
};

export { redact as _redactForTests };
