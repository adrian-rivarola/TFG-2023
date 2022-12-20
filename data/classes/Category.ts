import {
  ColumnMapping,
  columnTypes,
  IQueryOptions,
  IStatement,
  Migrations,
  Repository,
  sql,
} from "expo-sqlite-orm";

export enum CategoryType {
  expense, // ->  0
  income, //  ->  1
}

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  icon: string;
  createdAt?: number;
}

type CategoryCreate = Omit<Category, "id" | "createdAt">;

type CategoryRepository = Repository<Category>;

const DB_NAME = "app.db";

export default class CategoryService {
  repository: CategoryRepository;
  tableName = "categories";

  constructor() {
    this.repository = new Repository(
      DB_NAME,
      this.tableName,
      this.columnMapping
    );
  }

  get columnMapping(): ColumnMapping<Category> {
    return {
      id: { type: columnTypes.INTEGER },
      name: { type: columnTypes.TEXT },
      icon: { type: columnTypes.TEXT },
      type: { type: columnTypes.INTEGER },
      createdAt: { type: columnTypes.DATETIME, default: () => Date.now() },
    };
  }

  createTable() {
    const createStatement: IStatement = {
      "1671398460360_create_categories_table": sql`
          CREATE TABLE categories (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            icon TEXT NOT NULL,
            type INTEGER NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          );`,
    };
    const migrations = new Migrations(DB_NAME, createStatement);
    return migrations.migrate();
  }

  insertTestData() {
    return this.repository.insert({
      name: "Category #1",
      icon: "house",
      type: 0,
    });
  }

  query(options: IQueryOptions<Category> | undefined) {
    // console.log(`Getting Categories with query: ${JSON.stringify(options)} `);

    return this.repository.query(options);
  }

  insert(options: CategoryCreate) {
    return this.repository.insert(options);
  }
}
