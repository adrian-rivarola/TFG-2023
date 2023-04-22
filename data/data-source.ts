import { DataSource } from "typeorm";
import { Budget, BudgetSubscriber } from "./entities/Budget";
import { Category } from "./entities/Category";
import { Transaction } from "./entities/Transaction";

// /Users/adrian/Library/Developer/CoreSimulator//Devices/3AF7C0FF-3FC8-49F7-99F1-9C51AEF6F39F/data/Containers/Data/Application/450A6EDF-F952-4C9F-9000-F6C4BD5B7582/Documents/ExponentExperienceData/%40anonymous%2Fmy-app-007f7c61-2c84-4410-9bd2-5990ffbd84e8/SQLite/mydb-orm-test.db
export const dataSource = new DataSource({
  type: "expo",
  database: "mydb-orm-test.db",
  driver: require("expo-sqlite"),
  logging: false,
  synchronize: true,
  entities: [Category, Budget, Transaction],
  subscribers: [BudgetSubscriber],
});
