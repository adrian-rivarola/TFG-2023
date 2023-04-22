import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import type { Category } from "./Category";

@Entity("Transaction")
export class Transaction {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("varchar")
  description: string;

  @Column("float")
  amount: number;

  @Column("date")
  date: Date;

  @ManyToOne("Category", "transactions", {
    eager: true,
  })
  @JoinColumn()
  category: Relation<Category>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
