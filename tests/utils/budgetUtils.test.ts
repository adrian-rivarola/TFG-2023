import dayjs from 'dayjs';
import { DataSource } from 'typeorm';

import { initiMemoryDB } from '../entities/dbSetup';
import { Budget, Category, CategoryType, Transaction } from '@/data';
import { BUDGET_COLORS } from '@/theme/colors';
import { getBudgetStatusColor, getBudgetTrend } from '@/utils/budgetUtils';

describe('getBudgetStatusColor', () => {
  it('should return the correct color for percentage below 60', () => {
    expect(getBudgetStatusColor(0)).toBe(BUDGET_COLORS.LOW);
    expect(getBudgetStatusColor(59)).toBe(BUDGET_COLORS.LOW);
  });

  it('should return the correct color for percentage below 95', () => {
    expect(getBudgetStatusColor(60)).toBe(BUDGET_COLORS.MEDIUM);
    expect(getBudgetStatusColor(94)).toBe(BUDGET_COLORS.MEDIUM);
  });

  it('should return the correct color for percentage above 95', () => {
    expect(getBudgetStatusColor(95)).toBe(BUDGET_COLORS.HIGH);
    expect(getBudgetStatusColor(100)).toBe(BUDGET_COLORS.HIGH);
    expect(getBudgetStatusColor(200)).toBe(BUDGET_COLORS.HIGH);
  });
});

describe('getBudgetTrend', () => {
  const monthStart = dayjs().startOf('month');
  const weekStart = dayjs().startOf('week');
  let dataSource: DataSource;
  let category: Category;

  beforeAll(async () => {
    dataSource = await initiMemoryDB();
    category = Category.create({
      name: 'Category 1',
      icon: 'icon',
      type: CategoryType.expense,
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should get daily trend for a weekly budget', () => {
    const budget = Budget.create({
      dateRange: 'week',
      maxAmount: 100_000,
      categories: [category],
      description: 'budget 1',
    });

    for (let i = 0; i <= 6; i++) {
      budget.transactions.push(
        Transaction.create({
          category,
          amount: 10_000,
          date: weekStart.add(i, 'day').format(),
        })
      );
    }

    const { trend, labels } = getBudgetTrend(budget);
    expect(trend).toHaveLength(7);
    expect(labels).toHaveLength(7);

    trend.forEach((value, idx) => {
      expect(value).toBe(10_000 * (idx + 1));
      expect(labels[idx]).toBe(weekStart.add(idx, 'day').format('ddd'));
    });
  });

  it('should get weekly trend for a monthly budget', () => {
    const budget = Budget.create({
      dateRange: 'month',
      maxAmount: 100_000,
      categories: [category],
      description: 'budget 1',
    });
    const monthWeeks = Math.ceil(monthStart.endOf('month').diff(monthStart, 'week', true));

    for (let i = 0; i < monthWeeks; i++) {
      budget.transactions.push(
        Transaction.create({
          category,
          amount: 10_000,
          date: monthStart.add(i, 'week').format(),
        })
      );
    }

    const { trend, labels } = getBudgetTrend(budget);
    expect(trend).toHaveLength(monthWeeks);
    expect(labels).toHaveLength(monthWeeks);

    trend.forEach((value, idx) => {
      expect(value).toBe(10_000 * (idx + 1));
      expect(labels[idx]).toBe(monthStart.add(idx, 'week').format('DD/MM'));
    });
  });
});
