import { formatUnits } from 'viem';

/** Human-friendly token amount: trims trailing zeros, caps fraction digits, shows "<0.0001" for dust. */
export function formatAmount(value: bigint, decimals: number, maxFraction = 6): string {
  if (value === 0n) return '0';
  const full = formatUnits(value, decimals);
  const [int, frac = ''] = full.split('.');
  const trimmed = frac.slice(0, maxFraction).replace(/0+$/, '');
  if (int === '0' && !trimmed) return `<0.${'0'.repeat(maxFraction - 1)}1`;
  const intGrouped = (int ?? '0').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return trimmed ? `${intGrouped}.${trimmed}` : intGrouped;
}
