import dayjs from "dayjs";
import {
  Column,
  CreateDateColumn,
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";

import { dataSource } from "../data-source";
import type { Category } from "./Category";
import { Transaction } from "./Transaction";

@Entity("Budget")
export class Budget {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("varchar")
  description: string;

  @Column("float")
  maxAmount: number;

  @Column("date")
  startDate: Date;

  @Column("date")
  endDate: Date;

  @Column("boolean")
  isActive: boolean;

  @ManyToOne("Category", "budgets", {
    eager: true,
  })
  @JoinColumn()
  category: Relation<Category>;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  totalSpent: number;

  get dateInfo() {
    const start = dayjs(this.startDate);
    const end = dayjs(this.endDate);

    if (start.isSame(end, "month")) {
      return `${start.format("D")} al ${end.format("D [de] MMMM")}`;
    } else {
      return `${start.format("D [de] MMMM")} al ${end.format("D [de] MMMM")}`;
    }
  }

  async getTotalSpent() {
    const { category, startDate, endDate } = this;
    try {
      const { totalSpent } = await dataSource
        .createQueryBuilder(Transaction, "Transaction")
        .select("SUM(amount)", "totalSpent")
        .where("categoryId = :id", { id: category.id })
        .andWhere("date BETWEEN :startDate AND :endDate", {
          startDate,
          endDate,
        })
        .getRawOne();

      this.totalSpent = totalSpent || 0;
    } catch (err) {
      console.log("Failed to get total spend of budget: ", this.id);
    }
  }
}

@EventSubscriber()
export class BudgetSubscriber implements EntitySubscriberInterface<Budget> {
  listenTo() {
    return Budget;
  }
  async afterLoad(budget: any): Promise<any | void> {
    await budget?.getTotalSpent?.();
  }
}
