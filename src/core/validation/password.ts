export interface PasswordCheck {
  ok: boolean;
  score: 0 | 1 | 2 | 3 | 4;
  issues: Array<'length' | 'variety' | 'common'>;
}

const COMMON = new Set(['password', '12345678', 'qwerty123', 'password1', '11111111', 'iloveyou']);

export function checkPassword(pw: string): PasswordCheck {
  const issues: PasswordCheck['issues'] = [];
  if (pw.length < 10) issues.push('length');
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
  if (classes < 3) issues.push('variety');
  if (COMMON.has(pw.toLowerCase())) issues.push('common');
  const raw = Math.min(4, Math.floor(pw.length / 4) + classes - 2 - (issues.includes('common') ? 4 : 0));
  const score = Math.max(0, raw) as PasswordCheck['score'];
  return { ok: issues.length === 0, score, issues };
}
