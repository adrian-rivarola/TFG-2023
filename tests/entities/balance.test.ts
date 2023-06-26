import { DataSource } from 'typeorm';

import { initiMemoryDB } from './dbSetup';
import { Balance, Category, CategoryType, Transaction } from '../../data';

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
    expect(Balance.getTotalBalance()).resolves.toBe(0);
  });

  it('should get initial balance if no transactions exists', async () => {
    await Balance.setInitialBalance(10_000);

    expect(Balance.getTotalBalance()).resolves.toBe(10_000);
  });

  it('should reset the initialBalance with setInitialBalance()', async () => {
    const balance = await Balance.setInitialBalance(10_000);
    expect(balance.initialBalance).toBe(10_000);
    expect(Balance.count()).resolves.toBe(1);

    const newBalance = await Balance.setInitialBalance(5_000);
    expect(newBalance.initialBalance).toBe(5_000);
    expect(Balance.count()).resolves.toBe(1);
  });

  it('should calculate balance if transactions exists', async () => {
    await Balance.setInitialBalance(15_000);
    await Transaction.save([
      {
        category: incomeCategory,
        date: '2023-01-01',
        amount: 20_000,
      },
      {
        category: expenseCategory,
        date: '2023-01-01',
        amount: 5_000,
      },
    ]);
    // initial balance + income - expense = 15_000 + 20_000 - 5_000 = 30_000

    expect(Balance.getTotalBalance()).resolves.toBe(30_000);
  });
});
