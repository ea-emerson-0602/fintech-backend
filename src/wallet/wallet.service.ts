// src/transactions/transactions.service.ts
import { 
  Injectable, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from '../users/entities/user.entity';
import { TransactionType } from './enums/transaction-type.enum';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private createTransactionRecord(
    transaction: Transaction,
    balance: number,
    receiver?: User
  ) {
    return {
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      timestamp: transaction.timestamp,
      description: transaction.description,
      balance: balance,
      receiver: receiver ? { id: receiver.id, email: receiver.email } : null
    };
  }

  async deposit(userId: string, createTransactionDto: CreateTransactionDto) {
    const user = await this.userRepository.findOneBy({ id: userId as any});
    if (!user) throw new NotFoundException('User not found');
    if (!user.transactions) user.transactions = [];

    user.balance = Number(user.balance) + Number(createTransactionDto.amount);
    
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user
    });
    await this.transactionRepository.save(transaction);

    const transactionRecord = this.createTransactionRecord(
      transaction,
      user.balance
    );
    user.transactions.push(transactionRecord);
    await this.userRepository.save(user);

    return transactionRecord;
  }

  async withdraw(userId: string, createTransactionDto: CreateTransactionDto) {
    const user = await this.userRepository.findOneBy({ id: userId as any});
    if (!user) throw new NotFoundException('User not found');
    if (!user.transactions) user.transactions = [];

    if (user.balance < createTransactionDto.amount) {
      throw new BadRequestException('Insufficient funds');
    }

    user.balance -= createTransactionDto.amount;
    
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user
    });
    await this.transactionRepository.save(transaction);

    const transactionRecord = this.createTransactionRecord(
      transaction,
      user.balance
    );
    user.transactions.push(transactionRecord);
    await this.userRepository.save(user);

    return transactionRecord;
  }

  async transfer(senderEmail: string, transferDto: TransferDto) {
    // Find sender and receiver by email
    const sender = await this.userRepository.findOne({ where: { email: senderEmail } });
    if (!sender) throw new NotFoundException('Sender not found');
    if (!sender.transactions) sender.transactions = [];
  
    const receiver = await this.userRepository.findOne({ where: { email: transferDto.receiverEmail } });
    if (!receiver) throw new NotFoundException('Receiver not found');
    if (!receiver.transactions) receiver.transactions = [];
  
    // Validate transfer
    if (sender.id === receiver.id) {
      throw new BadRequestException('Cannot transfer to yourself');
    }
    if (sender.balance < transferDto.amount) {
      throw new BadRequestException('Insufficient funds');
    }
  
    // Update balances
    sender.balance -= transferDto.amount;
    receiver.balance += transferDto.amount;
  
    // Create transaction for sender
    const transaction = this.transactionRepository.create({
      amount: transferDto.amount,
      type: TransactionType.TRANSFER,
      user: sender,
      receiver,
      description: transferDto.description,
    });
    await this.transactionRepository.save(transaction);
  
    // Create transaction records
    const senderRecord = this.createTransactionRecord(
      transaction,
      sender.balance,
      receiver,
    );
    sender.transactions.push(senderRecord);
  
    const receiverRecord = this.createTransactionRecord(
      transaction,
      receiver.balance,
      sender,
    );
    receiver.transactions.push(receiverRecord);
  
    // Save both users
    await this.userRepository.save(sender);
    await this.userRepository.save(receiver);
  
    return senderRecord;
  }
  
  async getTransactions(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId as any});
    if (!user) throw new NotFoundException('User not found');
    return user.transactions || [];
  }
}