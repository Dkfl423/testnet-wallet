import { getAddress, isAddress, zeroAddress, type Address } from 'viem';

export type AddressValidation =
  | { ok: true; address: Address; checksumWarning: boolean }
  | { ok: false; reason: 'empty' | 'invalid' | 'zero' | 'self' };

export function validateAddress(input: string, self?: Address): AddressValidation {
  const v = input.trim();
  if (!v) return { ok: false, reason: 'empty' };
  if (!isAddress(v, { strict: false })) return { ok: false, reason: 'invalid' };
  // Mixed-case input must match EIP-55 checksum exactly.
  const hasMixedCase = v !== v.toLowerCase() && v !== v.toUpperCase().replace('0X', '0x');
  if (hasMixedCase && !isAddress(v, { strict: true })) return { ok: false, reason: 'invalid' };
  const address = getAddress(v);
  if (address === zeroAddress) return { ok: false, reason: 'zero' };
  if (self && address === getAddress(self)) return { ok: false, reason: 'self' };
  return { ok: true, address, checksumWarning: !hasMixedCase };
}
