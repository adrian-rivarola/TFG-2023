import * as SQLite from "expo-sqlite";
import {
  ColumnMapping,
  columnTypes,
  IQueryOptions,
  IStatement,
  Migrations,
  Repository,
  sql,
} from "expo-sqlite-orm";

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type TransactionCreate = Omit<Transaction, "id" | "createdAt" | "updatedAt">;

type TransactionRepository = Repository<Transaction>;

const DB_NAME = "app.db";

export default class TransactionService {
  repository: TransactionRepository;
  tableName = "transactions";

  constructor() {
    this.repository = new Repository(
      DB_NAME,
      this.tableName,
      this.columnMapping
    );
  }

  get columnMapping(): ColumnMapping<Transaction> {
    return {
      id: { type: columnTypes.INTEGER },
      description: { type: columnTypes.TEXT },
      amount: { type: columnTypes.FLOAT },
      createdAt: { type: columnTypes.DATETIME, default: () => Date.now() },
      updatedAt: { type: columnTypes.DATETIME, default: () => Date.now() },
    };
  }

  createTable() {
    const createStatement: IStatement = {
      [`${Date.now()}_create_transactions_table`]: sql`
        CREATE TABLE transactions (
          id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          amount FLOAT NOT NULL,
          description TEXT,
          createdAt DATETIME,
          updatedAt DATETIME
        );`,
    };
    const migrations = new Migrations(DB_NAME, createStatement);
    return migrations.migrate();
  }

  insertTestData() {
    return this.repository.insert({
      description: "Test Transaction #1",
      amount: 42000,
    });
  }

  query(options: IQueryOptions<Transaction> | undefined) {
    console.log(`Getting transactions with query: ${JSON.stringify(options)} `);

    return this.repository.query(options);
  }

  insert(options: TransactionCreate) {
    const now = new Date();
    return this.repository.insert({
      ...options,
      createdAt: now,
      updatedAt: now,
    });
  }
}
