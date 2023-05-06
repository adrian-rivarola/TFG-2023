import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import type { Transaction } from "./Transaction";

export enum CategoryType {
  expense,
  income,
}

@Entity("Category")
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("varchar", {
    unique: true,
    nullable: false,
  })
  name: string;

  @Column("varchar")
  icon: string;

  @Column("int", {
    nullable: false,
  })
  type: number;

  @OneToMany("Transaction", "category")
  transactions: Relation<Transaction>[];

  @CreateDateColumn()
  createdAt: Date;

  get isExpense() {
    return this.type === CategoryType.expense;
  }

  get isIncome() {
    return this.type === CategoryType.income;
  }
}
