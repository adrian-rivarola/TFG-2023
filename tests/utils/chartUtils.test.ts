import dayjs from 'dayjs';

import { DateAmountEntity } from '@/types';
import { getTotalsByDate } from '@/utils/chartUtils';

describe('getTotalsByDate', () => {
  const dateFormat = 'DD/MM';
  const monthStart = dayjs().startOf('month');
  const weekStart = dayjs().startOf('week');
  const weekDays = [
    weekStart,
    weekStart.add(1, 'day'),
    weekStart.add(2, 'day'),
    weekStart.add(3, 'day'),
    weekStart.add(4, 'day'),
    weekStart.add(5, 'day'),
    weekStart.add(6, 'day'),
  ];

  it('should fill the date range with empty values', () => {
    const weekResult = getTotalsByDate([], 'week', 'day', dateFormat);
    const monthResult = getTotalsByDate([], 'month', 'week', dateFormat);

    const monthWeeks = Math.ceil(monthStart.endOf('month').diff(monthStart, 'week', true));

    expect(Object.keys(weekResult)).toHaveLength(7);
    expect(Object.keys(monthResult)).toHaveLength(monthWeeks);
  });

  it('should return correct values for a week range', () => {
    const entities: DateAmountEntity[] = weekDays.map((d) => ({ amount: 10_000, date: d }));

    const result = getTotalsByDate(entities, 'week', 'day', dateFormat);

    expect(Object.keys(result)).toHaveLength(7);
    weekDays.forEach((day) => {
      const key = day.format(dateFormat);

      expect(result[key]).toBe(10_000);
    });
  });

  it('should acumulate amounts in the same day', () => {
    const entities: DateAmountEntity[] = [
      {
        amount: 10_000,
        date: weekStart,
      },
      {
        amount: 10_000,
        date: weekStart,
      },
      {
        amount: 10_000,
        date: weekStart,
      },
    ];

    const result = getTotalsByDate(entities, 'week', 'day', dateFormat);
    const data = result[weekStart.format(dateFormat)];

    expect(data).toBe(30_000);
  });

  it('should acumulate amounts in the same week', () => {
    const entities: DateAmountEntity[] = [
      // First week
      {
        amount: 10_000,
        date: monthStart,
      },
      {
        amount: 10_000,
        date: monthStart.add(1, 'day'),
      },
      {
        amount: 10_000,
        date: monthStart.add(2, 'day'),
      },
      // Second week
      {
        amount: 10_000,
        date: monthStart.add(1, 'week'),
      },
      {
        amount: 10_000,
        date: monthStart.add(1, 'week').add(1, 'day'),
      },
    ];

    const result = getTotalsByDate(entities, 'month', 'week', dateFormat);
    const week1 = result[monthStart.format(dateFormat)];
    const week2 = result[monthStart.add(1, 'week').format(dateFormat)];
    const resultTotal = Object.values(result).reduce((acc, val) => acc + val, 0);

    expect(week1).toBe(30_000);
    expect(week2).toBe(20_000);
    expect(resultTotal).toBe(50_000);
  });
});
