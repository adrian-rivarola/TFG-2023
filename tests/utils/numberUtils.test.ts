import { convertToShortScale, formatCurrency } from '@/utils/numberUtils';

describe('formatCurrency', () => {
  it('should format the currency amount correctly', () => {
    expect(formatCurrency(0).replace(/\s/, ' ')).toBe('Gs. 0');
    expect(formatCurrency(1000).replace(/\s/, ' ')).toBe('Gs. 1.000');
    expect(formatCurrency(50000).replace(/\s/, ' ')).toBe('Gs. 50.000');
    expect(formatCurrency(750000).replace(/\s/, ' ')).toBe('Gs. 750.000');
    expect(formatCurrency(1234567).replace(/\s/, ' ')).toBe('Gs. 1.234.567');
  });
});

describe('convertToShortScale', () => {
  it('should formats the values correctly', () => {
    expect(convertToShortScale(0)).toBe('0');
    expect(convertToShortScale(1_000)).toBe('1K');
    expect(convertToShortScale(50_000)).toBe('50K');
    expect(convertToShortScale(750_000)).toBe('750K');
    expect(convertToShortScale(1_250_000)).toBe('1M');
    expect(convertToShortScale(1_200_000, 1)).toBe('1.2M');
    expect(convertToShortScale(1_750_000, 2)).toBe('1.75M');
  });
});
