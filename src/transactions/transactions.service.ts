// src/transactions/transactions.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userEmail: string) {
    const sender = await this.userRepository.findOne({ where: { email: userEmail } });
    if (!sender) throw new NotFoundException('Sender not found');

    const amount = createTransactionDto.amount;

    let receiver: User | null = null;
    if (createTransactionDto.type === TransactionType.TRANSFER) {
      if (!createTransactionDto.receiverEmail)
        throw new BadRequestException('Receiver email is required for transfer');

      receiver = await this.userRepository.findOne({
        where: { email: createTransactionDto.receiverEmail },  // Find by email instead of ID
      });
      if (!receiver) throw new NotFoundException('Receiver not found');

      if (receiver.email === sender.email)
        throw new BadRequestException('Cannot transfer to self');
    }

    if (
      [TransactionType.WITHDRAWAL, TransactionType.TRANSFER].includes(createTransactionDto.type) &&
      sender.balance < amount
    ) {
      throw new BadRequestException('Insufficient funds');
    }

    // Update balances
    if (createTransactionDto.type === TransactionType.DEPOSIT) {
      sender.balance += amount;
      await this.userRepository.save(sender);
    } else if (createTransactionDto.type === TransactionType.WITHDRAWAL) {
      sender.balance -= amount;
    } else if (createTransactionDto.type === TransactionType.TRANSFER && receiver) {
      sender.balance -= amount;
      receiver.balance += amount;
      await this.userRepository.save(receiver);
    }

    await this.userRepository.save(sender);

    const transaction = this.transactionRepository.create({
      amount,
      type: createTransactionDto.type,
      sender,
      receiver: receiver ?? undefined,
    });

    return this.transactionRepository.save(transaction);
  }

  async findAll(userEmail: string) {
    return this.transactionRepository.find({
      where: [{ sender: { email: userEmail } }, { receiver: { email:userEmail} }],
      relations: ['sender', 'receiver'],
      order: { timestamp: 'DESC' },
    });
  }
}
