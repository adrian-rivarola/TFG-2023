/* istanbul ignore file */
import { DataSource } from 'typeorm';

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
    driver: require('expo-sqlite'),
    logging: false,
    synchronize: true,
    entities: DB_ENTITIES,
    subscribers: DB_SUBSCRIBERS,
  });
  dataSource = await dataSource.initialize();
  DB_ENTITIES.map((e) => e.useDataSource(dataSource));

  return dataSource;
}

export async function clearAllData() {
  await Budget.clear();
  await Transaction.clear();
  await Balance.clear();
  await Category.clear();
}
