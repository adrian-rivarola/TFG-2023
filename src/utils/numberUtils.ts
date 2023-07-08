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
  if (number === 0) {
    return '0';
  }
  const suffixes = ['', 'K', 'M'];
  const suffixIndex = Math.floor(Math.log10(number) / 3);
  const scaledNumber = number / Math.pow(10, suffixIndex * 3);
  const fixedNumber =
    scaledNumber % 1 > 0 ? scaledNumber.toFixed(decimals) : scaledNumber.toFixed(0);

  return `${fixedNumber.endsWith('0'.repeat(decimals)) ? scaledNumber.toFixed(0) : fixedNumber}${
    suffixes[suffixIndex]
  }`;
}
