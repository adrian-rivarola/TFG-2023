import { DataSource, QueryFailedError } from 'typeorm';

import { initiMemoryDB } from './dbSetup';
import { Category, CategoryType } from '@/data';

describe('Category', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await initiMemoryDB();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await Category.clear();
  });

  it('should create a new expense category', async () => {
    const category = await Category.create({
      name: 'Expense Category',
      icon: 'icon',
      type: CategoryType.expense,
    }).save();

    expect(category).toBeInstanceOf(Category);
    expect(category.id).toBeDefined();
    expect(category.type).toBe(CategoryType.expense);
    expect(category.isExpense).toBe(true);
    expect(category.isIncome).toBe(false);

    expect(Category.countBy({ type: CategoryType.expense })).resolves.toBe(1);
  });

  it('should serialize a category to JSON', () => {
    const category = Category.create({
      name: 'Expense Category',
      icon: 'icon',
      type: CategoryType.expense,
    });

    const categoryData = category.serialize();
    ['id', 'name', 'icon', 'type'].forEach((prop) => {
      expect(categoryData).toHaveProperty(prop);
    });
  });

  it('should create a new income category', async () => {
    const category = await Category.create({
      name: 'Income Category',
      icon: 'icon',
      type: CategoryType.income,
    }).save();

    expect(category).toBeInstanceOf(Category);
    expect(category.id).toBeDefined();
    expect(category.type).toBe(CategoryType.income);
    expect(category.isIncome).toBe(true);
    expect(category.isExpense).toBe(false);

    expect(Category.countBy({ type: CategoryType.income })).resolves.toBe(1);
  });

  it('should not create a category with missing fields', async () => {
    expect(Category.save({})).rejects.toThrow(QueryFailedError);
  });
});
