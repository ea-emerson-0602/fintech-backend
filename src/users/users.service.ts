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

    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;  // Exclude password
    return result;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({ where: { email: loginUserDto.email } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ email: user.email });
    return { token };
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
}
