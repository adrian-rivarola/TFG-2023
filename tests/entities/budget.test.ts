import dayjs from 'dayjs';
import { DataSource } from 'typeorm';

import { initiMemoryDB } from './dbSetup';
import { Budget, Category, CategoryType, Transaction } from '@/data';

describe('Budget', () => {
  let dataSource: DataSource;
  let categories: Category[];

  const monthStart = dayjs().startOf('month');
  const weekStart = dayjs().startOf('week');
  const weekEnd = dayjs().endOf('week');

  beforeAll(async () => {
    dataSource = await initiMemoryDB();
    categories = Category.create([
      {
        name: 'Category 1',
        icon: 'icon',
        type: CategoryType.expense,
      },
      {
        name: 'Category 2',
        icon: 'icon',
        type: CategoryType.expense,
      },
    ]);
    await Category.save(categories);
  });

  beforeEach(async () => {
    await Transaction.clear();
    await Budget.clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should create a budget with the correct date range', async () => {
    const weekBudget = await Budget.create({
      description: 'Budget #1',
      maxAmount: 100_000,
      dateRange: 'week',
      categories,
    }).save();

    expect(weekBudget).toBeInstanceOf(Budget);
    expect(weekBudget.startDate.isSame(weekStart, 'day')).toBe(true);
    expect(weekBudget.endDate.isSame(weekEnd, 'day')).toBe(true);

    expect(weekBudget.totalSpent).toBe(0);
  });

  it('should serialize a budget to JSON', () => {
    const budget = Budget.create({
      description: 'Budget #1',
      maxAmount: 100_000,
      dateRange: 'week',
      categories,
    });

    const budgetData = budget.serialize();
    ['id', 'description', 'dateRange', 'categories', 'maxAmount'].forEach((prop) => {
      expect(budgetData).toHaveProperty(prop);
    });
  });

  it('should be able to get dateInfo', async () => {
    const monthBudget = Budget.create({
      description: 'Budget #1',
      maxAmount: 100_000,
      dateRange: 'month',
      categories,
    });

    expect(monthBudget.dateInfo).toBe(
      `${monthStart.format('DD')} al ${monthStart.endOf('month').format('DD [de] MMMM')}`
    );
  });

  it('should include existing transactions in total spent', async () => {
    await Transaction.save([
      {
        amount: 10_000,
        category: categories[0],
        date: weekStart.format('YYYY-MM-DD'),
      },
      {
        amount: 10_000,
        category: categories[0],
        date: weekEnd.format('YYYY-MM-DD'),
      },
    ]);

    const budget = await Budget.create({
      description: 'Budget #1',
      maxAmount: 100_000,
      dateRange: 'week',
      categories,
    }).save();

    budget.totalSpent = await Budget.getTotalSpent(budget);
    budget.transactions = await Budget.findTransactions(budget);

    expect(budget.transactions).toHaveLength(2);
    expect(budget.totalSpent).toBe(20_000);
    expect(budget.percentage).toBe(20);
  });

  it('should get total spent when budget is loaded from the db', async () => {
    const mock = jest.spyOn(Budget, 'getTotalSpent').mockResolvedValue(10_000);

    await Budget.save({
      description: 'Budget #1',
      maxAmount: 100_000,
      dateRange: 'week',
      categories,
    });
    const budget = await Budget.findOne({
      where: {
        description: 'Budget #1',
      },
    });

    expect(budget?.totalSpent).toBe(10_000);
    mock.mockRestore();
  });

  it('should handle error getting total spent', async () => {
    const sumError = new Error('Failed to get total spent');
    const sumMock = jest.spyOn(Transaction, 'sum').mockRejectedValue(sumError);
    const logMock = jest.spyOn(console, 'log').mockImplementation(() => {});

    await Transaction.save({
      amount: 5_000,
      category: categories[0],
      date: weekStart.format('YYYY-MM-DD'),
    });

    const budget = await Budget.create({
      description: 'Budget #1',
      maxAmount: 100_000,
      dateRange: 'week',
      categories,
    }).save();

    const totalSpent = await Budget.getTotalSpent(budget);

    expect(totalSpent).toBe(0);
    expect(logMock).toHaveBeenCalledWith('Failed to get total spend of budget:', sumError);

    sumMock.mockRestore();
    logMock.mockRestore();
  });

  it('should get previous periods', async () => {
    await Transaction.save([
      // current week
      {
        amount: 5_000,
        category: categories[0],
        date: weekStart.format('YYYY-MM-DD'),
      },
      // 1 week ago
      {
        amount: 5_000,
        category: categories[0],
        date: weekStart.add(-1, 'week').format('YYYY-MM-DD'),
      },
      {
        amount: 5_000,
        category: categories[0],
        date: weekStart.add(-1, 'week').format('YYYY-MM-DD'),
      },
      // 2 weeks ago
      {
        amount: 10_000,
        category: categories[0],
        date: weekStart.add(-2, 'week').format('YYYY-MM-DD'),
      },
      {
        amount: 10_000,
        category: categories[0],
        date: weekStart.add(-2, 'week').format('YYYY-MM-DD'),
      },
      // 3 weeks ago
      {
        amount: 15_000,
        category: categories[0],
        date: weekStart.add(-3, 'week').format('YYYY-MM-DD'),
      },
      {
        amount: 15_000,
        category: categories[0],
        date: weekStart.add(-3, 'week').format('YYYY-MM-DD'),
      },
    ]);

    const weekBudget = await Budget.create({
      description: 'Budget #1',
      maxAmount: 100_000,
      dateRange: 'week',
      categories,
    }).save();

    const previouesPeriods = await Budget.getPreviousPeriods(weekBudget);

    expect(previouesPeriods).toHaveLength(3);
    previouesPeriods.forEach((val, idx) => {
      expect(val.totalSpent).toBe(10_000 * (idx + 1));
    });
  });

  it('should return an empty list if no transactions exist', async () => {
    const weekBudget = await Budget.create({
      description: 'Budget #1',
      maxAmount: 100_000,
      dateRange: 'week',
      categories,
    }).save();

    const previouesPeriods = await Budget.getPreviousPeriods(weekBudget);

    expect(previouesPeriods).toHaveLength(0);
  });

  it('should return an empty list if no transactions exist for previous periods', async () => {
    await Transaction.save(
      // current week
      {
        amount: 5_000,
        category: categories[0],
        date: weekStart.format('YYYY-MM-DD'),
      }
    );
    const weekBudget = await Budget.create({
      description: 'Budget #1',
      maxAmount: 100_000,
      dateRange: 'week',
      categories,
    }).save();

    const previouesPeriods = await Budget.getPreviousPeriods(weekBudget);

    expect(previouesPeriods).toHaveLength(0);
  });
});
