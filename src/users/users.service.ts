import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(data: any): Promise<User> {
    try {
      return await this.userRepository.save(data);
    } catch (error) {
      // PostgreSQL, MySQL, and SQLite all use different codes/messages — handle them generically
      if (
        error.code === 'ER_DUP_ENTRY' ||        // MySQL
        error.code === 'SQLITE_CONSTRAINT' ||   // SQLite
        error.code === '23505'                  // PostgreSQL
      ) {
        throw new BadRequestException('Email already exists');
      }

      // If it's another kind of error, rethrow
      throw error;
    }
  }

  async findOne(condition:any):Promise<User | null>{
    return this.userRepository.findOne({where:condition})
  }

    async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
      return bcrypt.compare(plainPassword, hashedPassword); // Compare plain password with hashed one
    }

  async login(loginDto: LoginUserDto) {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
  
    if (!user || !(await this.comparePassword(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async getBalance(userEmail: string) {
    const user = await this.findByEmail(userEmail);
    return { balance: user.balance };
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async fundWallet(userId: number, amount: number, description?: string) {
    const user = await this.findOne({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    user.balance += amount;

    const transaction = {
      id: uuidv4(),
      amount,
      type: 'credit',
      timestamp: new Date(),
      description: description || 'Wallet funded',
      balance: user.balance,
    };

    user.transactions = [...(user.transactions || []), transaction];
    await this.userRepository.save(user);

    return { message: 'Wallet funded successfully', balance: user.balance };
  }

  async withdraw(userId: number, amount: number, description?: string) {
    const user = await this.findOne({ id: userId });
    if (!user || user.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    user.balance -= amount;

    const transaction = {
      id: uuidv4(),
      amount,
      type: 'debit',
      timestamp: new Date(),
      description: description || 'Withdrawal',
      balance: user.balance,
    };

    user.transactions = [...(user.transactions || []), transaction];
    await this.userRepository.save(user);

    return { message: 'Withdrawal successful', balance: user.balance };
  }

  async transfer(senderId: number, recipientEmail: string, amount: number) {
    const sender = await this.findOne({ id: senderId });
    const recipient = await this.findByEmail(recipientEmail);

    if (!sender || !recipient) throw new NotFoundException('User not found');
    if (sender.email === recipient.email) throw new BadRequestException('Cannot transfer to self');
    if (sender.balance < amount) throw new BadRequestException('Insufficient balance');

    sender.balance -= amount;
    recipient.balance += amount;

    const timestamp = new Date();

    const senderTransaction = {
      id: uuidv4(),
      amount,
      type: 'transfer-out',
      timestamp,
      description: `Transferred to ${recipient.email}`,
      balance: sender.balance,
    };

    const recipientTransaction = {
      id: uuidv4(),
      amount,
      type: 'transfer-in',
      timestamp,
      description: `Received from ${sender.email}`,
      balance: recipient.balance,
    };

    sender.transactions = [...(sender.transactions || []), senderTransaction];
    recipient.transactions = [...(recipient.transactions || []), recipientTransaction];

    await this.userRepository.save([sender, recipient]);

    return {
      message: 'Transfer successful',
      senderBalance: sender.balance,
      recipientEmail: recipient.email,
    };
  }
}

