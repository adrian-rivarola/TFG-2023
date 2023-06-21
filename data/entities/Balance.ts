import dayjs from "dayjs";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DateRange } from "../../utils/dateUtils";

@Entity("Balance")
export class Balance extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("float", {
    default: 0,
  })
  initialBalance: number;

  static async setInitialBalance(amount: number) {
    await Balance.clear();
    return Balance.save({
      initialBalance: amount,
    });
  }

  static async getTotalBalance(): Promise<number> {
    const res = await Balance.query(
      `
      SELECT ib.amount + income.amount - expense.amount AS amount
      FROM (
        SELECT COALESCE(SUM(initialBalance), 0) AS amount
        FROM Balance
      ) AS ib
      LEFT JOIN (
        SELECT COALESCE(SUM(t.amount), 0) AS amount
        FROM "Transaction" t
        JOIN Category c ON t.categoryId = c.id
        WHERE c. "type" = 1
      ) AS income ON 1 = 1
      LEFT JOIN (
        SELECT COALESCE(SUM(t.amount), 0) AS amount
        FROM "Transaction" t
        JOIN Category c ON t.categoryId = c.id
        WHERE c. "type" = 0
      ) AS expense ON 1 = 1
      LIMIT 1;
      `
    ).then((results) => results[0]);

    return res?.amount || 0;
  }

  static async getPartialBalance(dateRange: DateRange) {
    const { startDate, endDate } = dateRange;

    const dateQuery = `t."date" BETWEEN '${startDate}' AND '${endDate}'`;
    const sqlQuery = `
      SELECT income.amount as totalIncome, expense.amount AS totalExpense
      FROM (
        SELECT COALESCE(SUM(t.amount), 0) AS amount
        FROM "Transaction" t
        JOIN Category c ON t.categoryId = c.id
        WHERE c. "type" = 1
        AND ${dateQuery}
      ) AS income
      LEFT JOIN (
        SELECT COALESCE(SUM(t.amount), 0) AS amount
        FROM "Transaction" t
        JOIN Category c ON t.categoryId = c.id
        WHERE c. "type" = 0
        AND ${dateQuery}
      ) AS expense ON 1 = 1
      LIMIT 1;
    `;

    const res: {
      totalIncome: number;
      totalExpense: number;
    } = await Balance.query(sqlQuery).then((results) => results[0]);

    return res;
  }
}
