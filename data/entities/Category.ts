import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import type { Transaction } from "./Transaction";
import type { Budget } from "./Budget";

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
