import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";

@Entity("Budget")
export class Budget {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("varchar")
  description: string;

  @Column("float")
  maxAmount: number;

  @Column("date")
  startDate: string;

  @Column("date")
  endDate: string;

  @Column("boolean")
  isActive: boolean;

  @ManyToOne(() => Category, (category) => category.budgets)
  category: Category;

  @Column("date")
  createdAt: string;

  @Column("date")
  updatedAt: string;

  @BeforeInsert()
  _onBeforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}
