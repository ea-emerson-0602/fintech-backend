import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
  
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
  
    const payload = { email: user.email };
    const token = this.jwtService.sign(payload);
    return { token };  // Ensure that the correct user info is being returned, or if needed, additional user info.
  }
  
}
