import {
  ColumnMapping,
  columnTypes,
  IQueryOptions,
  IStatement,
  Migrations,
  Repository,
  sql,
} from "expo-sqlite-orm";
import config from "../../constants/config";

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  category_id: number;
  date: string;
  createdAt?: number;
  updatedAt?: number;
}

type TransactionCreate = Omit<Transaction, "id" | "createdAt" | "updatedAt">;

type TransactionRepository = Repository<Transaction>;

export default class TransactionService {
  repository: TransactionRepository;
  tableName = "transactions";

  constructor() {
    this.repository = new Repository(
      config.DB_NAME,
      this.tableName,
      this.columnMapping
    );
  }

  get columnMapping(): ColumnMapping<Transaction> {
    return {
      id: { type: columnTypes.INTEGER },
      category_id: { type: columnTypes.INTEGER },
      description: { type: columnTypes.TEXT },
      amount: { type: columnTypes.FLOAT },
      date: { type: columnTypes.DATETIME },
      createdAt: { type: columnTypes.DATETIME, default: () => Date.now() },
      updatedAt: { type: columnTypes.DATETIME, default: () => Date.now() },
    };
  }

  createTable() {
    const createStatement: IStatement = {
      "1671397885342_create_transactions_table": sql`
        CREATE TABLE transactions (
          id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          amount FLOAT NOT NULL,
          description TEXT NOT NULL,
          category_id INTEGER NOT NULL,
          date DATETIME DEFAULT CURRENT_TIMESTAMP,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id)
        );`,
    };
    const migrations = new Migrations(config.DB_NAME, createStatement);
    return migrations.migrate();
  }

  query(options: IQueryOptions<Transaction> = {}) {
    // console.log(`Transaction.query.options: ${JSON.stringify(options)}`);

    return this.repository.query({
      ...options,
      order: {
        date: "DESC",
      },
    });
  }

  insert(options: TransactionCreate) {
    return this.repository.insert(options);
  }

  async getBalance(): Promise<number> {
    this.repository.databaseLayer.executeSql(sql``);
    return 12;
  }
}
