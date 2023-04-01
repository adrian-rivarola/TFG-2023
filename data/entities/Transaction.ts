import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";

@Entity("Transaction")
export class Transaction {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("varchar")
  description: string;

  @Column("float")
  amount: number;

  @ManyToOne(() => Category, (category) => category.transactions)
  category: Category;

  @Column("date")
  createdAt: string;

  @Column("date")
  updatedAt: string;

  @BeforeInsert()
  onBeforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}
