import { Exclude } from 'class-transformer';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn() // Email is now the primary key
  email: string;

  @Column()
  name: string;

  @Column()
  @Exclude() // Hide password in responses
  password: string;

  @Column({ type: 'float', default: 0 })
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.sender)
  sentTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.receiver)
  receivedTransactions: Transaction[];
}
