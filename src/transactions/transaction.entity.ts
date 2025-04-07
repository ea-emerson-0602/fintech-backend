import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: TransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => User, user => user.sentTransactions, { nullable: true })
  sender: User;

  @ManyToOne(() => User, user => user.receivedTransactions, { nullable: true })
  receiver: User;
}
