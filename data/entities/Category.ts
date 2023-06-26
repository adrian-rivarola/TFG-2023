import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum CategoryType {
  expense,
  income,
}

export type CategoryFormData = {
  id?: number;
  name: string;
  icon: string;
  type: CategoryType;
};

@Entity('Category')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', {
    unique: true,
    nullable: false,
  })
  name: string;

  @Column('varchar')
  icon: string;

  @Column('int', {
    nullable: false,
  })
  type: number;

  @CreateDateColumn()
  createdAt: Date;

  get isExpense() {
    return this.type === CategoryType.expense;
  }

  get isIncome() {
    return this.type === CategoryType.income;
  }

  serialize(): CategoryFormData {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      icon: this.icon,
    };
  }
}
