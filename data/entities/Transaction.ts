import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import type { Budget } from "./Budget";
import { Category, CategoryType } from "./Category";
import { DateRange } from "../../utils/dateUtils";

type DailyTotals = Array<{ date: string; total: number }>;
type WeeklyTotals = Array<{
  weekNumber: string;
  weekStart: string;
  weekEnd: string;
  totalTransactions: number;
}>;

export type CategoryTotal = {
  categoryName: string;
  categoryIcon: string;
  total: number;
  count: number;
};

@Entity("Transaction")
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("varchar", {
    default: "",
  })
  description: string;

  @Column("float", {
    nullable: false,
  })
  amount: number;

  @Column("date")
  date: string;

  @ManyToOne("Category", "transactions", {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  @Index()
  category: Relation<Category>;

  @CreateDateColumn()
  createdAt: Date;

  static async getTotalsByCategoryType(
    categoryType: CategoryType,
    dateRange?: DateRange
  ): Promise<CategoryTotal[]> {
    let query = Transaction.createQueryBuilder("t")
      .select("category.name", "categoryName")
      .addSelect("category.icon", "categoryIcon")
      .addSelect("SUM(t.amount)", "total")
      .addSelect("COUNT(*)", "count")
      .innerJoin("t.category", "category")
      .where("category.type = :type", { type: categoryType });

    if (dateRange) {
      query = query.andWhere("date BETWEEN :startDate AND :endDate", dateRange);
    }

    return query.orderBy("total", "DESC").groupBy("category.name").getRawMany();
  }

  static getDailyTotals(dateRange: DateRange): Promise<DailyTotals> {
    return Transaction.createQueryBuilder("t")
      .select("date", "date")
      .addSelect("SUM(amount)", "total")
      .innerJoin("t.category", "category")
      .where("category.type = :type", { type: CategoryType.expense })
      .andWhere("date BETWEEN :startDate AND :endDate", dateRange)
      .groupBy("date")
      .getRawMany();
  }

  static async getWeeklyTotals(dateRange: DateRange): Promise<WeeklyTotals> {
    return Transaction.createQueryBuilder("t")
      .select("strftime('%W', t.date)", "weekNumber")
      .addSelect("max(date(t.date, 'weekday 1', '-7 day'))", "weekStart")
      .addSelect("max(date(t.date, 'weekday 1', '-1 day'))", "weekEnd")
      .addSelect("SUM(t.amount)", "totalTransactions")
      .innerJoin("t.category", "category")
      .where("category.type = :type", { type: 0 })
      .andWhere("t.date BETWEEN :startDate AND :endDate", dateRange)
      .groupBy("weekNumber")
      .getRawMany();
  }
}
