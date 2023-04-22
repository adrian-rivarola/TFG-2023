import {
  Budget,
  Category,
  CategoryType,
  Transaction,
  dataSource,
} from "../data";

type WeekTotalsResult = Array<{ date: string; total: number }>;
type MonthDataResult = Array<{
  weekNumber: string;
  weekStart: string;
  weekEnd: string;
  totalTransactions: number;
}>;

type CategoryTotalsResult = Array<{
  category: string;
  record: number;
  total: number;
}>;

const transactionRepository = dataSource.getRepository(Transaction);
// const categoryRepository = dataSource.getRepository(Category);
// const budgetRepository = dataSource.getRepository(Budget);

export const getBalance = async () => {
  const expenseTotal = await transactionRepository.sum("amount", {
    category: {
      type: CategoryType.expense,
    },
  });
  const incomeTotal = await transactionRepository.sum("amount", {
    category: {
      type: CategoryType.income,
    },
  });

  return (incomeTotal || 0) - (expenseTotal || 0);
};

export async function getCategoryTotals(
  categoryType: CategoryType
): Promise<CategoryTotalsResult> {
  return transactionRepository
    .createQueryBuilder("transaction")
    .select("category.name", "category")
    .addSelect("SUM(transaction.amount)", "total")
    .innerJoin("transaction.category", "category")
    .where("category.type = :type", { type: categoryType })
    .groupBy("category.name")
    .getRawMany()
    .then((results) => {
      return results.sort((a, b) => b.total - a.total);
    });
}

export async function getWeekTotals(
  startDate: string,
  endDate: string
): Promise<WeekTotalsResult> {
  return transactionRepository
    .createQueryBuilder("transaction")
    .select("date", "date")
    .addSelect("SUM(amount)", "total")
    .innerJoin("transaction.category", "category")
    .where("category.type = :type", { type: CategoryType.expense })
    .andWhere("date BETWEEN :startDate AND :endDate", { startDate, endDate })
    .groupBy("date")
    .getRawMany();
}

export async function getMonthlyTotals(
  startDate: string
): Promise<MonthDataResult> {
  return transactionRepository
    .createQueryBuilder("transaction")
    .select("strftime('%W', date)", "weekNumber")
    .addSelect("max(date(date, 'weekday 1', '-7 day'))", "weekStart")
    .addSelect("max(date(date, 'weekday 1', '-1 day'))", "weekEnd")
    .addSelect("SUM(transaction.amount)", "totalTransactions")
    .innerJoin("transaction.category", "category")
    .where("category.type = :type", { type: CategoryType.expense })
    .andWhere("transaction.date >= :startDate", { startDate })
    .groupBy("weekNumber")
    .getRawMany();
}
