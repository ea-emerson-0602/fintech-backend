// users/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../../wallet/entities/transaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'decimal',
    precision: 15,  // Increased precision
    scale: 2,      // Exactly 2 decimal places
    default: 0.00,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value)
    }
  })
  balance: number;

  @Column('simple-json', { nullable: true })
  transactions: Array<{
    id: string;
    amount: number;
    type: string;
    timestamp: Date;
    description: string | null;
    balance: number;
  }>;
  

  // @Column('simple-json', { default: '[]' })
  // transactions: Array<{
  //   id: string;
  //   amount: number;
  //   type: string;
  //   timestamp: Date;
  //   description: string | null;
  //   balance: number;
  // }>;
}
