import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { WalletModule } from './wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // so you don't have to import it everywhere
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   // host: 'localhost',
    //   // port: 3306,
    //   // username: 'root',
    //   // password: 'victoria2000',
    //   // database: 'fintechdb',
    //   // entities: [User],

    //   host: process.env.DB_HOST,
    //   port: 10862,
    //   username: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   entities: [User],
    //   synchronize: true,
    //   // dropSchema:true,

    // }),

    TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,  // allows self-signed certificates
  },
}),

    UsersModule,
    AuthModule,
    // TransactionsModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AppModule {}
