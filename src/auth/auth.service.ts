import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity'; // Adjust path according to your project structure
import { LoginUserDto } from './dto/login-user.dto'; // Import the DTO
import * as bcrypt from 'bcrypt';  // bcrypt for password hashing
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // Injecting UserRepository
    private jwtService: JwtService,  // Injecting JwtService to sign the token
  ) {}

  // Password comparison logic
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

}
