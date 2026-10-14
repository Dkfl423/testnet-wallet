import { decrypt, DecryptionError, encrypt, MIN_ITERATIONS } from '@/core/crypto';
import { utf8 } from '@/core/crypto/encoding';

const IT = MIN_ITERATIONS;

describe('AES-GCM envelope', () => {
  it('round-trips plaintext', async () => {
    const env = await encrypt(utf8.encode('hello'), 'Str0ng!Passw0rd', IT);
    expect(utf8.decode(await decrypt(env, 'Str0ng!Passw0rd'))).toBe('hello');
  });

  it('uses unique salt and IV per encryption', async () => {
    const a = await encrypt(utf8.encode('x'), 'pw-Abcdef123', IT);
    const b = await encrypt(utf8.encode('x'), 'pw-Abcdef123', IT);
    expect(a.kdf.salt).not.toBe(b.kdf.salt);
    expect(a.cipher.iv).not.toBe(b.cipher.iv);
    expect(a.ct).not.toBe(b.ct);
  });

  it('rejects wrong password', async () => {
    const env = await encrypt(utf8.encode('secret'), 'right-Pass123', IT);
    await expect(decrypt(env, 'wrong-Pass123')).rejects.toBeInstanceOf(DecryptionError);
  });

  it('detects tampering', async () => {
    const env = await encrypt(utf8.encode('secret'), 'right-Pass123', IT);
    const tampered = { ...env, ct: env.ct.slice(0, -4) + (env.ct.endsWith('AAAA') ? 'BBBB' : 'AAAA') };
    await expect(decrypt(tampered, 'right-Pass123')).rejects.toBeInstanceOf(DecryptionError);
  });

  it('refuses weak KDF parameters', async () => {
    const env = await encrypt(utf8.encode('x'), 'pw-Abcdef123', IT);
    await expect(decrypt({ ...env, kdf: { ...env.kdf, iterations: 1000 } }, 'pw-Abcdef123')).rejects.toThrow(
      /Malformed/,
    );
  });
});
