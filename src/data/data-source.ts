/* istanbul ignore file */
import * as SQLite from 'expo-sqlite/legacy';
import { DataSource } from 'typeorm';

import { getDefaultCategories } from './default-categories';
import { Balance } from './entities/Balance';
import { Budget, BudgetSubscriber } from './entities/Budget';
import { Category } from './entities/Category';
import { Transaction } from './entities/Transaction';

const DB_NAME = 'app-data.db';
export let dataSource: DataSource;

export const DB_ENTITIES = [Category, Budget, Transaction, Balance];
export const DB_SUBSCRIBERS = [BudgetSubscriber];

/**
 * initialize the database
 */
export async function initiDB(dbName: string = DB_NAME) {
  dataSource = new DataSource({
    type: 'expo',
    database: dbName,
    driver: SQLite,
    logging: false,
    synchronize: false,
    entities: DB_ENTITIES,
    subscribers: DB_SUBSCRIBERS,
  });
  dataSource = await dataSource.initialize();
  DB_ENTITIES.map((e) => e.useDataSource(dataSource));

  syncDB();

  return dataSource;
}

export async function clearAllData() {
  await Budget.clear();
  await Transaction.clear();
  await Balance.clear();
  await Category.clear();
}

async function syncDB() {
  const requiredTables = DB_ENTITIES.map((e) => dataSource.getMetadata(e).tableName);

  const tables: any[] = await dataSource.query(`SELECT name FROM sqlite_master WHERE type='table'`);
  const existingTables: string[] = tables.map((t) => t.name);

  const allTablesExist = requiredTables.every((t) => existingTables.includes(t));
  if (allTablesExist) {
    return;
  }

  console.log('Initializing DB...');
  await dataSource.synchronize(false);
  await Category.insert(getDefaultCategories());
}
