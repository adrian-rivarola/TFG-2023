import { DataSource } from "typeorm";
import { Budget, Category, Transaction } from "../../data";

/**
 * initialize the database
 */
export function initiMemoryDB() {
  const dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    logging: false,
    synchronize: true,
    entities: [Budget, Category, Transaction],
  });

  return dataSource.initialize();
}
