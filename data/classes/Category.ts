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

  query(options: IQueryOptions<Category> | undefined) {
    // console.log(`Getting Categories with query: ${JSON.stringify(options)} `);

    return this.repository.query(options);
  }

  insert(options: CategoryCreate) {
    return this.repository.insert(options);
  }
}
