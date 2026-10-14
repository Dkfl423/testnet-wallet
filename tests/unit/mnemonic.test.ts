import {
  derivePrivateKey,
  deriveAddress,
  generateMnemonic,
  isValidMnemonic,
  normalizePrivateKey,
  pickQuizIndices,
} from '@/core/crypto';

// Well-known Hardhat/Anvil test mnemonic — public, never holds real funds.
const TEST_MNEMONIC = 'test test test test test test test test test test test junk';

describe('mnemonic', () => {
  it('generates valid 12 and 24 word phrases', () => {
    expect(generateMnemonic(12).split(' ')).toHaveLength(12);
    expect(generateMnemonic(24).split(' ')).toHaveLength(24);
    expect(isValidMnemonic(generateMnemonic())).toBe(true);
  });

  it('rejects bad checksum and wrong length', () => {
    expect(isValidMnemonic('test '.repeat(12))).toBe(false);
    expect(isValidMnemonic('abandon abandon abandon')).toBe(false);
  });

  it('normalizes whitespace and case', () => {
    expect(isValidMnemonic(`  ${TEST_MNEMONIC.toUpperCase().replace(/ /g, '   ')} `)).toBe(true);
  });

  it('derives BIP-44 addresses matching Hardhat defaults', () => {
    expect(deriveAddress(TEST_MNEMONIC, 0)).toBe('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(deriveAddress(TEST_MNEMONIC, 1)).toBe('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
    expect(derivePrivateKey(TEST_MNEMONIC, 0)).toBe(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    );
  });

  it('validates private keys', () => {
    expect(normalizePrivateKey('ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')).toMatch(/^0x/);
    expect(normalizePrivateKey('0x' + '0'.repeat(64))).toBeNull();
    expect(normalizePrivateKey('0x' + 'f'.repeat(64))).toBeNull();
    expect(normalizePrivateKey('0x1234')).toBeNull();
  });

  it('picks distinct sorted quiz indices', () => {
    const idx = pickQuizIndices(12, 3);
    expect(new Set(idx).size).toBe(3);
    expect([...idx].sort((a, b) => a - b)).toEqual(idx);
    expect(idx.every((i) => i >= 0 && i < 12)).toBe(true);
  });
});
