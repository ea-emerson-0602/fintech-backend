// src/transactions/entities/transaction.entity.ts
import { User } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { TransactionType } from '../enums/transaction-type.enum'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value)
    }
  })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.transactions, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver?: User;

  @Column({ nullable: true })
  description: string;
}