import { DataSource } from 'typeorm';

import { initiMemoryDB } from './dbSetup';
import { Category, Transaction } from '@/data';

describe('Transaction', () => {
  let category: Category;
  let dataSource: DataSource;

  beforeEach(async () => {
    await Transaction.clear();
  });

  beforeAll(async () => {
    dataSource = await initiMemoryDB();

    category = await Category.create({
      name: 'Category 1',
      icon: 'icon',
      type: 0,
    }).save();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should create a new transaction correctly', async () => {
    const transaction = Transaction.create({
      description: 'Transaction 1',
      date: '2023-01-01',
      amount: 42_000,
      category,
    });
    expect(transaction).toBeInstanceOf(Transaction);
    expect(transaction.id).toBeUndefined();

    await transaction.save();
    expect(transaction.id).toBeDefined();
    expect(transaction.category).toBeInstanceOf(Category);
    expect(transaction.category.id).toBe(category.id);

    expect(Transaction.count()).resolves.toBe(1);
  });

  it('should serialize a transaction to JSON', () => {
    const transaction = Transaction.create({
      description: 'Transaction 1',
      date: '2023-01-01',
      amount: 42_000,
      category,
    });

    const transactionData = transaction.serialize();
    ['id', 'date', 'category', 'amount'].forEach((prop) => {
      expect(transactionData).toHaveProperty(prop);
    });
  });

  describe('getTotalSpentAndCount', () => {
    let category2: Category;

    beforeAll(async () => {
      category2 = await Category.create({
        name: 'Category 2',
        icon: 'icon',
        type: 0,
      }).save();
    });

    it('should get amount totals for a category type', async () => {
      await Transaction.save([
        {
          description: 'Transaction 1',
          date: '2023-01-01',
          amount: 20_000,
          category,
        },
        {
          description: 'Transaction 2',
          date: '2023-01-01',
          amount: 20_000,
          category,
        },
        {
          description: 'Transaction 3',
          date: '2023-01-01',
          amount: 20_000,
          category: category2,
        },
      ]);

      const [result1, result2] = await Transaction.getTotalSpentAndCount(category.type);

      expect(result1.count).toBe(2);
      expect(result1.total).toBe(40_000);
      expect(result1.category.id).toBe(category.id);

      expect(result2.count).toBe(1);
      expect(result2.total).toBe(20_000);
      expect(result2.category.id).toBe(category2.id);
    });

    it('should get amount totals for a category type in a date range', async () => {
      await Transaction.save([
        {
          description: 'Transaction 1',
          date: '2023-01-01',
          amount: 20_000,
          category,
        },
        {
          description: 'Transaction 2',
          date: '2023-12-31',
          amount: 20_000,
          category,
        },
      ]);

      const dateRange = {
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      };
      const [total] = await Transaction.getTotalSpentAndCount(category.type, dateRange);

      expect(total.total).toBe(20_000);
      expect(total.count).toBe(1);
      expect(total.category.id).toBe(category.id);
    });
  });

  describe('getDailyTotals', () => {
    it('should get expenses amount for a day', async () => {
      await Transaction.save([
        {
          description: 'Transaction 1',
          date: '2023-01-01',
          amount: 10_000,
          category,
        },
        {
          description: 'Transaction 2',
          date: '2023-01-01',
          amount: 10_000,
          category,
        },
        {
          description: 'Transaction 3',
          date: '2023-01-02',
          amount: 10_000,
          category,
        },
      ]);

      const dateRange = {
        startDate: '2023-01-01',
        endDate: '2023-01-07',
      };
      const [total1, total2] = await Transaction.getDailyTotals(dateRange);

      expect(total1.amount).toBe(20_000);
      expect(total1.date).toBe('2023-01-01');

      expect(total2.amount).toBe(10_000);
      expect(total2.date).toBe('2023-01-02');
    });
  });
});
