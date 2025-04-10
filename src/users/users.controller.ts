import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator'; // 👈 Add this decorator
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth/auth.service';

@ApiTags('Users')
@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('auth/register')
  register(@Body() dto: CreateUserDto) {
    return this.usersService.register(dto);
  }

   @Post('auth/login')
    async login(@Body() loginUserDto: LoginUserDto) {
      const response = await this.usersService.login(loginUserDto); // Assuming login() returns an object with token and user properties
      if (response && response.user) {
        return {
          token: response.token,
          user: response.user, // Directly returning the user object
        };
      }
      throw new UnauthorizedException('Invalid credentials');
    }

 // ✅ Get User Details (by email instead of JWT)
@Get('user/:email')
getUser(@Param('email') email: string) {
  return this.usersService.findByEmail(email); // You can rename to `getUser` or similar in your service
}

// ✅ Get User Balance
@Get('user/:email/balance')
getBalance(@Param('email') email: string) {
  return this.usersService.getBalance(email);
}

// ✅ Get Wallet Balance (same as above, just another route if needed)
@Get('wallet/:email/balance')
walletBalance(@Param('email') email: string) {
  return this.usersService.getBalance(email);
}

// ✅ Get Transactions
@Get('wallet/:email/transactions')
walletTransactions(@Param('email') email: string) {
  return this.usersService.getTransactions(email);
}

}
