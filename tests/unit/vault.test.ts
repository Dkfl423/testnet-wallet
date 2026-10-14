import { createKeyring, MIN_ITERATIONS, openVault, sealVault } from '@/core/crypto';

const M = 'test test test test test test test test test test test junk';

describe('vault & keyring', () => {
  it('seals and opens a mnemonic vault without leaking plaintext', async () => {
    const env = await sealVault({ kind: 'mnemonic', mnemonic: M, accounts: 1 }, 'Pa55word!xyz', MIN_ITERATIONS);
    expect(JSON.stringify(env)).not.toContain('junk');
    await expect(openVault(env, 'Pa55word!xyz')).resolves.toMatchObject({ kind: 'mnemonic', mnemonic: M });
  });

  it('refuses to seal an invalid secret', async () => {
    await expect(sealVault({ kind: 'mnemonic', mnemonic: 'foo bar', accounts: 1 }, 'x')).rejects.toThrow();
  });

  it('keyring locks and wipes access', () => {
    const k = createKeyring();
    expect(() => k.getPrivateKey()).toThrow(/locked/);
    k.unlock({ kind: 'mnemonic', mnemonic: M, accounts: 1 });
    expect(k.getPrivateKey(0)).toMatch(/^0x[0-9a-f]{64}$/);
    k.lock();
    expect(k.isUnlocked()).toBe(false);
    expect(() => k.revealMnemonic()).toThrow();
  });
});
