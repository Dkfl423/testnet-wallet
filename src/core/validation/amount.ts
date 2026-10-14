import { parseUnits } from 'viem';

export type AmountValidation =
  | { ok: true; value: bigint }
  | { ok: false; reason: 'empty' | 'format' | 'decimals' | 'zero' | 'insufficient' };

const AMOUNT_RE = /^\d+(\.\d+)?$/;

export function validateAmount(input: string, decimals: number, balance?: bigint): AmountValidation {
  const v = input.trim().replace(',', '.');
  if (!v) return { ok: false, reason: 'empty' };
  if (!AMOUNT_RE.test(v)) return { ok: false, reason: 'format' };
  const fraction = v.split('.')[1] ?? '';
  if (fraction.length > decimals) return { ok: false, reason: 'decimals' };
  const value = parseUnits(v, decimals);
  if (value === 0n) return { ok: false, reason: 'zero' };
  if (balance !== undefined && value > balance) return { ok: false, reason: 'insufficient' };
  return { ok: true, value };
}
