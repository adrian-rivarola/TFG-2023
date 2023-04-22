import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import type { Budget } from "./Budget";
import type { Transaction } from "./Transaction";

export enum CategoryType {
  expense,
  income,
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

  @OneToMany("Transaction", "category")
  transactions: Relation<Transaction>[];

  @OneToMany("Budget", "category")
  budgets: Relation<Budget>[];

  @CreateDateColumn()
  createdAt: Date;

  get isExpense() {
    return this.type === CategoryType.expense;
  }

  get isIncome() {
    return this.type === CategoryType.income;
  }
}
