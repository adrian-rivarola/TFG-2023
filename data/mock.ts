import dayjs from "dayjs";
import { DATE_FORMAT } from "../utils/dateUtils";
import { Category, CategoryType } from "./entities/Category";
import { Transaction } from "./entities/Transaction";
import { Budget } from "./entities/Budget";

const AMOUNTS = [
  10_000, 20_000, 30_000, 40_000, 50_000, 100_000, 250_000, 500_000,
];

export async function createMockData() {
  await Transaction.clear();
  await Budget.clear();
  await Category.clear();

  const categories = await Category.save([
    {
      name: "Food & Drinks",
      icon: "fastfood",
      type: CategoryType.expense,
    },
    {
      name: "Shopping",
      icon: "shopping-cart",
      type: CategoryType.expense,
    },
    {
      name: "Housing",
      icon: "home",
      type: CategoryType.expense,
    },
    {
      name: "Vehicle",
      icon: "directions-car",
      type: CategoryType.expense,
    },
    {
      name: "Life & Entertainment",
      icon: "local-movies",
      type: CategoryType.expense,
    },
    {
      name: "Communication, PC",
      icon: "computer",
      type: CategoryType.expense,
    },
    {
      name: "Financial Expenses",
      icon: "account-balance",
      type: CategoryType.expense,
    },
    {
      name: "Transportation",
      icon: "directions-bus",
      type: CategoryType.expense,
    },
  ]);

  const cat = await Category.save({
    name: "Salary",
    icon: "account-balance-wallet",
    type: CategoryType.income,
  });

  await Transaction.save({
    amount: 4_000_000,
    category: cat,
    date: dayjs().format(DATE_FORMAT),
    description: "",
  });

  for (let i = 0; i < 30; i++) {
    const randomDay = Math.floor(Math.random() * 30) + 1;
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomAmount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];

    await Transaction.save({
      amount: randomAmount,
      category: randomCategory,
      date: `2023-06-${randomDay}`,
      description: "",
    });
  }

  const cCount = await Category.count();
  const tCount = await Transaction.count();

  console.log(`Created ${tCount} transactions and ${cCount} categories.`);
}

export const getDefaultCategories = () =>
  Category.create([
    // expense
    {
      name: "Alimentos",
      icon: "fastfood",
      type: CategoryType.expense,
    },
    {
      name: "Entretenimiento",
      icon: "movie",
      type: CategoryType.expense,
    },
    {
      name: "Educación",
      icon: "school",
      type: CategoryType.expense,
    },
    {
      name: "Hogar",
      icon: "home",
      type: CategoryType.expense,
    },
    {
      name: "Salud",
      icon: "medical-services",
      type: CategoryType.expense,
    },
    {
      name: "Servicios básicos",
      icon: "lightbulb-outline",
      type: CategoryType.expense,
    },
    {
      name: "Shopping",
      icon: "shopping-cart",
      type: CategoryType.expense,
    },
    {
      name: "Transporte",
      icon: "directions-bus",
      type: CategoryType.expense,
    },
    {
      name: "Otros gastos",
      icon: "more-horiz",
      type: CategoryType.expense,
    },
    // income
    {
      name: "Salario",
      icon: "attach-money",
      type: CategoryType.income,
    },
    {
      name: "Otros ingresos",
      icon: "more-horiz",
      type: CategoryType.income,
    },
  ]);
