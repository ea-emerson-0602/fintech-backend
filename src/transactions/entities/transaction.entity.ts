// src/transactions/entities/transaction.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
// import { User } from 'src/users/entities/user.entity';
import { User } from '../../users/entities/user.entity';
// import { User } from 'src/users/user.entity';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @ManyToOne(() => User, (user) => user.sentTransactions)
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedTransactions, { nullable: true })
  receiver?: User;

  @CreateDateColumn()
  timestamp: Date;
}
