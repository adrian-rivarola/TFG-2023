import dayjs from "dayjs";
import { sql } from "expo-sqlite-orm";
import DatabaseLayer from "expo-sqlite-orm/lib/DatabaseLayer";

import config from "../../constants/config";
import { Transaction } from "./Transaction";
import { CategoryType } from "../entities/Category";

type BalanceTotalsResult = Array<{ category_id: CategoryType; total: number }>;

type CategoryTotalsResult = Array<{
  category: string;
  record: number;
  total: number;
}>;

type WeekTotalsResult = Array<{ date: string; total: number }>;
type MonthDataResult = Array<{
  weekNumber: string;
  weekStart: string;
  weekEnd: string;
  total_transactions: number;
}>;

type TransactionWithCategory = Omit<Transaction, "category_id"> & {
  type: number | string;
  category: string;
};
export default class ReportService {
  databaseLayer: DatabaseLayer<Transaction>;
  totalSums: Record<CategoryType, number> = {
    [CategoryType.expense]: 0,
    [CategoryType.income]: 0,
  };
  balance: number = 0;

  constructor() {
    this.databaseLayer = new DatabaseLayer(config.DB_NAME, "transactions");
  }

  async getBalance(): Promise<number> {
    this.totalSums = {
      [CategoryType.expense]: 0,
      [CategoryType.income]: 0,
    };

    return this.databaseLayer
      .executeSql(
        sql`SELECT c."type" as category_id, SUM(amount) as total FROM transactions t JOIN categories c ON t.category_id = c.id GROUP by c."type";`
      )
      .then(({ rows }: { rows: BalanceTotalsResult }) => {
        rows.forEach((categoryTotal) => {
          this.totalSums[categoryTotal.category_id] = categoryTotal.total;
        });
        return (
          this.totalSums[CategoryType.income] -
          this.totalSums[CategoryType.expense]
        );
      })
      .catch((err) => {
        console.log(`Failed to get expenses total: ${JSON.stringify(err)}`);
        return 0;
      });
  }

  async getWeekTotals(startDate: string, endDate: string) {
    return this.databaseLayer
      .executeSql(
        sql`
          SELECT date, SUM(amount) AS total
          FROM transactions t
          JOIN categories c ON t.category_id = c.id
          WHERE c."type" = ? AND date BETWEEN ? AND ?
          GROUP BY date;
        `,
        [CategoryType.expense, startDate, endDate]
      )
      .then(({ rows }: { rows: WeekTotalsResult }) => {
        return rows;
      })
      .catch((err) => {
        console.log(`Failed to get expenses total: ${JSON.stringify(err)}`);
        return [];
      });
  }

  async getSomething(startDate: string): Promise<MonthDataResult> {
    return this.databaseLayer
      .executeSql(
        sql`
        SELECT 
            strftime('%W', date) weekNumber,
            max(date(date, 'weekday 1', '-7 day')) weekStart,
            max(date(date, 'weekday 1', '-1 day')) weekEnd,
            SUM(t.amount) as total_transactions
        FROM transactions t
        JOIN categories c 
        ON t.category_id = c.id
        WHERE c."type" = 0 AND t.date >= ?
        GROUP BY weekNumber;
      `,
        [startDate]
      )
      .then(({ rows }) => rows);
  }

  getCategoryTotals(catType: CategoryType) {
    return this.databaseLayer
      .executeSql(
        sql`
        SELECT c.name as category, SUM(t.amount) AS total, COUNT(*) as records
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE c.type = ?
        GROUP BY c.id;
      `,
        [catType]
      )
      .then(({ rows }: { rows: CategoryTotalsResult }) => {
        return rows;
      })
      .catch((err) => {
        console.log(`Failed to get expenses total: ${JSON.stringify(err)}`);
        return [];
      });
  }

  async getTransactionsWithCategory(): Promise<TransactionWithCategory[]> {
    return this.databaseLayer
      .executeSql(
        sql`
          SELECT t.*,
          c.type AS type,
          c.name AS category
        FROM
          transactions t
        JOIN categories c 
        ON t.category_id = c.id
        ORDER BY t."date";
        `
      )
      .then(({ rows }: { rows: TransactionWithCategory[] }) => {
        return rows.map((row) => ({
          ...row,
          type: row.type === CategoryType.expense ? "Gasto" : "Ingreso",
        }));
      })
      .catch((err) => {
        console.log(
          `Failed to getTransactionsWithCategory: ${JSON.stringify(err)}`
        );
        return [];
      });
  }
}
