import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Transaction } from "./Transaction";
import { Budget } from "./Budget";

export enum CategoryType {
  expense, // ->  0
  income, //  ->  1
}

@Entity("Category")
export class Category {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("varchar")
  name: string;

  @Column("varchar")
  icon: string;

  @Column("int")
  type: number;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  @OneToMany(() => Budget, (budget) => budget.category)
  budgets: Budget[];

  @Column("date")
  createdAt: string;

  @BeforeInsert()
  onBeforeInsert() {
    this.createdAt = new Date().toISOString();
  }
}
