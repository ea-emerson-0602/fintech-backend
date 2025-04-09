import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator'; // 👈 Add this decorator
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Users')
@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('auth/register')
  register(@Body() dto: CreateUserDto) {
    return this.usersService.register(dto);
  }

  @Post('auth/login')
  login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto);
  }

  @Get('user/:email/balance')
  getBalance(@Param('email') email: string) {
    return this.usersService.getBalance(email);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('user/me')
  me(@CurrentUser() user: any) {
    console.log('Logged-in user:', user); // ✅ You'll see the actual user here
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('wallet/balance')
  balance(@CurrentUser() user: any) {
    return this.usersService.getBalance(user.email);
  }
}
