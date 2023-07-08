import dayjs from 'dayjs';

import { Balance } from './entities/Balance';
import { Budget } from './entities/Budget';
import { Category, CategoryType } from './entities/Category';
import { Transaction } from './entities/Transaction';
import { DATE_FORMAT } from '@/utils/dateUtils';

const EXPENSE_AMOUNTS = [10_000, 20_000, 30_000, 40_000, 50_000, 100_000, 250_000];
const INCOME_AMOUNTS = [600_000, 400_000, 500_000];

export async function createMockData() {
  await Transaction.clear();
  await Budget.clear();
  await Category.clear();
  await Balance.clear();

  await Category.save(getDefaultCategories());
  const categories = await Category.find();
  const transactions: Transaction[] = [];

  let dateStart = dayjs().startOf('year').subtract(2, 'month');
  // const dateEnd = dateStart.add(3, "months");

  // let dateStart = dayjs().startOf("year");
  const dateEnd = dayjs();

  while (dateStart.isBefore(dateEnd)) {
    const t = 1 + randInt(4);
    // const t = 1;

    for (let i = 0; i < t; i++) {
      const randomCategory = categories[randInt(categories.length)];
      const randomAmount = randomCategory.isExpense
        ? EXPENSE_AMOUNTS[randInt(EXPENSE_AMOUNTS.length)]
        : INCOME_AMOUNTS[randInt(INCOME_AMOUNTS.length)];

      try {
        const t = await Transaction.save({
          amount: randomAmount,
          category: randomCategory,
          date: dateStart.format(DATE_FORMAT),
          description: '',
        });
        transactions.push(t);
      } catch (err) {
        console.error(
          `Failed to save all transactions, transactions saved: ${transactions.length}`,
          err
        );
      }
    }
    dateStart = dateStart.add(1, 'day');
  }

  const expenses = await Category.find({ where: { type: CategoryType.expense } });
  await Budget.create({
    description: 'Presupuesto semanal',
    maxAmount: 150_000,
    categories: [expenses[randInt(expenses.length)]],
    dateRange: 'week',
  }).save();

  await Budget.create({
    description: 'Presupuesto menusal',
    maxAmount: 850_000,
    categories: [expenses[randInt(expenses.length)]],
    dateRange: 'month',
  }).save();

  const cCount = await Category.count();
  const tCount = await Transaction.count();

  const balance = transactions.reduce(
    (acu, t) => (t.category.isExpense ? acu - t.amount : acu + t.amount),
    0
  );
  if (balance <= 100_000) {
    await Balance.setInitialBalance(Math.abs(balance) + 200_000);
  }

  console.log(`Created ${tCount} transactions and ${cCount} categories.`);

  return {
    categories: cCount,
    transactions: tCount,
  };
}

function getDefaultCategories() {
  return Category.create([
    // income
    {
      name: 'Salario',
      icon: 'attach-money',
      type: CategoryType.income,
    },
    // {
    //   name: 'Otros ingresos',
    //   icon: 'more-horiz',
    //   type: CategoryType.income,
    // },
    // expense
    {
      name: 'Alimentos',
      icon: 'fastfood',
      type: CategoryType.expense,
    },
    {
      name: 'Entretenimiento',
      icon: 'movie',
      type: CategoryType.expense,
    },
    {
      name: 'Educación',
      icon: 'school',
      type: CategoryType.expense,
    },
    {
      name: 'Hogar',
      icon: 'home',
      type: CategoryType.expense,
    },
    {
      name: 'Salud',
      icon: 'medical-services',
      type: CategoryType.expense,
    },
    {
      name: 'Servicios básicos',
      icon: 'lightbulb-outline',
      type: CategoryType.expense,
    },
    {
      name: 'Shopping',
      icon: 'shopping-cart',
      type: CategoryType.expense,
    },
    {
      name: 'Transporte',
      icon: 'directions-bus',
      type: CategoryType.expense,
    },
    {
      name: 'Otros gastos',
      icon: 'more-horiz',
      type: CategoryType.expense,
    },
  ]);
}

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}
