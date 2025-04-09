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
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'victoria2000',
      database: 'fintechdb',
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
