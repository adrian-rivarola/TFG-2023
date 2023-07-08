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
} from 'typeorm';

import { Category, CategoryType } from './Category';
import type { DateRange } from '@/types';

type DayTotal = { date: string; amount: number };

export type TransactionFormData = {
  id?: number;
  date: string;
  amount: number;
  category?: number;
  description: string;
};

export type CategoryTotal = {
  category: Category;
  total: number;
  count: number;
};

@Entity('Transaction')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    default: '',
  })
  description: string;

  @Column('float', {
    nullable: false,
  })
  amount: number;

  @Column('date')
  date: string;

  @ManyToOne('Category', 'transactions', {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  @Index()
  category: Relation<Category>;

  @CreateDateColumn()
  createdAt: Date;

  static async getTotalSpentAndCount(
    categoryType: CategoryType,
    dateRange?: DateRange
  ): Promise<CategoryTotal[]> {
    const query = Transaction.createQueryBuilder('t')
      .innerJoin('t.category', 'c')
      .select('SUM(t.amount)', 'total')
      .addSelect('COUNT(t.id)', 'count')
      .where('c.type = :type', { type: categoryType })
      .orderBy('total', 'DESC')
      .groupBy('c.id');

    query
      .addSelect('c.id', 'id')
      .addSelect('c.name', 'name')
      .addSelect('c.icon', 'icon')
      .addSelect('c.type', 'type');

    if (dateRange) {
      query.andWhere('date BETWEEN :startDate AND :endDate', dateRange);
    }

    const result = await query.getRawMany();
    return result.map(({ total, count, ...cat }) => ({
      total,
      count,
      category: Category.create(cat),
    }));
  }

  static getDailyTotals(dateRange: DateRange): Promise<DayTotal[]> {
    return Transaction.createQueryBuilder('t')
      .select('date', 'date')
      .addSelect('SUM(amount)', 'amount')
      .innerJoin('t.category', 'category')
      .where('category.type = :type', { type: CategoryType.expense })
      .andWhere('date BETWEEN :startDate AND :endDate', dateRange)
      .groupBy('date')
      .getRawMany();
  }

  serialize(): TransactionFormData {
    return {
      id: this.id,
      date: this.date,
      amount: this.amount,
      category: this.category.id,
      description: this.description,
    };
  }
}
