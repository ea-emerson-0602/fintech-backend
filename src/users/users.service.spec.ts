import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';  // bcrypt import

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be able to register a user', async () => {
    // Include 'name' property in the createUserDto to match CreateUserDto structure
    const createUserDto = { name: 'Test User', email: 'test@test.com', password: 'password123' };
    const user = { id: 1, ...createUserDto, password: 'hashedpassword' };

    // Mock bcrypt.hash to return a hashed password
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');

    // Mock the save method of the repository to return the user
    jest.spyOn(repository, 'save').mockResolvedValue(user as any);

    // Call the register method with the modified createUserDto
    const result = await service.register(createUserDto);

    // Expect the result to not contain the password field
    expect(result).toEqual({ id: 1, name: 'Test User', email: 'test@test.com' });
  });

  it('should login a user and return a token', async () => {
    const loginUserDto = { email: 'test@test.com', password: 'password123' };
    const user = { id: 1, email: 'test@test.com', password: 'hashedpassword' };

    // Mock repository to return the user when finding by email
    jest.spyOn(repository, 'findOne').mockResolvedValue(user as any);

    // Mock bcrypt.compare to simulate password comparison
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    // Mock JWT sign method to return a token
    jest.spyOn(service['jwtService'], 'sign').mockReturnValue('jwt-token');

    // Call the login method with the loginUserDto
    const result = await service.login(loginUserDto);

    // Expect the result to return a token
    expect(result).toEqual({ token: 'jwt-token' });
  });
});
