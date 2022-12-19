import { IStatement, Migrations, sql } from "expo-sqlite-orm";
import config from "../constants/config";

const migrationStatements: IStatement = {
  "1671411669510_drop_everything": sql`
    DROP TABLE IF EXISTS transactions;
    DROP TABLE IF EXISTS categories;
  `,
  // Create categories table
  "1671398460361_create_categories_table": sql`
    CREATE TABLE categories (
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      type INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

  // Create transactions table
  "1671397885381_create_transactions_table": sql`
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

export default function runMigrations() {
  const migrations = new Migrations(config.DB_NAME, migrationStatements);
  console.log(
    `Running migrations:\n ${Object.keys(migrationStatements).join("\n")}`
  );
  return migrations
    .migrate()
    .then((res) => {
      console.log(`Migrations completed!:\n${JSON.stringify(res)}`);
    })
    .catch((err) => {
      console.log(`Migrations failed!:\n${JSON.stringify(err)}`);
    });
}
