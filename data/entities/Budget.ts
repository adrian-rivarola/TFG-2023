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
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import {
  StringDateRange,
  getDateInfo,
  getDatesFromRange,
} from "../../utils/dateUtils";
import type { Category } from "./Category";
import { Transaction } from "./Transaction";

type BudgetDateRange = Exclude<StringDateRange, "day">;

export type BudgetFormData = {
  id?: number;
  dateRange: BudgetDateRange;
  maxAmount: number;
  categories: number[];
  description: string;
};

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

  @Column("varchar", {
    nullable: false,
  })
  dateRange: BudgetDateRange;

  @ManyToMany("Category", {
    eager: true,
    nullable: false,
  })
  @JoinTable({ name: "BudgetCategories" })
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  totalSpent = 0;
  transactions: Transaction[] = [];

  get startDate() {
    return dayjs().startOf(this.dateRange).startOf("day");
  }

  get endDate() {
    return dayjs().endOf(this.dateRange).endOf("day");
  }

  get dateInfo() {
    return getDateInfo(getDatesFromRange(this.dateRange));
  }

  get percentage() {
    return Math.floor((this.totalSpent / this.maxAmount) * 100);
  }

  static async findTransactions(
    budget: Budget,
    offest = 0
  ): Promise<Transaction[]> {
    const { categories, dateRange } = budget;
    const { startDate, endDate } = getDatesFromRange(dateRange, offest);

    return Transaction.find({
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

  static async getTotalSpent(budget: Budget, offset = 0): Promise<number> {
    const { startDate, endDate } = getDatesFromRange(budget.dateRange, offset);

    try {
      const totalSpent = await Transaction.sum("amount", {
        category: In(budget.categories.map((c) => c.id)),
        date: Between(startDate, endDate),
      });

      return totalSpent || 0;
    } catch (err) {
      console.log("Failed to get total spend of budget:", err);
    }
    return 0;
  }

  serialize(): BudgetFormData {
    return {
      id: this.id,
      dateRange: this.dateRange,
      maxAmount: this.maxAmount,
      description: this.description,
      categories: this.categories.map((c) => c.id),
    };
  }
}

@EventSubscriber()
export class BudgetSubscriber implements EntitySubscriberInterface<Budget> {
  listenTo() {
    return Budget;
  }

  async afterLoad(budget: Budget | any): Promise<any | void> {
    if (budget instanceof Budget) {
      budget.totalSpent = await Budget.getTotalSpent(budget);
    }
  }
}
