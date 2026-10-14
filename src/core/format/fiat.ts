export type FiatCurrency = 'usd' | 'eur' | 'rub';

export function formatFiat(value: number | null | undefined, currency: FiatCurrency, locale = 'ru-RU'): string {
  if (value == null || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}
