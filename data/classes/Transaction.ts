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
import { Category } from "./Category";
import dayjs from "dayjs";

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  category_id: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TransactionDetails = Transaction & {
  category: Category;
};

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

  query(options: IQueryOptions<Transaction> = {}) {
    return this.repository.query({
      ...options,
      order: {
        date: "DESC",
      },
    });
  }

  insert(options: TransactionCreate) {
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
    return this.repository.insert({
      ...options,
      createdAt: now,
      updatedAt: now,
    });
  }

  update(id: number, options: TransactionCreate) {
    const updatedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
    return this.repository.update({
      ...options,
      updatedAt,
      id,
    });
  }

  getById(id: number): Promise<Transaction | null> {
    return this.repository.find(id);
  }

  delete(id: number) {
    return this.repository.destroy(id);
  }
}
