import { sql } from "expo-sqlite-orm";
import DatabaseLayer from "expo-sqlite-orm/lib/DatabaseLayer";
import config from "../../constants/config";
import { Category, CategoryType } from "./Category";
import { Transaction } from "./Transaction";

type CategoryTotalsResult = Array<{ category_id: CategoryType; total: number }>;

type WeekTotalsResult = Array<{ date: string; total: number }>;

type TransactionWithCategory = Omit<Transaction, "category_id"> & {
  type: number | string;
  category: string;
};
export default class ReportService {
  databaseLayer: DatabaseLayer<Transaction>;
  weekTotals: Record<string, number> = {};
  totalSums: Record<CategoryType, number> = {
    [CategoryType.expense]: 0,
    [CategoryType.income]: 0,
  };
  balance: number = 0;

  constructor() {
    this.databaseLayer = new DatabaseLayer(config.DB_NAME, "transactions");
  }

  async getData() {
    await this.getTotals();
    // this.getWeekTotals();
  }

  async getTotals() {
    this.totalSums = {
      [CategoryType.expense]: 0,
      [CategoryType.income]: 0,
    };

    return this.databaseLayer
      .executeSql(
        sql`SELECT c."type" as category_id, SUM(amount) as total FROM transactions t JOIN categories c ON t.category_id = c.id GROUP by c."type";`
      )
      .then(({ rows }: { rows: CategoryTotalsResult }) => {
        rows.forEach((categoryTotal) => {
          this.totalSums[categoryTotal.category_id] = categoryTotal.total;
        });
        this.balance =
          this.totalSums[CategoryType.income] -
          this.totalSums[CategoryType.expense];
      })
      .catch((err) => {
        console.log(`Failed to get expenses total: ${JSON.stringify(err)}`);
      });
  }

  async getWeekTotals() {
    const lastMonday = new Date();
    const dateOffset = 6 + lastMonday.getDay();
    lastMonday.setDate(lastMonday.getDate() - dateOffset);

    return this.databaseLayer
      .executeSql(
        sql`
          SELECT date, SUM(amount) AS total
          FROM transactions t
          JOIN categories c ON t.category_id = c.id
          WHERE c."type" = ? and date >= ?
          GROUP BY date;
        `,
        [CategoryType.expense, lastMonday.toISOString().split("T")[0]]
      )
      .then(({ rows }: { rows: WeekTotalsResult }) => {
        // TODO: improve this
        this.weekTotals = {};
        for (let i = 0; i < 7; i++) {
          this.weekTotals[`${lastMonday.getDate() + i}`] = 0;
        }
        rows.forEach(({ date, total }) => {
          const day = date.split("-")[2];
          this.weekTotals[day] = total;
        });
      })
      .catch((err) => {
        console.log(`Failed to get expenses total: ${JSON.stringify(err)}`);
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
        ON t.category_id = c.id;
        `
      )
      .then(({ rows }: { rows: TransactionWithCategory[] }) => {
        return rows.map((row) => ({
          ...row,
          type: row.type === CategoryType.expense ? "Gasto" : "Ingreso",
        }));
      })
      .catch((err) => {
        console.log(`Failed to get expenses total: ${JSON.stringify(err)}`);
        return [];
      });
  }
}
