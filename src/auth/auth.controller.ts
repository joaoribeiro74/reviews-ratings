import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ProfileResponseDto } from './dto/profile.dto';

ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Registra um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email ou username já em uso' })
  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Realiza login com email e senha' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido, retorna token' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @Post('login')
  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Retorna informações do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Req() request) {
    const user = request.user;
    
    return plainToInstance(ProfileResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Altera o email do usuário logado' })
  @ApiResponse({ status: 200, description: 'Email alterado com sucesso' })
  @ApiResponse({ status: 401, description: 'Senha atual incorreta ou usuário não autenticado' })
  @ApiResponse({ status: 409, description: 'Email já em uso' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('change-email')
  async changeEmail(@Req() req, @Body() dto: ChangeEmailDto) {
    return this.authService.changeEmail(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Altera a senha do usuário logado' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 400, description: 'Nova senha inválida ou igual à anterior' })
  @ApiResponse({ status: 401, description: 'Senha atual incorreta ou usuário não autenticado' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }
}
