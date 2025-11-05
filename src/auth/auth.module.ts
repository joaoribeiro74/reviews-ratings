// auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy' // (criaremos em breve)
import { PrismaService } from 'src/prisma/prisma.service'; 
import { AdminController } from './admin.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'minha_chave_secreta', 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  controllers: [AuthController, AdminController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}