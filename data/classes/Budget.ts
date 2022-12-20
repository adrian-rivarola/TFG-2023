import {
  ColumnMapping,
  columnTypes,
  IQueryOptions,
  IStatement,
  Migrations,
  Repository,
  sql,
} from "expo-sqlite-orm";
import DatabaseLayer from "expo-sqlite-orm/lib/DatabaseLayer";
import config from "../../constants/config";

export interface Budget {
  id: number;
  description: string;
  max_amount: number;
  category_id: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at?: number;
  updated_at?: number;
}

export type BudgetStatus = Budget & {
  transactionsTotal: number;
};

type BudgetCreate = Omit<Budget, "id" | "created_at" | "updated_at">;

type BudgetRepository = Repository<Budget>;

type BudgetStatusResult = {
  id: number;
  total_transactions: number;
};

export default class BudgetService {
  repository: BudgetRepository;
  tableName = "budgets";

  constructor() {
    this.repository = new Repository(
      config.DB_NAME,
      this.tableName,
      this.columnMapping
    );
  }

  get columnMapping(): ColumnMapping<Budget> {
    return {
      id: { type: columnTypes.INTEGER },
      category_id: { type: columnTypes.INTEGER },
      description: { type: columnTypes.TEXT },
      max_amount: { type: columnTypes.FLOAT },
      start_date: { type: columnTypes.DATETIME },
      end_date: { type: columnTypes.DATETIME },
      is_active: { type: columnTypes.BOOLEAN },
      created_at: { type: columnTypes.DATETIME, default: () => Date.now() },
      updated_at: { type: columnTypes.DATETIME, default: () => Date.now() },
    };
  }

  query(options: IQueryOptions<Budget> = {}) {
    // console.log(`Transaction.query.options: ${JSON.stringify(options)}`);

    return this.repository.query({
      ...options,
    });
  }

  insert(options: BudgetCreate) {
    return this.repository.insert(options);
  }

  async addStatusToBudget(budget: Budget): Promise<BudgetStatus> {
    const db = new DatabaseLayer(config.DB_NAME, "transactions");
    return db
      .executeSql(
        sql`
      SELECT 
        b.id, 
        SUM(t.amount) as total_transactions
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      JOIN budgets b ON b.category_id = c.id
      WHERE t."date" BETWEEN b.start_date AND b.end_date AND b.id = ?;
      `,
        [budget.id]
      )
      .then(({ rows }: { rows: BudgetStatusResult[] }) => {
        return {
          ...budget,
          transactionsTotal: rows[0].total_transactions ?? 0,
        };
      });
    // GROUP BY b.id;
  }
}
