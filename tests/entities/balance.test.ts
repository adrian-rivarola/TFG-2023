import { DataSource } from 'typeorm';

import { initiMemoryDB } from './dbSetup';
import { Balance, Category, CategoryType, Transaction } from '@/data';

describe('Balance', () => {
  let dataSource: DataSource;
  let expenseCategory: Category;
  let incomeCategory: Category;

  beforeAll(async () => {
    dataSource = await initiMemoryDB();

    expenseCategory = await Category.create({
      name: 'Category 1',
      icon: 'icon',
      type: CategoryType.expense,
    }).save();
    incomeCategory = await Category.create({
      name: 'Category 2',
      icon: 'icon',
      type: CategoryType.income,
    }).save();
  });

  beforeEach(async () => {
    await Transaction.clear();
    await Balance.setInitialBalance(0);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("should return 0 if there isn't any transactions", async () => {
    expect(await Balance.getTotalBalance()).toBe(0);
  });

  it('should get the initial balance if no transactions exists', async () => {
    await Balance.setInitialBalance(10_000);

    expect(await Balance.getTotalBalance()).toBe(10_000);
  });

  it('should reset the initialBalance with setInitialBalance()', async () => {
    const balance = await Balance.setInitialBalance(10_000);
    expect(balance.initialBalance).toBe(10_000);
    expect(await Balance.count()).toBe(1);

    const newBalance = await Balance.setInitialBalance(5_000);
    expect(newBalance.initialBalance).toBe(5_000);
    expect(await Balance.count()).toBe(1);
  });

  it('should calculate balance if expense transactions exist', async () => {
    await Transaction.save([
      {
        category: expenseCategory,
        date: '2023-01-01',
        amount: 10_000,
      },
    ]);

    expect(await Balance.getTotalBalance()).toBe(-10_000);
  });

  it('should calculate balance if income transactions exist', async () => {
    await Transaction.save([
      {
        category: incomeCategory,
        date: '2023-01-01',
        amount: 10_000,
      },
    ]);

    expect(await Balance.getTotalBalance()).toBe(10_000);
  });

  it('should calculate balance if expense and income transactions exist', async () => {
    await Transaction.save([
      {
        category: incomeCategory,
        date: '2023-01-01',
        amount: 20_000,
      },
      {
        category: expenseCategory,
        date: '2023-01-01',
        amount: 10_000,
      },
    ]);

    expect(await Balance.getTotalBalance()).toBe(10_000);
  });

  it('should calculate balance if an initial balance, expense and income transactions exist', async () => {
    await Balance.setInitialBalance(50_000);
    await Transaction.save([
      {
        category: incomeCategory,
        date: '2023-01-01',
        amount: 10_000,
      },
      {
        category: expenseCategory,
        date: '2023-01-01',
        amount: 20_000,
      },
    ]);

    expect(await Balance.getTotalBalance()).toBe(40_000);
  });

  it('should get balance info for a date range', async () => {
    await Transaction.save([
      {
        category: incomeCategory,
        date: '2023-01-01',
        amount: 10_000,
      },
      {
        category: expenseCategory,
        date: '2023-01-31',
        amount: 20_000,
      },
      // transactions out of range
      {
        category: incomeCategory,
        date: '2023-02-01',
        amount: 100_000,
      },
      {
        category: expenseCategory,
        date: '2023-02-01',
        amount: 100_000,
      },
    ]);

    const monthBalance = await Balance.getPartialBalance({
      startDate: '2023-01-01',
      endDate: '2023-01-31',
    });

    expect(monthBalance).toHaveProperty('totalIncome');
    expect(monthBalance.totalIncome).toBe(10_000);

    expect(monthBalance).toHaveProperty('totalExpense');
    expect(monthBalance.totalExpense).toBe(20_000);
  });
});
