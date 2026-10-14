import { validateAddress } from '@/core/validation/address';
import { validateAmount } from '@/core/validation/amount';
import { checkPassword } from '@/core/validation/password';
import { formatAmount } from '@/core/format/units';
import { shortenAddress } from '@/core/format/address';
import { assertTestnet } from '@/core/chains/chains';
import { _redactForTests as redact } from '@/lib/logger';

const A = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

describe('validateAddress', () => {
  it('accepts checksummed and lowercase', () => {
    expect(validateAddress(A)).toMatchObject({ ok: true, checksumWarning: false });
    expect(validateAddress(A.toLowerCase())).toMatchObject({ ok: true, checksumWarning: true });
  });
  it('rejects bad checksum, zero, self, garbage', () => {
    expect(validateAddress(A.replace('F39', 'f39').replace('aad', 'AAD'))).toMatchObject({ ok: false });
    expect(validateAddress('0x' + '0'.repeat(40))).toEqual({ ok: false, reason: 'zero' });
    expect(validateAddress(A, A)).toEqual({ ok: false, reason: 'self' });
    expect(validateAddress('hello')).toEqual({ ok: false, reason: 'invalid' });
    expect(validateAddress('  ')).toEqual({ ok: false, reason: 'empty' });
  });
});

describe('validateAmount', () => {
  it('parses decimals and comma', () => {
    expect(validateAmount('1,5', 18)).toEqual({ ok: true, value: 1_500_000_000_000_000_000n });
  });
  it('rejects bad input', () => {
    expect(validateAmount('1.1234567', 6)).toEqual({ ok: false, reason: 'decimals' });
    expect(validateAmount('-1', 18)).toEqual({ ok: false, reason: 'format' });
    expect(validateAmount('0', 18)).toEqual({ ok: false, reason: 'zero' });
    expect(validateAmount('2', 0, 1n)).toEqual({ ok: false, reason: 'insufficient' });
  });
});

describe('format', () => {
  it('formats amounts', () => {
    expect(formatAmount(0n, 18)).toBe('0');
    expect(formatAmount(1_234_567_890_000_000_000_000n, 18)).toBe('1 234.56789');
    expect(formatAmount(1n, 18)).toBe('<0.000001');
  });
  it('shortens address', () => expect(shortenAddress(A)).toBe('0xf39F…2266'));
});

describe('security guards', () => {
  it('password policy', () => {
    expect(checkPassword('short').ok).toBe(false);
    expect(checkPassword('Correct-Horse-9').ok).toBe(true);
  });
  it('blocks mainnet', () => {
    expect(() => assertTestnet(1)).toThrow();
    expect(() => assertTestnet(11155111)).not.toThrow();
  });
  it('logger redacts secrets', () => {
    const out = JSON.stringify(redact({ mnemonic: 'a b c', note: '0x' + 'a'.repeat(64) }));
    expect(out).not.toContain('a b c');
    expect(out).not.toContain('a'.repeat(64));
  });
});
