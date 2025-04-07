import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  balance: number;

  @OneToMany(() => Transaction, transaction => transaction.sender)
  sentTransactions: Transaction[];

  @OneToMany(() => Transaction, transaction => transaction.receiver)
  receivedTransactions: Transaction[];
}
