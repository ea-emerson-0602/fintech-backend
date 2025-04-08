import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Transaction } from './transactions/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST, // Access DB_HOST from .env file
      port: (process.env.DB_PORT, 10),
      username: process.env.DB_USER, // Access DB_USER from .env file
      password: process.env.DB_PASSWORD, // Access DB_PASSWORD from .env file
      database: process.env.DB_NAME,
      entities: [User, Transaction],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
