import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuizzesModule } from './quizzes/quizzes.module';
 
@Module({
  imports: [
    // Carrega as variáveis do .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexão com PostgreSQL via TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true, // carrega entidades automaticamente
      synchronize: true, // só usa true em desenvolvimento
    }),

    AuthModule,
    UsersModule,
    QuizzesModule,
  ],
})
export class AppModule {}
