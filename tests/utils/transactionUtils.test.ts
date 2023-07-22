import dayjs from 'dayjs';
import { DataSource } from 'typeorm';

import { initiMemoryDB } from '../entities/dbSetup';
import { Category, CategoryType, Transaction } from '@/data';
import { groupTransactionsByDate } from '@/utils/transactionUtils';

describe('groupTransactionsByDate', () => {
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

  it('should group transactions from the same day', () => {
    const transactions = Transaction.create([
      {
        amount: 10_000,
        date: weekStart.format(),
        description: 'Transaction 1',
        category,
      },
      {
        amount: 10_000,
        date: weekStart.format(),
        description: 'Transaction 2',
        category,
      },
      {
        amount: 10_000,
        date: weekStart.add(1, 'day').format(),
        description: 'Transaction 3',
        category,
      },
      {
        amount: 10_000,
        date: weekStart.add(2, 'day').format(),
        description: 'Transaction 4',
        category,
      },
    ]);

    const transactionGroup = groupTransactionsByDate(transactions, 'day');

    expect(transactionGroup.size).toBe(3);
    transactionGroup.forEach((value, date) => {
      const expectedLength = date.isSame(weekStart) ? 2 : 1;
      expect(value).toHaveLength(expectedLength);
    });
  });

  it('should group transactions from the same week', () => {
    const transactions = Transaction.create([
      {
        amount: 10_000,
        date: weekStart.format(),
        description: 'Transaction 1',
        category,
      },
      {
        amount: 10_000,
        date: weekStart.add(3, 'day').format(),
        description: 'Transaction 2',
        category,
      },
      {
        amount: 10_000,
        date: weekStart.add(1, 'week').format(),
        description: 'Transaction 3',
        category,
      },
      {
        amount: 10_000,
        date: weekStart.add(2, 'week').format(),
        description: 'Transaction 4',
        category,
      },
    ]);

    const transactionGroup = groupTransactionsByDate(transactions, 'week');

    expect(transactionGroup.size).toBe(3);
    transactionGroup.forEach((value, date) => {
      const expectedLength = date.isSame(weekStart) ? 2 : 1;
      expect(value).toHaveLength(expectedLength);
    });
  });
});
