import Intl from 'intl';
import 'intl/locale-data/jsonp/es-PY';

export function formatCurrency(value: number) {
  const formatter = new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
  });

  return formatter.format(value);
}

export function convertToShortScale(number: number, decimals = 0): string {
  const suffixes = ['', 'K', 'M'];
  const suffixIndex = Math.floor(Math.log10(number) / 3);
  const scaledNumber = number / Math.pow(10, suffixIndex * 3);

  return `${scaledNumber.toFixed(decimals)}${suffixes[suffixIndex]}`;
}
