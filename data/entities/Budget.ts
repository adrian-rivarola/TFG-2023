import dayjs from "dayjs";
import {
  BaseEntity,
  Between,
  Column,
  CreateDateColumn,
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  In,
  JoinTable,
  LessThanOrEqual,
  ManyToMany,
  MoreThan,
  PrimaryGeneratedColumn,
} from "typeorm";

import type { Category } from "./Category";
import { Transaction } from "./Transaction";

@Entity("Budget")
export class Budget extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("varchar")
  description: string;

  @Column("float", {
    nullable: false,
  })
  maxAmount: number;

  @Column("date", {
    nullable: false,
  })
  startDate: Date;

  @Column("date", {
    nullable: false,
  })
  endDate: Date;

  @ManyToMany("Category", {
    eager: true,
    nullable: false,
  })
  @JoinTable({ name: "BudgetCategories" })
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  totalSpent: number;
  transactions?: Transaction[];

  get dateInfo() {
    const start = dayjs(this.startDate);
    const end = dayjs(this.endDate);

    if (start.isSame(end, "month")) {
      return `${start.format("D")} al ${end.format("D [de] MMMM")}`;
    } else {
      return `${start.format("D [de] MMMM")} al ${end.format("D [de] MMMM")}`;
    }
  }

  static async findTransactions(budget: Budget): Promise<Transaction[]> {
    const { categories, startDate, endDate } = budget;

    return Transaction.find({
      relations: ["category"],
      order: {
        date: "DESC",
      },
      where: {
        category: {
          id: In(categories.map((c) => c.id)),
        },
        date: Between(startDate, endDate),
      },
    });
  }

  static findBudgetsForTransaction(transaction: Transaction) {
    const { category, date } = transaction;

    return Budget.find({
      where: {
        categories: {
          id: In([category.id]),
        },
        startDate: LessThanOrEqual(date),
        endDate: MoreThan(date),
      },
    });
  }

  static async getTotalSpent(budget: Budget): Promise<number> {
    const { categories, startDate, endDate } = budget;

    if (categories === undefined) return 0;

    try {
      const totalSpent = await Transaction.sum("amount", {
        category: In(categories.map((c) => c.id)),
        date: Between(startDate, endDate),
      });

      return totalSpent || 0;
    } catch (err) {
      console.log("Failed to get total spend of budget:", err);
    }
    return 0;
  }
}

@EventSubscriber()
export class BudgetSubscriber implements EntitySubscriberInterface<Budget> {
  listenTo() {
    return Budget;
  }

  async afterLoad(budget: Budget): Promise<any | void> {
    budget.totalSpent = await Budget.getTotalSpent(budget);
    // console.log("afterLoad", { ...budget, totalSpent: budget.totalSpent });
  }
}
