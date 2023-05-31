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

import { getDatesFromRange } from "../../utils/dateUtils";
import type { Category } from "./Category";
import { Transaction } from "./Transaction";

type BudgetDateRange = "week" | "month";

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
  transactions?: Transaction[];

  get startDate() {
    return dayjs().startOf(this.dateRange).startOf("day");
  }

  get endDate() {
    return dayjs().endOf(this.dateRange).endOf("day");
  }

  get dateInfo() {
    const { startDate, endDate } = this;

    if (startDate.isSame(endDate, "month")) {
      return `${startDate.format("D")} al ${endDate.format("D [de] MMMM")}`;
    } else {
      return `${startDate.format("D [de] MMMM")} al ${endDate.format(
        "D [de] MMMM"
      )}`;
    }
  }

  static async findTransactions(budget: Budget): Promise<Transaction[]> {
    const { categories, dateRange } = budget;
    const { startDate, endDate } = getDatesFromRange(dateRange);

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

  static async getTotalSpent(budget: Budget): Promise<number> {
    const { categories, dateRange } = budget;
    const { startDate, endDate } = getDatesFromRange(dateRange);

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

  async afterLoad(budget: Budget | any): Promise<any | void> {
    if (budget instanceof Budget) {
      budget.totalSpent = await Budget.getTotalSpent(budget);
    }
  }
}
