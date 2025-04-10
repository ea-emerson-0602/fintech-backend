import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('auth/register')
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ description: 'User successfully registered' })
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });

    const { password: _, ...safeUser } = user; // ✅ Rename `password` to `_` or any throwaway name
    return safeUser;
  }

  @Post('auth/login')
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ description: 'User logged in successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new BadRequestException('Invalid credential');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credential');
    }
    const jwt = await this.jwtService.signAsync({ id: user.id }, { expiresIn: '1h' });

    response.cookie('jwt', jwt, {
      httpOnly: true,
      secure: true, // only send cookie over HTTPS in production
      sameSite: 'none', // 'strict' or 'lax' depending on your use case
      maxAge: 3600000, // 1 hour
    });
    return { user_details: user };
    
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.usersService.findOne({ id: data['id'] });

      const { password, ...result } = user!;
      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'Successfully logged out',
    };
  }

  @Get('user/balance')
  async getBalance(@Req() request: Request) {
    try {
      // Retrieve the JWT token from the cookies
      const cookie = request.cookies['jwt'];

      if (!cookie) {
        throw new UnauthorizedException('Token not found');
      }

      // Verify the token using JwtService
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException('Invalid token');
      }

      // Fetch the user using the ID from the JWT payload
      const user = await this.usersService.findOne({ id: data['id'] });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Fetch and return the user's balance
      const balance = await this.usersService.getBalance(user.email);

      return { balance }; // Return balance in an object or modify as per your response format
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @ApiBody({ type: FundWalletDto })
  @Post('wallet/fund')
  async fundWallet(
    @Req() request: Request,
    @Body('amount') amount: number,
    @Body('description') description?: string,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);

    return this.usersService.fundWallet(data['id'], amount, description);
  }

  @ApiBody({ type: WithdrawDto })
  @Post('wallet/withdraw')
  async withdraw(
    @Req() request: Request,
    @Body('amount') amount: number,
    @Body('description') description?: string,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);

    return this.usersService.withdraw(data['id'], amount, description);
  }

  @ApiBody({ type: TransferDto })
  @Post('wallet/transfer')
  async transfer(
    @Req() request: Request,
    @Body('recipientEmail') recipientEmail: string,
    @Body('amount') amount: number,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);

    return this.usersService.transfer(data['id'], recipientEmail, amount);
  }

  @ApiOkResponse({ type: [TransactionResponseDto] })
  @Get('transactions')
  async getUserTransactions(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.usersService.findOne({ id: data['id'] });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return { transactions: user.transactions || [] };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
