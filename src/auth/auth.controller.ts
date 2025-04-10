import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const response = await this.authService.login(loginUserDto); // Assuming login() returns an object with token and user properties
    if (response && response.user) {
      return {
        token: response.token,
        user: response.user, // Directly returning the user object
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
