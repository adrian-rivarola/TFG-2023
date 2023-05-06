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

type DailyTotals = Array<{ date: string; total: number }>;
type WeeklyTotals = Array<{
  weekNumber: string;
  weekStart: string;
  weekEnd: string;
  totalTransactions: number;
}>;

type CategoryTotals = Array<{
  category: string;
  total: number;
}>;

@Entity("Transaction")
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("varchar")
  description: string;

  @Column("float", {
    nullable: false,
  })
  amount: number;

  @Column("date")
  date: Date;

  @ManyToOne("Category", "transactions", {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  @Index()
  category: Relation<Category>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  budgets?: Budget[];

  static async getTotalsByCategoryType(
    categoryType: CategoryType,
    startDate: string,
    endDate: string
  ): Promise<CategoryTotals> {
    return Transaction.createQueryBuilder("t")
      .select("category.name", "category")
      .addSelect("SUM(t.amount)", "total")
      .innerJoin("t.category", "category")
      .where("category.type = :type", { type: categoryType })
      .andWhere("date BETWEEN :startDate AND :endDate", { startDate, endDate })
      .orderBy("total", "DESC")
      .groupBy("category.name")
      .getRawMany();
  }

  static getDailyTotals(
    startDate: string,
    endDate: string
  ): Promise<DailyTotals> {
    return Transaction.createQueryBuilder("t")
      .select("date", "date")
      .addSelect("SUM(amount)", "total")
      .innerJoin("t.category", "category")
      .where("category.type = :type", { type: CategoryType.expense })
      .andWhere("date BETWEEN :startDate AND :endDate", { startDate, endDate })
      .groupBy("date")
      .getRawMany();
  }

  static async getWeeklyTotals(
    startDate: string,
    endDate: string
  ): Promise<WeeklyTotals> {
    return Transaction.createQueryBuilder("t")
      .select("strftime('%W', t.date)", "weekNumber")
      .addSelect("max(date(t.date, 'weekday 1', '-7 day'))", "weekStart")
      .addSelect("max(date(t.date, 'weekday 1', '-1 day'))", "weekEnd")
      .addSelect("SUM(t.amount)", "totalTransactions")
      .innerJoin("t.category", "category")
      .where("category.type = :type", { type: 0 })
      .andWhere("t.date BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .groupBy("weekNumber")
      .getRawMany();
  }
}
