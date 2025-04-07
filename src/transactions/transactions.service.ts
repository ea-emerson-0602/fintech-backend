// src/transactions/transactions.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction, TransactionType } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Create a new transaction
  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const sender = await this.userRepository.findOne({ where: { id: createTransactionDto.senderId } });
    if (!sender) throw new NotFoundException('Sender not found');

    if (createTransactionDto.type === TransactionType.WITHDRAWAL && sender.balance < createTransactionDto.amount) {
      throw new BadRequestException('Insufficient funds');
    }

    let receiver: User | null = null;
    if (createTransactionDto.type === TransactionType.TRANSFER && createTransactionDto.receiverId) {
      receiver = await this.userRepository.findOne({ where: { id: createTransactionDto.receiverId } });
      if (!receiver) throw new NotFoundException('Receiver not found');
    }

    // Here, we make sure to pass 'null' if it's not a transfer transaction
    const transaction = this.transactionRepository.create({
      sender,
      receiver: createTransactionDto.type === TransactionType.TRANSFER ? receiver : null,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      timestamp: new Date(),
    });

    await this.transactionRepository.save(transaction);

    // Update sender's balance
    await this.updateBalance(sender, createTransactionDto);

    if (receiver) {
      // Update receiver's balance if the transaction is a transfer
      await this.updateBalance(receiver, createTransactionDto, true);
    }

    return transaction;
  }

  // Update balance after transaction
  async updateBalance(user: User, createTransactionDto: CreateTransactionDto, isReceiver = false) {
    if (createTransactionDto.type === TransactionType.DEPOSIT || (createTransactionDto.type === TransactionType.TRANSFER && isReceiver)) {
      user.balance += createTransactionDto.amount;
    } else if (createTransactionDto.type === TransactionType.WITHDRAWAL || (createTransactionDto.type === TransactionType.TRANSFER && !isReceiver)) {
      user.balance -= createTransactionDto.amount;
    }

    await this.userRepository.save(user);
  }

  // Get all transactions of a user
  async getTransactions(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ['sender', 'receiver'],
      order: { timestamp: 'DESC' },
    });
  }
}
