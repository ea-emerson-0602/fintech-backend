import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existing = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existing) throw new UnauthorizedException('Email already in use');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.userRepository.save({
      email: createUserDto.email,
      password: hashedPassword,
      transactions: [],
    });

    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;  // Exclude password
    return result;
  }

    async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
      return bcrypt.compare(plainPassword, hashedPassword); // Compare plain password with hashed one
    }

  async login(loginDto: LoginUserDto) {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
  
    if (!user || !(await this.comparePassword(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload = { email: user.email, id: user.id };
    const token = this.jwtService.sign(payload);
  
    return {
      token,
      user: {
        email: user.email,
        id: user.id
      }
    };
  }

  async getBalance(userEmail: string) {
    const user = await this.findByEmail(userEmail);
    return { balance: user.balance };
  }

  async getTransactions(userEmail:string){
    const user = await this.findByEmail(userEmail)
    return {transactions:user.transactions}
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
