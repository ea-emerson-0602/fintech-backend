// auth.controller.ts
import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  @Post('register')
  register() {
    return 'Registration endpoint';
  }

  @Post('login')
  login() {
    return 'Login endpoint';
  }
}
