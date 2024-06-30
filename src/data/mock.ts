import dayjs from 'dayjs';

import { getDefaultCategories } from './default-categories';
import { Budget } from './entities/Budget';
import { Category, CategoryType } from './entities/Category';
import { Transaction } from './entities/Transaction';
import { Balance, dataSource } from '@/data';
import { DateRange } from '@/types';
import { DATE_FORMAT } from '@/utils/dateUtils';

export type MockOptions = {
  categories?: boolean;
  transactions?: boolean;
  budgets?: boolean;
  dateRange: DateRange;
  maxDailyTransactions: number;
};

const EXPENSE_AMOUNTS = [10_000, 20_000, 30_000, 40_000, 50_000, 100_000, 250_000];
const INCOME_AMOUNTS = [200_000, 400_000, 500_000];

export async function createMockData(options: MockOptions) {
  await Transaction.clear();
  await Budget.clear();
  await Category.clear();
  await Balance.clear();

  await Category.insert(getDefaultCategories());

  options.transactions && (await createTransactions(options));
  options.budgets && (await createBudgets());

  const cCount = await Category.count();
  const tCount = await Transaction.count();
  const bCount = await Budget.count();

  return {
    categories: cCount,
    transactions: tCount,
    budgets: bCount,
  };
}

async function createBudgets() {
  const expenses = await Category.find({ where: { type: CategoryType.expense } });
  await Budget.save([
    {
      description: 'Presupuesto semanal',
      maxAmount: 150000,
      categories: [expenses[randInt(expenses.length)]],
      dateRange: 'week',
    },
    {
      description: 'Presupuesto menusal',
      maxAmount: 850000,
      categories: [expenses[randInt(expenses.length)]],
      dateRange: 'month',
    },
  ]);
}

async function createTransactions(options: MockOptions) {
  const categories = await Category.find();

  const { startDate, endDate } = options.dateRange;
  const dateEnd = dayjs(endDate);
  let dateStart = dayjs(startDate);

  const transactionsBatches: object[][] = [[]];
  let currBatch = 0;

  while (dateStart.isBefore(dateEnd)) {
    for (let i = 0; i < options.maxDailyTransactions; i++) {
      const randomCategory = categories[randInt(categories.length)];
      const randomAmount = randomCategory.isExpense
        ? EXPENSE_AMOUNTS[randInt(EXPENSE_AMOUNTS.length)]
        : INCOME_AMOUNTS[randInt(INCOME_AMOUNTS.length)];

      transactionsBatches[currBatch].push({
        amount: randomAmount,
        category: randomCategory,
        date: dateStart.format(DATE_FORMAT),
        description: '',
      });

      if (transactionsBatches[currBatch].length === 800) {
        transactionsBatches.push([]);
        currBatch++;
      }
    }
    dateStart = dateStart.add(1, 'day');
  }

  console.log('Transaction Batches');
  transactionsBatches.forEach((batch, idx) => {
    console.log(`Batch ${idx + 1}: ${batch.length} items`);
  });

  let idx = 1;

  for (const batch of transactionsBatches) {
    console.log(`Processing batch ${idx}`);
    await dataSource.createQueryBuilder().insert().into(Transaction).values(batch).execute();
    idx++;
  }
}

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}
